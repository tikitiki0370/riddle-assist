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
  imageWidth: number;
  opacity: number;
  zIndex: number;
}

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
  const resizeStartRef = useRef<{ startX: number; startWidth: number } | null>(null);

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

  // リサイズハンドル用ポインターイベント
  const onResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      resizeStartRef.current = {
        startX: e.clientX,
        startWidth: overlay.imageWidth,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
      e.stopPropagation();
    },
    [overlay.imageWidth]
  );

  const onResizePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!resizeStartRef.current) return;
      const delta = e.clientX - resizeStartRef.current.startX;
      const newWidth = Math.max(50, Math.min(1200, resizeStartRef.current.startWidth + delta));
      onUpdate(overlay.id, { imageWidth: newWidth });
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
      minW="200px"
      maxW="80vw"
    >
      {/* ドラッグハンドル */}
      <HStack
        px={2}
        py={1}
        bg={{ base: "gray.100", _dark: "gray.700" }}
        cursor="grab"
        userSelect="none"
        touchAction="none"
        justify="space-between"
        pointerEvents="auto"
        borderTopRadius="md"
        borderWidth={1}
        borderBottom="none"
        boxShadow="sm"
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

      {/* 画像エリア — pointerEvents="none"で下のコンテンツを操作可能に */}
      {overlay.imageUrl ? (
        <Box opacity={overlay.opacity}>
          <img
            src={overlay.imageUrl}
            alt="overlay"
            width={overlay.imageWidth}
            draggable={false}
            style={{ display: "block" }}
          />
        </Box>
      ) : (
        <Box
          p={6}
          textAlign="center"
          cursor="pointer"
          borderWidth={2}
          borderStyle="dashed"
          borderColor={isDragging ? "blue.500" : "gray.300"}
          bg={{ base: isDragging ? "blue.50" : "white", _dark: isDragging ? "blue.900" : "gray.800" }}
          m={2}
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
      )}

      {/* コントロールバー（画像設定後のみ表示） */}
      {overlay.imageUrl && (
        <VStack
          px={3}
          py={2}
          gap={2}
          w="100%"
          borderWidth={1}
          borderTop="none"
          borderBottomRadius="md"
          pointerEvents="auto"
          bg={{ base: "white", _dark: "gray.800" }}
          boxShadow="sm"
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

      {/* リサイズハンドル（パネル外枠の右下角） */}
      {overlay.imageUrl && (
        <Box
          position="absolute"
          right={0}
          bottom={0}
          w="16px"
          h="16px"
          cursor="nwse-resize"
          pointerEvents="auto"
          borderRight="2px solid"
          borderBottom="2px solid"
          borderColor={{ base: "gray.400", _dark: "gray.500" }}
          touchAction="none"
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
        />
      )}
    </Box>
  );
}
