// 共通型
export type { ConvertResult, MappingDefinition } from "./types";

// Brainfuck
export {
  tokenize,
  execute,
  BRAINFUCK_MAPPING,
  KEMONO_FRIENDS_MAPPING,
} from "./brainfuck";
export type { BrainfuckOp, TokenMapping } from "./brainfuck";

// Text2Text
export {
  // マッピング
  HIRAGANA,
  IROHA,
  ZODIAC,
  STARSIGN,
  CALENDAR,
  MUSICAL_SCALE,
  RAINBOW,
  // 汎用コンバーター
  charToNumber,
  numberToChar,
  tokenToNumber,
  numberToToken,
  // 便利関数
  text2Number,
  alphabet2Number,
  number2Alphabet,
  hiragana2Number,
  number2Hiragana,
  iroha2Number,
  number2Iroha,
  zodiac2Number,
  number2Zodiac,
  starSign2Number,
  number2StarSign,
  calendar2Number,
  number2Calendar,
  musicalScale2Number,
  number2MusicalScale,
  rainbow2Number,
  number2Rainbow,
} from "./text2text";
