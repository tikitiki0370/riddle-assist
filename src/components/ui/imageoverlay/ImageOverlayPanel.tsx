"use client";
import {
  Box,
  HStack,
  IconButton,
  Slider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import { LuGripHorizontal, LuUpload, LuX } from "react-icons/lu";
import { useDrag } from "@/hooks/useDrag";

export interface ImageOverlayState {
  id: string;
  imageUrl: string | null;
  position: { x: number; y: number };
  panelWidth: number;
  panelHeight: number;
  opacity: number;
  zIndex: number;
}

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

interface ImageOverlayPanelProps {
  overlay: ImageOverlayState;
  onUpdate: (id: string, patch: Partial<ImageOverlayState>) => void;
  onRemove: (id: string) => void;
  onBringToFront: (id: string) => void;
}

export default function ImageOverlayPanel({
  overlay,
  onUpdate,
  onRemove,
  onBringToFront,
}: ImageOverlayPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const onMove = useCallback(
    (pos: { x: number; y: number }) => onUpdate(overlay.id, { position: pos }),
    [overlay.id, onUpdate]
  );

  const dragHandlers = useDrag({
    position: overlay.position,
    onMove,
  });

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onUpdate(overlay.id, { imageUrl: url });
    },
    [overlay.id, onUpdate]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
            break;
          }
        }
      }
    },
    [handleFile]
  );

  // リサイズハンドル用ポインターイベント（4隅対応）
  const onResizePointerDown = useCallback(
    (sideH: "left" | "right", sideV: "top" | "bottom", e: React.PointerEvent) => {
      resizeStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: overlay.panelWidth,
        startHeight: overlay.panelHeight,
        sideH,
        sideV,
        startPosX: overlay.position.x,
        startPosY: overlay.position.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
      e.stopPropagation();
    },
    [overlay.panelWidth, overlay.panelHeight, overlay.position.x, overlay.position.y]
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

      onUpdate(overlay.id, {
        panelWidth: newWidth,
        panelHeight: newHeight,
        position: { x: newX, y: newY },
      });
    },
    [overlay.id, onUpdate]
  );

  const onResizePointerUp = useCallback(() => {
    resizeStartRef.current = null;
  }, []);

  return (
    <Box
      position="fixed"
      left={`${overlay.position.x}px`}
      top={`${overlay.position.y}px`}
      zIndex={overlay.zIndex}
      pointerEvents="none"
      display="flex"
      flexDirection="column"
      w={`${overlay.panelWidth}px`}
      h={`${overlay.panelHeight}px`}
      minW="200px"
      minH="100px"
      maxW="80vw"
      borderWidth={1}
      borderRadius="md"
      overflow="hidden"
      boxShadow="sm"
      bg={!overlay.imageUrl ? { base: "white", _dark: "gray.800" } : undefined}
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
          onBringToFront(overlay.id);
          dragHandlers.onPointerDown(e);
        }}
        onPointerMove={dragHandlers.onPointerMove}
        onPointerUp={dragHandlers.onPointerUp}
        onPointerCancel={dragHandlers.onPointerUp}
      >
        <HStack gap={1}>
          <LuGripHorizontal />
          <Text fontSize="xs" color={{ base: "gray.500", _dark: "gray.400" }}>
            画像オーバーレイ
          </Text>
        </HStack>
        <IconButton
          aria-label="閉じる"
          variant="ghost"
          size="2xs"
          onClick={() => onRemove(overlay.id)}
        >
          <LuX />
        </IconButton>
      </HStack>

      {/* 画像エリア（flex:1 でタブバー以外の領域を埋める） */}
      {overlay.imageUrl ? (
        <Box flex={1} minH={0} opacity={overlay.opacity}>
          <img
            src={overlay.imageUrl}
            alt="overlay"
            draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </Box>
      ) : (
        <Box
          flex={1}
          minH={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={2}
        >
          <Box
            w="100%"
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            borderWidth={2}
            borderStyle="dashed"
            borderColor={isDragging ? "blue.500" : "gray.300"}
            bg={{ base: isDragging ? "blue.50" : "transparent", _dark: isDragging ? "blue.900" : "transparent" }}
            borderRadius="md"
            pointerEvents="auto"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
            onClick={() => fileInputRef.current?.click()}
            tabIndex={0}
            outline="none"
            _dark={{
              borderColor: isDragging ? "blue.300" : "gray.600",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/*"
              style={{ display: "none" }}
            />
            <VStack gap={2}>
              <LuUpload size={24} />
              <Text fontSize="sm">画像をドロップ/クリック/ペースト</Text>
            </VStack>
          </Box>
        </Box>
      )}

      {/* コントロールバー（画像設定後のみ表示） */}
      {overlay.imageUrl && (
        <VStack
          px={3}
          py={2}
          gap={2}
          w="100%"
          flexShrink={0}
          borderTopWidth={1}
          pointerEvents="auto"
          bg={{ base: "white", _dark: "gray.800" }}
        >
          <HStack w="100%" gap={2}>
            <Text fontSize="xs" w="35px" flexShrink={0}>
              透過
            </Text>
            <Slider.Root
              flex={1}
              size="sm"
              min={0.1}
              max={1}
              step={0.05}
              value={[overlay.opacity]}
              onValueChange={(details) =>
                onUpdate(overlay.id, { opacity: details.value[0] })
              }
            >
              <Slider.Control>
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
              </Slider.Control>
            </Slider.Root>
          </HStack>
        </VStack>
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
          onBringToFront(overlay.id);
          dragHandlers.onPointerDown(e);
        }}
        onPointerMove={dragHandlers.onPointerMove}
        onPointerUp={dragHandlers.onPointerUp}
        onPointerCancel={dragHandlers.onPointerUp}
      >
        <IconButton
          aria-label="閉じる"
          variant="ghost"
          size="2xs"
          onClick={() => onRemove(overlay.id)}
        >
          <LuX />
        </IconButton>
        <HStack gap={1}>
          <Text fontSize="xs" color={{ base: "gray.500", _dark: "gray.400" }}>
            画像オーバーレイ
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
