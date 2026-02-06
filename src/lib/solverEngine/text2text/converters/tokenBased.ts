import type { ConvertResult, MappingDefinition } from "../../types";
import { splitBySeparator } from "./charBased";

/**
 * 複数文字トークンをマッチさせる変換（tokenBased）
 * 長いトークンを優先してマッチする
 */

/** トークン → 数値 (単一トークンのマッチング処理) */
function matchTokenToNumber(input: string, mapping: MappingDefinition): ConvertResult {
  // 全てのマッピングリストを結合（primary + aliases）
  const allLists: readonly string[][] = [
    [...mapping.primary],
    ...(mapping.aliases ?? []).map(a => [...a]),
  ];

  // 長いトークン順にソートしたエントリを作成
  const entries: { token: string; index: number }[] = [];
  for (const list of allLists) {
    for (let i = 0; i < list.length; i++) {
      entries.push({ token: list[i], index: i });
    }
  }
  entries.sort((a, b) => b.token.length - a.token.length);

  const result: ConvertResult = [];
  let remaining = input;

  while (remaining.length > 0) {
    let matched = false;
    for (const { token, index } of entries) {
      if (remaining.startsWith(token)) {
        result.push(index + 1);
        remaining = remaining.slice(token.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      result.push("");
      remaining = remaining.slice(1);
    }
  }

  return result;
}

/** トークン → 数値 */
export function tokenToNumber(input: string, mapping: MappingDefinition, separator: string): ConvertResult {
  const tokens = splitBySeparator(input, separator);
  return tokens.flatMap((token) => matchTokenToNumber(token, mapping));
}

/** 数値 → トークン（primary配列を使用） */
export function numberToToken(input: string, mapping: MappingDefinition, separator: string): ConvertResult {
  const tokens = splitBySeparator(input, separator);

  return tokens.map((token) => {
    const num = parseInt(token, 10);
    if (!isNaN(num) && num >= 1 && num <= mapping.primary.length) {
      return mapping.primary[num - 1];
    }
    return "";
  });
}
