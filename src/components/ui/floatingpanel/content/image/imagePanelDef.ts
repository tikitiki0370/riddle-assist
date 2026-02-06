import { LuImage } from "react-icons/lu";
import { PanelContentDef } from "../../types";
import ImagePanelContent, { ImageContentState } from "./ImagePanelContent";
import ImagePanelControls from "./ImagePanelControls";

export const imagePanelDef: PanelContentDef<ImageContentState> = {
  type: "image",
  label: "画像オーバーレイ",
  icon: LuImage,
  createInitialState: () => ({ imageUrl: null }),
  defaultWidth: 300,
  defaultHeight: 250,
  ContentComponent: ImagePanelContent,
  ControlsComponent: ImagePanelControls,
  onCleanup: (state) => {
    if (state.imageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(state.imageUrl);
    }
  },
  onContentStateChange: (oldState, newState) => {
    if (
      newState.imageUrl &&
      oldState.imageUrl?.startsWith("blob:") &&
      newState.imageUrl !== oldState.imageUrl
    ) {
      URL.revokeObjectURL(oldState.imageUrl);
    }
  },
  onRestore: (state) => ({ ...state, imageUrl: null }),
};
