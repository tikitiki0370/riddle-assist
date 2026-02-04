import type { ConvertResult, MappingDefinition } from "../../types";
import { alphabetToNumber, numberToAlphabet } from "../mappings/alphabet";

/**
 * 1文字ずつ変換する（charBased）
 */

/** アルファベット → 数値 */
export function alphabet2Number(input: string): ConvertResult {
  return input.split("").map((char) => {
    const num = alphabetToNumber(char);
    return num ?? "";
  });
}

/** 数値 → アルファベット */
export function number2Alphabet(input: string): ConvertResult {
  // 区切り文字（スペース、カンマ、全角スペースなど）で分割
  const tokens = input.split(/[\s,、　]+/).filter(t => t.length > 0);

  return tokens.map((token) => {
    const num = parseInt(token, 10);
    const result = numberToAlphabet(num);
    return result ?? "";
  });
}

/** マッピング定義から、文字 → 数値 の変換を行う（aliases も対応） */
export function charToNumber(input: string, mapping: MappingDefinition): ConvertResult {
  return input.split("").map((char) => {
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
  });
}

/** マッピング定義から、数値 → 文字 の変換を行う */
export function numberToChar(input: string, mapping: MappingDefinition): ConvertResult {
  // 区切り文字（スペース、カンマ、全角スペースなど）で分割
  const tokens = input.split(/[\s,、　]+/).filter(t => t.length > 0);

  return tokens.map((token) => {
    const num = parseInt(token, 10);
    if (!isNaN(num) && num >= 1 && num <= mapping.primary.length) {
      return mapping.primary[num - 1];
    }
    return "";
  });
}
