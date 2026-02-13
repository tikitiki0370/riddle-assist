"use client";
import { HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { LuFlipHorizontal2, LuFlipVertical2, LuRotateCcw, LuRotateCw } from "react-icons/lu";
import { PanelControlsProps } from "../../types";
import { ImageContentState } from "./ImagePanelContent";
import OpacitySlider from "../../shared/OpacitySlider";

export default function ImagePanelControls({
  contentState,
  opacity,
  onContentStateChange,
  onOpacityChange,
}: PanelControlsProps<ImageContentState>) {
  if (!contentState.imageUrl) return null;

  return (
    <VStack px={3} py={1} gap={1} w="100%">
      <OpacitySlider opacity={opacity} onOpacityChange={onOpacityChange} />
      <HStack w="100%" gap={2}>
        <Text fontSize="xs" w="35px" flexShrink={0}>
          変形
        </Text>
        <HStack gap={0.5}>
          <IconButton
            aria-label="左90°回転"
            size="2xs"
            variant="outline"
            onClick={() =>
              onContentStateChange({
                rotation: ((contentState.rotation ?? 0) - 90 + 360) % 360,
              })
            }
          >
            <LuRotateCcw />
          </IconButton>
          <IconButton
            aria-label="右90°回転"
            size="2xs"
            variant="outline"
            onClick={() =>
              onContentStateChange({
                rotation: ((contentState.rotation ?? 0) + 90) % 360,
              })
            }
          >
            <LuRotateCw />
          </IconButton>
          <IconButton
            aria-label="左右反転"
            size="2xs"
            variant={contentState.flipH ? "solid" : "outline"}
            onClick={() =>
              onContentStateChange({ flipH: !contentState.flipH })
            }
          >
            <LuFlipHorizontal2 />
          </IconButton>
          <IconButton
            aria-label="上下反転"
            size="2xs"
            variant={contentState.flipV ? "solid" : "outline"}
            onClick={() =>
              onContentStateChange({ flipV: !contentState.flipV })
            }
          >
            <LuFlipVertical2 />
          </IconButton>
        </HStack>
      </HStack>
    </VStack>
  );
}
