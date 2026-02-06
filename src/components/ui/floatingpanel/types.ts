import { ComponentType } from "react";
import { IconType } from "react-icons";

/** パネルの共通状態（ウィンドウ枠側が管理） */
export interface FloatingPanelBase {
  id: string;
  type: string;
  position: { x: number; y: number };
  panelWidth: number;
  panelHeight: number;
  opacity: number;
  zIndex: number;
}

/** パネルインスタンス = 共通状態 + コンテンツ固有状態 */
export interface FloatingPanelState extends FloatingPanelBase {
  contentState: Record<string, unknown>;
}

/** コンテンツコンポーネントが受け取る props */
export interface PanelContentProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  panelId: string;
  contentState: T;
  panelWidth: number;
  panelHeight: number;
  onContentStateChange: (patch: Partial<T>) => void;
}

/** コンテンツ固有のコントロールコンポーネントが受け取る props */
export interface PanelControlsProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  panelId: string;
  contentState: T;
  opacity: number;
  onContentStateChange: (patch: Partial<T>) => void;
  onOpacityChange: (opacity: number) => void;
}

/** コンテンツタイプのプラグイン定義 */
export interface PanelContentDef<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  type: string;
  label: string;
  icon: IconType;
  createInitialState: () => T;
  defaultWidth?: number;
  defaultHeight?: number;
  ContentComponent: ComponentType<PanelContentProps<T>>;
  ControlsComponent?: ComponentType<PanelControlsProps<T>>;
  onCleanup?: (state: T) => void;
  onContentStateChange?: (oldState: T, newState: T) => void;
  /** localStorage から復元時に contentState を加工する */
  onRestore?: (state: T) => T;
}
