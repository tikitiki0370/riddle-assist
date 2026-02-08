import { LuStickyNote } from "react-icons/lu";
import { PanelContentDef } from "../../types";
import MemoPanelContent, { MemoContentState } from "./MemoPanelContent";
import MemoPanelControls from "./MemoPanelControls";
import {
  findFirstAvailableSlot,
  getNextAvailableSlotNumber,
  saveMemoSlot,
  deleteMemoSlot,
  isEmptyHtml,
} from "./memoSlotStorage";

export const memoPanelDef: PanelContentDef<MemoContentState> = {
  type: "memo",
  label: "メモ",
  icon: LuStickyNote,
  createInitialState: () => ({ html: "", slotNumber: null }),
  defaultWidth: 350,
  defaultHeight: 300,
  ContentComponent: MemoPanelContent,
  ControlsComponent: MemoPanelControls,

  createInitialStateWithContext: ({ existingPanels }) => {
    // 現在開いているメモパネルのスロット番号を収集
    const openSlotNumbers = existingPanels
      .filter((p) => p.type === "memo")
      .map((p) => (p.contentState as MemoContentState).slotNumber)
      .filter((n): n is number => n !== null);

    // 保存済みで未使用のスロットがあればそれを復元
    const availableSlot = findFirstAvailableSlot(openSlotNumbers);
    if (availableSlot) {
      return {
        html: availableSlot.html,
        slotNumber: availableSlot.slotNumber,
      };
    }

    // なければ新規スロット番号を発行（欠番を埋める形で）
    const newSlotNumber = getNextAvailableSlotNumber(openSlotNumbers);
    return {
      html: "",
      slotNumber: newSlotNumber,
    };
  },

  onClose: (state) => {
    const { html, slotNumber } = state;
    if (slotNumber === null) return;

    if (isEmptyHtml(html)) {
      // 空のメモはスロットを削除
      deleteMemoSlot(slotNumber);
    } else {
      // 内容があればスロットに保存
      saveMemoSlot(slotNumber, html);
    }
  },

  getLabel: (state) =>
    state.slotNumber !== null ? `メモ ${state.slotNumber}` : "メモ",

  onRestoreWithContext: (state, { restoredPanels }) => {
    // 古いデータ（slotNumberがない）の場合は補完
    if (state.slotNumber === undefined || state.slotNumber === null) {
      // 既に復元済みのメモパネルのスロット番号を収集
      const usedSlotNumbers = restoredPanels
        .filter((p) => p.type === "memo")
        .map((p) => (p.contentState as MemoContentState).slotNumber)
        .filter((n): n is number => n !== null);
      const newSlotNumber = getNextAvailableSlotNumber(usedSlotNumbers);
      return { ...state, slotNumber: newSlotNumber };
    }
    return state;
  },
};
