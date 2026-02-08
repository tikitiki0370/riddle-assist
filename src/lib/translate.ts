import { TranslateEntry, PresetConfig } from "@/types/translate";

// プリセットID一覧（コード内で定義）
export const PRESET_IDS = ["dancing-men", "electroharmonix", "utopia"] as const;

// デフォルトエントリ（新規作成用）
export const DEFAULT_ENTRIES: Record<string, TranslateEntry[]> = {
  abc: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("").map(c => ({ display: c, output: c })),
  hiragana: "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split("").map(c => ({ display: c, output: c })),
};

// プリセットのconfig.jsonを読み込み
export async function loadPresetConfig(presetId: string): Promise<PresetConfig> {
  const response = await fetch(`/translate-preset/${presetId}/config.json`);
  if (!response.ok) {
    throw new Error(`Failed to load preset config: ${presetId}`);
  }
  return response.json();
}

// フォントを読み込んでFontFaceに登録
export async function loadPresetFont(presetId: string, fontFile: string): Promise<string> {
  const fontUrl = `/translate-preset/${presetId}/${fontFile}`;
  const fontFamily = `preset-font-${presetId}`;

  const response = await fetch(fontUrl);
  if (!response.ok) {
    throw new Error(`Failed to load font: ${fontUrl}`);
  }

  const buffer = await response.arrayBuffer();
  const font = new FontFace(fontFamily, buffer);
  await font.load();
  document.fonts.add(font);

  return fontFamily;
}

// 全プリセットのconfig.jsonを読み込み
export async function loadAllPresetConfigs(): Promise<PresetConfig[]> {
  const configs = await Promise.all(
    PRESET_IDS.map(async (id) => {
      try {
        return await loadPresetConfig(id);
      } catch (e) {
        console.error(`Failed to load preset: ${id}`, e);
        return null;
      }
    })
  );
  return configs.filter((c): c is PresetConfig => c !== null);
}
