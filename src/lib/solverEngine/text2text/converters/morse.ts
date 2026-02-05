import { MORSE_ALPHABET, MORSE_HIRAGANA } from "../mappings/morse";

/** カタカナ → ひらがな */
function katakanaToHiragana(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 12449 && code <= 12534) {
    return String.fromCharCode(code - 96);
  }
  return char;
}

/** 正規化: ドットとダッシュのバリエーションを統一 */
function normalizeMorse(input: string): string {
  return input
    .replace(/[.\u00B7\u2022\u2219\u22C5]/g, "・")
    .replace(/[-\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, "−");
}

/** テキスト → モールス信号（英文） */
export function text2Morse(input: string): string {
  return input
    .split("")
    .map((char) => {
      const upper = char.toUpperCase();
      if (MORSE_ALPHABET[upper]) return MORSE_ALPHABET[upper];
      if (char === " " || char === "　") return "/";
      return "";
    })
    .filter((code) => code !== "")
    .join(" ");
}

/** テキスト → モールス信号（和文） */
export function text2MorseJa(input: string): string {
  return input
    .split("")
    .map((char) => {
      const hiragana = katakanaToHiragana(char);
      if (MORSE_HIRAGANA[hiragana]) return MORSE_HIRAGANA[hiragana];
      if (char === " " || char === "　") return "/";
      return "";
    })
    .filter((code) => code !== "")
    .join(" ");
}

/** モールス信号 → テキスト（英文） */
export function morse2Text(input: string): string {
  const normalized = normalizeMorse(input);
  const words = normalized.split(/\s*\/\s*/);

  return words
    .map((word) => {
      const codes = word.split(/\s+/).filter((c) => c.length > 0);
      return codes
        .map((code) => {
          for (const [char, morse] of Object.entries(MORSE_ALPHABET)) {
            if (morse === code) return char.toLowerCase();
          }
          return "?";
        })
        .join("");
    })
    .join(" ");
}

/** モールス信号 → テキスト（和文） */
export function morse2TextJa(input: string): string {
  const normalized = normalizeMorse(input);
  const hiraganaEntries = Object.entries(MORSE_HIRAGANA).sort(
    (a, b) => b[1].length - a[1].length
  );
  const alphabetEntries = Object.entries(MORSE_ALPHABET).sort(
    (a, b) => b[1].length - a[1].length
  );

  const words = normalized.split(/\s*\/\s*/);

  return words
    .map((word) => {
      let remaining = word.trim();
      const result: string[] = [];

      while (remaining.length > 0) {
        let matched = false;

        for (const [char, morse] of hiraganaEntries) {
          if (remaining === morse || remaining.startsWith(morse + " ")) {
            result.push(char);
            remaining = remaining.slice(morse.length).trimStart();
            matched = true;
            break;
          }
        }
        if (matched) continue;

        for (const [char, morse] of alphabetEntries) {
          if (remaining === morse || remaining.startsWith(morse + " ")) {
            result.push(char.toLowerCase());
            remaining = remaining.slice(morse.length).trimStart();
            matched = true;
            break;
          }
        }
        if (matched) continue;

        const spaceIdx = remaining.indexOf(" ");
        result.push("?");
        remaining = spaceIdx === -1 ? "" : remaining.slice(spaceIdx).trimStart();
      }

      return result.join("");
    })
    .join(" ");
}
