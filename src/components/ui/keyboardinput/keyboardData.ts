export interface KeyboardRow {
  keys: string[];
  offset: number;
}

export interface KeyboardLayout {
  rows: KeyboardRow[];
  maxExtent: number;
}

export const QWERTY_LAYOUT: KeyboardLayout = {
  rows: [
    { keys: ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="], offset: 0 },
    { keys: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"], offset: 0.5 },
    { keys: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"], offset: 0.75 },
    { keys: ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"], offset: 1.25 },
  ],
  maxExtent: 13.5,
};

export const JIS_KANA_LAYOUT: KeyboardLayout = {
  rows: [
    { keys: ["ぬ", "ふ", "あ", "う", "え", "お", "や", "ゆ", "よ", "わ", "ほ", "へ", "ー"], offset: 0 },
    { keys: ["た", "て", "い", "す", "か", "ん", "な", "に", "ら", "せ", "゛", "゜"], offset: 0.5 },
    { keys: ["ち", "と", "し", "は", "き", "く", "ま", "の", "り", "れ", "け", "む"], offset: 0.75 },
    { keys: ["つ", "さ", "そ", "ひ", "こ", "み", "も", "ね", "る", "め", "ろ"], offset: 1.25 },
  ],
  maxExtent: 13,
};
