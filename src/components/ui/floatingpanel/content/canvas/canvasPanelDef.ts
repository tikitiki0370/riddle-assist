import { LuPencil } from "react-icons/lu";
import { PanelContentDef } from "../../types";
import CanvasPanelContent, { CanvasContentState } from "./CanvasPanelContent";
import CanvasPanelControls from "./CanvasPanelControls";

export const canvasPanelDef: PanelContentDef<CanvasContentState> = {
  type: "canvas",
  label: "キャンバス",
  icon: LuPencil,
  createInitialState: () => ({
    strokes: [],
    strokeColor: "#ef4444",
    strokeWidth: 5,
  }),
  defaultWidth: 400,
  defaultHeight: 350,
  ContentComponent: CanvasPanelContent,
  ControlsComponent: CanvasPanelControls,
};
