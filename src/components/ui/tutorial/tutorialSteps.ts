export type Placement = "top" | "bottom" | "left" | "right";

export interface TutorialStep {
  /** data-tutorial attribute value to target */
  target: string;
  title: string;
  description: string;
  placement: Placement;
}

export interface PageTutorial {
  pageId: string;
  version: number;
  steps: TutorialStep[];
}

const TUTORIALS: Record<string, PageTutorial> = {
  "/": {
    pageId: "home",
    version: 1,
    steps: [
      {
        target: "home-textarea",
        placement: "bottom",
        title: "テキストを入力",
        description:
          "テキストエリアに変換したい文字列や数値を入力すると、下の各ツールが自動で変換結果を表示します。",
      },
      {
        target: "home-add-tool",
        placement: "bottom",
        title: "ツールの追加",
        description: "このボタンから表示する変換ツールを選択できます。",
      },
      {
        target: "home-separator",
        placement: "bottom",
        title: "セパレータ",
        description:
          "入力テキストの区切り文字を変更できます。デフォルトはスペースです。",
      },
    ],
  },
  "/sheet": {
    pageId: "sheet",
    version: 1,
    steps: [
      {
        target: "sheet-groups",
        placement: "bottom",
        title: "対応表一覧",
        description:
          "各種エンコーディングの対応表がカテゴリ別に並んでいます。",
      },
      {
        target: "sheet-table-header",
        placement: "bottom",
        title: "テーブルの開閉",
        description:
          "ヘッダーをクリックするとテーブルを開閉できます。",
      },
    ],
  },
  "/translate": {
    pageId: "translate",
    version: 1,
    steps: [
      {
        target: "translate-presets",
        placement: "bottom",
        title: "翻訳プリセットの選択",
        description:
          "カードをクリックしてプリセットを選択します。「新規作成」から独自のフォントファイルも読み込めます。",
      },
      {
        target: "translate-result",
        placement: "bottom",
        title: "入力結果",
        description:
          "入力した文字がここに表示されます。コピーボタンでクリップボードにコピーできます。",
      },
      {
        target: "translate-grid",
        placement: "top",
        title: "文字の入力",
        description: "ボタンをクリックして文字を入力します。",
      },
    ],
  },
  "/input": {
    pageId: "input",
    version: 1,
    steps: [
      {
        target: "input-result",
        placement: "bottom",
        title: "入力エリア",
        description:
          "入力した文字がここに表示されます。Space/Back/Clearで編集、コピーボタンでコピーできます。",
      },
      {
        target: "input-gojuon",
        placement: "top",
        title: "入力方式",
        description:
          "キーをクリック（フリックはドラッグ）して入力します。下にスクロールするとQWERTY、JISかな、フリック、メッシュ暗号も利用できます。",
      },
    ],
  },
  "/text-image": {
    pageId: "text-image",
    version: 1,
    steps: [
      {
        target: "textimage-input",
        placement: "bottom",
        title: "バイナリ入力",
        description:
          "0と1を入力します。改行で行を区切るか、列数スライダーで自動折り返しされます。",
      },
      {
        target: "textimage-controls",
        placement: "top",
        title: "表示設定",
        description:
          "セルサイズや反転トグルで表示をカスタマイズできます。",
      },
    ],
  },
};

export function getTutorialForPath(
  pathname: string,
): PageTutorial | undefined {
  return TUTORIALS[pathname];
}
