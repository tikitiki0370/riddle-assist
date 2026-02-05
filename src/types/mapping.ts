// マッピング1件（ボタン1つ分）
export interface MappingEntry {
  display: string;       // 表示文字（フォント適用時）
  imageUrl?: string;     // 画像URL（type="image" の場合）
  output: string;        // 出力文字
}

// プリセット定義（config.json の型）
export interface PresetConfig {
  id: string;
  name: string;
  type: "font" | "image";
  description?: string;
  thumbnail?: string;    // サムネイル画像ファイル名
  fontFile?: string;     // type="font" の場合
  mappings: MappingEntry[];
}
