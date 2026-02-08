import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PresetConfig, TranslateEntry } from "@/types/translate";
import {
  loadAllPresetConfigs,
  loadPresetConfig,
  loadPresetFont,
  DEFAULT_ENTRIES,
} from "@/lib/translate";

export function useTranslatePresets() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const presetParam = searchParams.get("preset");

  // プリセット一覧
  const [presets, setPresets] = useState<PresetConfig[]>([]);
  const [loadingPresets, setLoadingPresets] = useState(true);

  // 選択状態
  const [activePresetId, setActivePresetId] = useState<string | null>(presetParam);
  const [activePreset, setActivePreset] = useState<PresetConfig | null>(null);
  const [fontFamily, setFontFamily] = useState<string | null>(null);

  // 新規作成用
  const [customFontName, setCustomFontName] = useState<string | null>(null);
  const [customFontFamily, setCustomFontFamily] = useState<string | null>(null);
  const [mode, setMode] = useState<"abc" | "hiragana">("abc");

  // プリセット一覧を読み込み
  useEffect(() => {
    async function loadPresets() {
      setLoadingPresets(true);
      const configs = await loadAllPresetConfigs();
      setPresets(configs);
      setLoadingPresets(false);
    }
    loadPresets();
  }, []);

  // URLパラメータが変わったらプリセットを読み込み
  useEffect(() => {
    async function loadActivePreset() {
      if (!presetParam) {
        setActivePresetId(null);
        setActivePreset(null);
        setFontFamily(null);
        return;
      }

      try {
        const config = await loadPresetConfig(presetParam);
        setActivePresetId(presetParam);
        setActivePreset(config);

        if (config.type === "font" && config.fontFile) {
          const family = await loadPresetFont(presetParam, config.fontFile);
          setFontFamily(family);
        }

        // カスタムフォントをクリア
        setCustomFontName(null);
        setCustomFontFamily(null);
      } catch (e) {
        console.error(`Failed to load preset: ${presetParam}`, e);
      }
    }
    loadActivePreset();
  }, [presetParam]);

  // プリセットカードクリック
  const handlePresetClick = useCallback(
    (presetId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("preset", presetId);
      router.replace(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  // 新規作成でフォント読み込み
  const handleFontLoaded = useCallback(
    (name: string, family: string) => {
      setCustomFontName(name);
      setCustomFontFamily(family);
      // URLからpresetパラメータを削除
      const params = new URLSearchParams(searchParams.toString());
      params.delete("preset");
      router.replace(params.toString() ? `?${params.toString()}` : "/translate");
      // プリセット選択をクリア
      setActivePresetId(null);
      setActivePreset(null);
      setFontFamily(null);
    },
    [searchParams, router]
  );

  // 表示するエントリ
  const entries: TranslateEntry[] = activePreset
    ? activePreset.entries
    : DEFAULT_ENTRIES[mode] ?? [];

  // フォントファミリー（プリセットまたはカスタム）
  const activeFontFamily = activePreset ? fontFamily : customFontFamily;

  // プリセット選択中はmode切り替え無効
  const isPresetActive = !!activePreset;

  return {
    // プリセット一覧
    presets,
    loadingPresets,
    // アクティブなプリセット
    activePresetId,
    activePreset,
    // エントリとフォント
    entries,
    activeFontFamily,
    // モード
    mode,
    setMode,
    isPresetActive,
    // カスタムフォント
    customFontName,
    // ハンドラー
    handlePresetClick,
    handleFontLoaded,
  };
}
