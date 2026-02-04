export type BrainfuckOp = ">" | "<" | "+" | "-" | "." | "," | "[" | "]";

export interface TokenMapping {
  ">": string;
  "<": string;
  "+": string;
  "-": string;
  ".": string;
  ",": string;
  "[": string;
  "]": string;
}

/**
 * ソースコードをトークンマッピングに基づいてBrainfuck命令列に変換する。
 * マッピングのvalueが長いものから先にマッチさせる（貪欲マッチ）。
 */
export function tokenize(source: string, mapping: TokenMapping): BrainfuckOp[] {
  const entries = Object.entries(mapping)
    .map(([op, token]) => ({ op: op as BrainfuckOp, token }))
    .sort((a, b) => b.token.length - a.token.length);

  const ops: BrainfuckOp[] = [];
  let i = 0;
  while (i < source.length) {
    let matched = false;
    for (const { op, token } of entries) {
      if (source.startsWith(token, i)) {
        ops.push(op);
        i += token.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      i++; // 未知の文字は無視
    }
  }
  return ops;
}

/**
 * Brainfuck命令列を実行して出力文字列を返す。
 * エラー時は "Error: ..." で始まる文字列を返す。
 */
export function execute(ops: BrainfuckOp[]): string {
  const memory = new Uint8Array(30000);
  let pointer = 0;
  let output = "";
  let ip = 0;
  let steps = 0;
  const maxSteps = 1_000_000;

  // Pre-compute bracket pairs
  const brackets: Record<number, number> = {};
  const stack: number[] = [];
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === "[") {
      stack.push(i);
    } else if (ops[i] === "]") {
      if (stack.length === 0) return "Error: 対応しない ] があります";
      const open = stack.pop()!;
      brackets[open] = i;
      brackets[i] = open;
    }
  }
  if (stack.length > 0) return "Error: 対応しない [ があります";

  while (ip < ops.length) {
    if (++steps > maxSteps) return output + "\n(実行ステップ上限に達しました)";

    switch (ops[ip]) {
      case ">":
        pointer = (pointer + 1) % 30000;
        break;
      case "<":
        pointer = (pointer - 1 + 30000) % 30000;
        break;
      case "+":
        memory[pointer]++;
        break;
      case "-":
        memory[pointer]--;
        break;
      case ".":
        output += String.fromCharCode(memory[pointer]);
        break;
      case ",":
        memory[pointer] = 0;
        break;
      case "[":
        if (memory[pointer] === 0) ip = brackets[ip];
        break;
      case "]":
        if (memory[pointer] !== 0) ip = brackets[ip];
        break;
    }
    ip++;
  }

  return output;
}
