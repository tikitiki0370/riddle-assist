import { LuStickyNote } from "react-icons/lu";
import { PanelContentDef } from "../../types";
import MemoPanelContent, { MemoContentState } from "./MemoPanelContent";
import MemoPanelControls from "./MemoPanelControls";

export const memoPanelDef: PanelContentDef<MemoContentState> = {
  type: "memo",
  label: "メモ",
  icon: LuStickyNote,
  createInitialState: () => ({ html: "" }),
  defaultWidth: 350,
  defaultHeight: 300,
  ContentComponent: MemoPanelContent,
  ControlsComponent: MemoPanelControls,
};
