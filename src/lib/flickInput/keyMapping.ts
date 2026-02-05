// 型定義
export type FlickDirection = "center" | "up" | "right" | "down" | "left";

export interface FlickKeyConfig {
  id: string;
  label: string;
  characters: {
    center: string;
    up: string;
    right: string;
    down: string;
    left: string;
  };
}

// キー配列データ
// スマホ標準: タップ=あ段, 左=い段, 上=う段, 右=え段, 下=お段
export const FLICK_KEYS: FlickKeyConfig[] = [
  {
    id: "a",
    label: "あ",
    characters: { center: "あ", left: "い", up: "う", right: "え", down: "お" },
  },
  {
    id: "ka",
    label: "か",
    characters: { center: "か", left: "き", up: "く", right: "け", down: "こ" },
  },
  {
    id: "sa",
    label: "さ",
    characters: { center: "さ", left: "し", up: "す", right: "せ", down: "そ" },
  },
  {
    id: "ta",
    label: "た",
    characters: { center: "た", left: "ち", up: "つ", right: "て", down: "と" },
  },
  {
    id: "na",
    label: "な",
    characters: { center: "な", left: "に", up: "ぬ", right: "ね", down: "の" },
  },
  {
    id: "ha",
    label: "は",
    characters: { center: "は", left: "ひ", up: "ふ", right: "へ", down: "ほ" },
  },
  {
    id: "ma",
    label: "ま",
    characters: { center: "ま", left: "み", up: "む", right: "め", down: "も" },
  },
  {
    id: "ya",
    label: "や",
    characters: { center: "や", left: "（", up: "ゆ", right: "）", down: "よ" },
  },
  {
    id: "ra",
    label: "ら",
    characters: { center: "ら", left: "り", up: "る", right: "れ", down: "ろ" },
  },
  {
    id: "marks",
    label: "゛゜",
    characters: { center: "゛", left: "゜", up: "？", right: "！", down: "…" },
  },
  {
    id: "wa",
    label: "わ",
    characters: { center: "わ", left: "を", up: "ん", right: "ー", down: "〜" },
  },
];

// 英語版フリックキー（日本語と同じ形式：ラベル1文字、フリックで他の文字）
export const FLICK_KEYS_EN: FlickKeyConfig[] = [
  {
    id: "abc",
    label: "A",
    characters: { center: "A", left: "B", up: "C", right: "", down: "" },
  },
  {
    id: "def",
    label: "D",
    characters: { center: "D", left: "E", up: "F", right: "", down: "" },
  },
  {
    id: "ghi",
    label: "G",
    characters: { center: "G", left: "H", up: "I", right: "", down: "" },
  },
  {
    id: "jkl",
    label: "J",
    characters: { center: "J", left: "K", up: "L", right: "", down: "" },
  },
  {
    id: "mno",
    label: "M",
    characters: { center: "M", left: "N", up: "O", right: "", down: "" },
  },
  {
    id: "pqrs",
    label: "P",
    characters: { center: "P", left: "Q", up: "R", right: "S", down: "" },
  },
  {
    id: "tuv",
    label: "T",
    characters: { center: "T", left: "U", up: "V", right: "", down: "" },
  },
  {
    id: "wxyz",
    label: "W",
    characters: { center: "W", left: "X", up: "Y", right: "Z", down: "" },
  },
];
