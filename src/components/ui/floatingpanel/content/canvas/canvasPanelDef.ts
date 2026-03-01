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
    scale: 1,
    offset: { x: 0, y: 0 },
    mode: "draw" as const,
  }),
  defaultWidth: 400,
  defaultHeight: 350,
  ContentComponent: CanvasPanelContent,
  ControlsComponent: CanvasPanelControls,
};
