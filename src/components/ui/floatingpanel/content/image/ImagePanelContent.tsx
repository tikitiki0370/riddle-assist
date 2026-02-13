"use client";
import { Box, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuUpload } from "react-icons/lu";
import { PanelContentProps } from "../../types";

export interface ImageContentState extends Record<string, unknown> {
  imageUrl: string | null;
  flipH?: boolean;
  flipV?: boolean;
  rotation?: number;
}

export default function ImagePanelContent({
  contentState,
  onContentStateChange,
  focusRef,
}: PanelContentProps<ImageContentState>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      if (roRef.current) {
        roRef.current.disconnect();
        roRef.current = null;
      }
      if (focusRef && "current" in focusRef) {
        (focusRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }
      if (el) {
        const ro = new ResizeObserver(([entry]) => {
          const { width, height } = entry.contentRect;
          setContainerSize({ w: width, h: height });
        });
        ro.observe(el);
        roRef.current = ro;
      }
    },
    [focusRef]
  );

  useEffect(() => {
    return () => roRef.current?.disconnect();
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onContentStateChange({ imageUrl: url });
    },
    [onContentStateChange]
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

  if (contentState.imageUrl) {
    const rotation = contentState.rotation ?? 0;
    const isOrthogonal = rotation % 180 !== 0;
    let fitScale = 1;
    if (isOrthogonal && containerSize.w > 0 && containerSize.h > 0) {
      fitScale =
        Math.min(containerSize.w, containerSize.h) /
        Math.max(containerSize.w, containerSize.h);
    }

    return (
      <Box
        ref={setRefs}
        flex={1}
        minH={0}
        tabIndex={0}
        outline="none"
        pointerEvents="auto"
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <img
          src={contentState.imageUrl}
          alt="overlay"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            transform:
              [
                rotation ? `rotate(${rotation}deg)` : "",
                fitScale !== 1 ? `scale(${fitScale})` : "",
                contentState.flipH ? "scaleX(-1)" : "",
                contentState.flipV ? "scaleY(-1)" : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined,
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      flex={1}
      minH={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={2}
      bg={{ base: "white", _dark: "gray.800" }}
    >
      <Box
        ref={focusRef as React.RefObject<HTMLDivElement>}
        w="100%"
        h="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        borderWidth={2}
        borderStyle="dashed"
        borderColor={isDragging ? "blue.500" : "gray.300"}
        bg={{
          base: isDragging ? "blue.50" : "transparent",
          _dark: isDragging ? "blue.900" : "transparent",
        }}
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
  );
}
