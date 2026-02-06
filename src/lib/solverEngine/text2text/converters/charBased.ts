import type { ConvertResult, MappingDefinition } from "../../types";
import { alphabetToNumber, numberToAlphabet } from "../mappings/alphabet";

/**
 * 1文字ずつ変換する（charBased）
 */

/** セパレータで分割する共通処理 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function splitBySeparator(input: string, separator: string): string[] {
  const escaped = escapeRegex(separator);
  const pattern = new RegExp(`${escaped}+`);
  return input.split(pattern).filter(t => t.length > 0);
}

/** アルファベット → 数値 */
export function alphabet2Number(input: string, separator: string): ConvertResult {
  const tokens = splitBySeparator(input, separator);
  return tokens.flatMap((token) =>
    token.split("").map((char) => {
      const num = alphabetToNumber(char);
      return num ?? "";
    })
  );
}

/** 数値 → アルファベット */
export function number2Alphabet(input: string, separator: string): ConvertResult {
  const tokens = splitBySeparator(input, separator);

  return tokens.map((token) => {
    const num = parseInt(token, 10);
    const result = numberToAlphabet(num);
    return result ?? "";
  });
}

/** マッピング定義から、文字 → 数値 の変換を行う（aliases も対応） */
export function charToNumber(input: string, mapping: MappingDefinition, separator: string): ConvertResult {
  const tokens = splitBySeparator(input, separator);
  return tokens.flatMap((token) =>
    token.split("").map((char) => {
      // primary をチェック
      const idx = mapping.primary.indexOf(char);
      if (idx !== -1) return idx + 1;

      // aliases をチェック
      if (mapping.aliases) {
        for (const aliasList of mapping.aliases) {
          const aliasIdx = aliasList.indexOf(char);
          if (aliasIdx !== -1) return aliasIdx + 1;
        }
      }

      return "";
    })
  );
}

/** マッピング定義から、数値 → 文字 の変換を行う */
export function numberToChar(input: string, mapping: MappingDefinition, separator: string): ConvertResult {
  const tokens = splitBySeparator(input, separator);

  return tokens.map((token) => {
    const num = parseInt(token, 10);
    if (!isNaN(num) && num >= 1 && num <= mapping.primary.length) {
      return mapping.primary[num - 1];
    }
    return "";
  });
}

/**
 * シーザー暗号: 文字を指定した数だけシフトする
 * アルファベット、ひらがな、カタカナに対応
 */
export function caesarShift(input: string, shift: number): string {
  return input.split("").map((char) => {
    const code = char.charCodeAt(0);

    // 大文字 A-Z (65-90)
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
    }
    // 小文字 a-z (97-122)
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
    }
    // ひらがな あ-ん (12353-12435, 83文字 ぁ-ん)
    if (code >= 12353 && code <= 12435) {
      const hiraganaLen = 12435 - 12353 + 1;
      return String.fromCharCode(((code - 12353 + shift) % hiraganaLen + hiraganaLen) % hiraganaLen + 12353);
    }
    // カタカナ ア-ン (12449-12531, 83文字 ァ-ン)
    if (code >= 12449 && code <= 12531) {
      const katakanaLen = 12531 - 12449 + 1;
      return String.fromCharCode(((code - 12449 + shift) % katakanaLen + katakanaLen) % katakanaLen + 12449);
    }

    return char;
  }).join("");
}
