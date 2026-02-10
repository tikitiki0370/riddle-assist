"use client";
import {
  Box,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { LuGripHorizontal, LuX } from "react-icons/lu";
import { useDrag } from "@/hooks/useDrag";
import { FloatingPanelBase, FloatingPanelState, PanelContentDef } from "./types";

interface ResizeCorner {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  cursor: string;
  sideH: "left" | "right";
  sideV: "top" | "bottom";
}

const resizeCorners: ResizeCorner[] = [
  { top: 0, left: 0, cursor: "nw-resize", sideH: "left", sideV: "top" },
  { top: 0, right: 0, cursor: "ne-resize", sideH: "right", sideV: "top" },
  { bottom: 0, left: 0, cursor: "sw-resize", sideH: "left", sideV: "bottom" },
  { bottom: 0, right: 0, cursor: "se-resize", sideH: "right", sideV: "bottom" },
];

interface FloatingPanelProps {
  panel: FloatingPanelState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentDef: PanelContentDef<any>;
  onUpdateChrome: (id: string, patch: Partial<FloatingPanelBase>) => void;
  onUpdateContent: (id: string, patch: Partial<Record<string, unknown>>) => void;
  onRemove: (id: string) => void;
  onBringToFront: (id: string) => void;
}

export default function FloatingPanel({
  panel,
  contentDef,
  onUpdateChrome,
  onUpdateContent,
  onRemove,
  onBringToFront,
}: FloatingPanelProps) {
  const resizeStartRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    sideH: "left" | "right";
    sideV: "top" | "bottom";
    startPosX: number;
    startPosY: number;
  } | null>(null);

  const focusRef = useRef<HTMLElement | null>(null);

  const onMove = useCallback(
    (pos: { x: number; y: number }) =>
      onUpdateChrome(panel.id, { position: pos }),
    [panel.id, onUpdateChrome]
  );

  const dragHandlers = useDrag({
    position: panel.position,
    onMove,
  });

  const onResizePointerDown = useCallback(
    (sideH: "left" | "right", sideV: "top" | "bottom", e: React.PointerEvent) => {
      resizeStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: panel.panelWidth,
        startHeight: panel.panelHeight,
        sideH,
        sideV,
        startPosX: panel.position.x,
        startPosY: panel.position.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
      e.stopPropagation();
    },
    [panel.panelWidth, panel.panelHeight, panel.position.x, panel.position.y]
  );

  const onResizePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!resizeStartRef.current) return;
      const { startX, startY, startWidth, startHeight, sideH, sideV, startPosX, startPosY } =
        resizeStartRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newWidth: number, newX: number;
      if (sideH === "right") {
        newWidth = Math.max(200, Math.min(1200, startWidth + dx));
        newX = startPosX;
      } else {
        newWidth = Math.max(200, Math.min(1200, startWidth - dx));
        newX = startPosX + (startWidth - newWidth);
      }

      let newHeight: number, newY: number;
      if (sideV === "bottom") {
        newHeight = Math.max(100, Math.min(1200, startHeight + dy));
        newY = startPosY;
      } else {
        newHeight = Math.max(100, Math.min(1200, startHeight - dy));
        newY = startPosY + (startHeight - newHeight);
      }

      onUpdateChrome(panel.id, {
        panelWidth: newWidth,
        panelHeight: newHeight,
        position: { x: newX, y: newY },
      });
    },
    [panel.id, onUpdateChrome]
  );

  const onResizePointerUp = useCallback(() => {
    resizeStartRef.current = null;
  }, []);

  const ContentComponent = contentDef.ContentComponent;
  const ControlsComponent = contentDef.ControlsComponent;
  const label = contentDef.getLabel?.(panel.contentState) ?? contentDef.label;

  return (
    <Box
      position="fixed"
      left={`${panel.position.x}px`}
      top={`${panel.position.y}px`}
      zIndex={panel.zIndex}
      pointerEvents="none"
      display="flex"
      flexDirection="column"
      w={`${panel.panelWidth}px`}
      h={`${panel.panelHeight}px`}
      minW="200px"
      minH="100px"
      maxW="80vw"
      borderWidth={1}
      borderRadius="md"
      overflow="hidden"
      boxShadow="sm"
    >
      {/* 上部ドラッグハンドル */}
      <HStack
        px={2}
        py={1}
        flexShrink={0}
        bg={{ base: "gray.100", _dark: "gray.700" }}
        cursor="grab"
        userSelect="none"
        touchAction="none"
        justify="space-between"
        pointerEvents="auto"
        onPointerDown={(e) => {
          onBringToFront(panel.id);
          dragHandlers.onPointerDown(e);
          focusRef.current?.focus();
        }}
        onPointerMove={dragHandlers.onPointerMove}
        onPointerUp={dragHandlers.onPointerUp}
        onPointerCancel={dragHandlers.onPointerCancel}
      >
        <HStack gap={1}>
          <LuGripHorizontal />
          <Text fontSize="xs" color={{ base: "gray.500", _dark: "gray.400" }}>
            {label}
          </Text>
        </HStack>
        <IconButton
          aria-label="閉じる"
          variant="ghost"
          size="2xs"
          onClick={() => onRemove(panel.id)}
        >
          <LuX />
        </IconButton>
      </HStack>

      {/* コンテンツ領域 — opacity はここで適用 */}
      <Box flex={1} minH={0} opacity={panel.opacity} display="flex" flexDirection="column">
        <ContentComponent
          panelId={panel.id}
          contentState={panel.contentState}
          panelWidth={panel.panelWidth}
          panelHeight={panel.panelHeight}
          onContentStateChange={(patch) => onUpdateContent(panel.id, patch)}
          focusRef={focusRef}
        />
      </Box>

      {/* コントロールバー — コンテンツ固有コントロール（ControlsComponent がある時のみ） */}
      {ControlsComponent && (
        <Box
          flexShrink={0}
          borderTopWidth={1}
          pointerEvents="auto"
          bg={{ base: "white", _dark: "gray.800" }}
        >
          <ControlsComponent
            panelId={panel.id}
            contentState={panel.contentState}
            opacity={panel.opacity}
            onContentStateChange={(patch) => onUpdateContent(panel.id, patch)}
            onOpacityChange={(opacity) => onUpdateChrome(panel.id, { opacity })}
          />
        </Box>
      )}

      {/* 下部ドラッグハンドル — バツボタンは左側（対角配置） */}
      <HStack
        px={2}
        py={1}
        flexShrink={0}
        bg={{ base: "gray.100", _dark: "gray.700" }}
        cursor="grab"
        userSelect="none"
        touchAction="none"
        justify="space-between"
        pointerEvents="auto"
        borderTopWidth={1}
        onPointerDown={(e) => {
          onBringToFront(panel.id);
          dragHandlers.onPointerDown(e);
          focusRef.current?.focus();
        }}
        onPointerMove={dragHandlers.onPointerMove}
        onPointerUp={dragHandlers.onPointerUp}
        onPointerCancel={dragHandlers.onPointerCancel}
      >
        <IconButton
          aria-label="閉じる"
          variant="ghost"
          size="2xs"
          onClick={() => onRemove(panel.id)}
        >
          <LuX />
        </IconButton>
        <HStack gap={1}>
          <Text fontSize="xs" color={{ base: "gray.500", _dark: "gray.400" }}>
            {label}
          </Text>
          <LuGripHorizontal />
        </HStack>
      </HStack>

      {/* リサイズゾーン（4隅・透明） */}
      {resizeCorners.map((zone, i) => (
        <Box
          key={i}
          position="absolute"
          top={zone.top}
          bottom={zone.bottom}
          left={zone.left}
          right={zone.right}
          w="12px"
          h="12px"
          cursor={zone.cursor}
          pointerEvents="auto"
          touchAction="none"
          onPointerDown={(e) => onResizePointerDown(zone.sideH, zone.sideV, e)}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
        />
      ))}
    </Box>
  );
}
