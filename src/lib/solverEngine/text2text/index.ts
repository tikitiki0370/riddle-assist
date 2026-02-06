// マッピング
export {
  alphabetToNumber,
  numberToAlphabet,
  HIRAGANA,
  IROHA,
  ZODIAC,
  STARSIGN,
  CALENDAR,
  MUSICAL_SCALE,
  RAINBOW,
  MORSE_ALPHABET,
  MORSE_HIRAGANA,
} from "./mappings";

// コンバーター
export {
  alphabet2Number,
  number2Alphabet,
  charToNumber,
  numberToChar,
  tokenToNumber,
  numberToToken,
  caesarShift,
  text2Morse,
  text2MorseJa,
  morse2Text,
  morse2TextJa,
} from "./converters";

// 便利関数: 各変換を直接呼び出せるように
import { alphabetToNumber, HIRAGANA, IROHA, ZODIAC, STARSIGN, CALENDAR, MUSICAL_SCALE, RAINBOW } from "./mappings";
import { charToNumber, numberToChar, tokenToNumber, numberToToken, splitBySeparator } from "./converters";
import type { ConvertResult } from "../types";

/** 汎用文字→数値変換（アルファベット + ひらがな + カタカナ） */
export function text2Number(input: string, separator: string): ConvertResult {
  const tokens = splitBySeparator(input, separator);
  return tokens.flatMap((token) =>
    token.split("").map((char) => {
      // アルファベットをチェック
      const alphaNum = alphabetToNumber(char);
      if (alphaNum !== null) return alphaNum;

      // ひらがな/カタカナをチェック（HIRAGANA には aliases でカタカナも含む）
      const idx = HIRAGANA.primary.indexOf(char);
      if (idx !== -1) return idx + 1;

      if (HIRAGANA.aliases) {
        for (const aliasList of HIRAGANA.aliases) {
          const aliasIdx = aliasList.indexOf(char);
          if (aliasIdx !== -1) return aliasIdx + 1;
        }
      }

      return "";
    })
  );
}

export const hiragana2Number = (input: string, separator: string) => charToNumber(input, HIRAGANA, separator);
export const number2Hiragana = (input: string, separator: string) => numberToChar(input, HIRAGANA, separator);

export const iroha2Number = (input: string, separator: string) => charToNumber(input, IROHA, separator);
export const number2Iroha = (input: string, separator: string) => numberToChar(input, IROHA, separator);

export const zodiac2Number = (input: string, separator: string) => tokenToNumber(input, ZODIAC, separator);
export const number2Zodiac = (input: string, separator: string) => numberToToken(input, ZODIAC, separator);

export const starSign2Number = (input: string, separator: string) => tokenToNumber(input, STARSIGN, separator);
export const number2StarSign = (input: string, separator: string) => numberToToken(input, STARSIGN, separator);

export const calendar2Number = (input: string, separator: string) => tokenToNumber(input, CALENDAR, separator);
export const number2Calendar = (input: string, separator: string) => numberToToken(input, CALENDAR, separator);

export const musicalScale2Number = (input: string, separator: string) => tokenToNumber(input, MUSICAL_SCALE, separator);
export const number2MusicalScale = (input: string, separator: string) => numberToToken(input, MUSICAL_SCALE, separator);

export const rainbow2Number = (input: string, separator: string) => tokenToNumber(input, RAINBOW, separator);
export const number2Rainbow = (input: string, separator: string) => numberToToken(input, RAINBOW, separator);
