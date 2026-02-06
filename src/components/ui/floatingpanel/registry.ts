import { PanelContentDef } from "./types";
import { imagePanelDef } from "./content/image/imagePanelDef";
import { memoPanelDef } from "./content/memo/memoPanelDef";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PANEL_CONTENT_DEFS: PanelContentDef<any>[] = [imagePanelDef, memoPanelDef];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPanelContentDef(type: string): PanelContentDef<any> | undefined {
  return PANEL_CONTENT_DEFS.find((d) => d.type === type);
}
