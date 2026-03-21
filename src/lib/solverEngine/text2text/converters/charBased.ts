import type { ConvertResult, MappingDefinition } from "../../types";
import { alphabetToNumber, numberToAlphabet } from "../mappings/alphabet";
import { HIRAGANA } from "../mappings/hiragana";

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
const HIRA_PRIMARY = HIRAGANA.primary as string[];
const KATA_PRIMARY = HIRAGANA.aliases![0] as string[];
const HIRA_MAP = new Map(HIRA_PRIMARY.map((c, i) => [c, i]));
const KATA_MAP = new Map(KATA_PRIMARY.map((c, i) => [c, i]));
const KANA_LEN = HIRA_PRIMARY.length; // 46

export function caesarShift(input: string, shift: number): string {
  return [...input].map((char) => {
    const code = char.charCodeAt(0);

    // 大文字 A-Z
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
    }
    // 小文字 a-z
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
    }
    // ひらがな（標準46文字のみ）
    const hIdx = HIRA_MAP.get(char);
    if (hIdx !== undefined) {
      return HIRA_PRIMARY[((hIdx + shift) % KANA_LEN + KANA_LEN) % KANA_LEN];
    }
    // カタカナ（標準46文字のみ）
    const kIdx = KATA_MAP.get(char);
    if (kIdx !== undefined) {
      return KATA_PRIMARY[((kIdx + shift) % KANA_LEN + KANA_LEN) % KANA_LEN];
    }

    return char;
  }).join("");
}
