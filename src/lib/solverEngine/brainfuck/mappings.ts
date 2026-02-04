import type { TokenMapping } from "./engine";

export const BRAINFUCK_MAPPING: TokenMapping = {
  ">": ">",
  "<": "<",
  "+": "+",
  "-": "-",
  ".": ".",
  ",": ",",
  "[": "[",
  "]": "]",
};

export const KEMONO_FRIENDS_MAPPING: TokenMapping = {
  ">": "たのしー！",
  "<": "すごーい！",
  "+": "たーのしー！",
  "-": "すっごーい！",
  ".": "なにこれなにこれ！",
  ",": "おもしろーい！",
  "[": "うわー！",
  "]": "わーい！",
};
