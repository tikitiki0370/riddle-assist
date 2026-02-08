"use client";

import { Box, HStack, IconButton, VStack } from "@chakra-ui/react";
import { LuTrash2, LuUndo2 } from "react-icons/lu";
import { PanelControlsProps } from "../../types";
import { CanvasContentState } from "./CanvasPanelContent";
import OpacitySlider from "../../shared/OpacitySlider";

const PRESET_COLORS = [
  "#ef4444",
  "#3b82f6",
  "#eab308",
  "#ffffff",
  "#000000",
];

const STROKE_WIDTHS = [2, 5, 10] as const;

export default function CanvasPanelControls({
  contentState,
  opacity,
  onContentStateChange,
  onOpacityChange,
}: PanelControlsProps<CanvasContentState>) {
  const strokes = contentState.strokes ?? [];
  const hasStrokes = strokes.length > 0;

  return (
    <VStack px={3} py={2} gap={2} w="100%">
      {/* Color & width */}
      <HStack w="100%" gap={1} flexWrap="wrap">
        {PRESET_COLORS.map((color) => (
          <Box
            key={color}
            as="button"
            w={5}
            h={5}
            rounded="full"
            bg={color}
            borderWidth={2}
            borderColor={contentState.strokeColor === color ? "blue.500" : "border"}
            cursor="pointer"
            flexShrink={0}
            onClick={() => onContentStateChange({ strokeColor: color })}
          />
        ))}

        <Box w="1px" h={5} bg="border" mx={1} />

        {STROKE_WIDTHS.map((w) => (
          <Box
            key={w}
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w={6}
            h={6}
            rounded="full"
            cursor="pointer"
            borderWidth={contentState.strokeWidth === w ? 2 : 0}
            borderColor="blue.500"
            onClick={() => onContentStateChange({ strokeWidth: w })}
          >
            <Box
              rounded="full"
              bg="fg"
              style={{ width: `${w + 4}px`, height: `${w + 4}px` }}
            />
          </Box>
        ))}

        <Box w="1px" h={5} bg="border" mx={1} />

        <IconButton
          aria-label="元に戻す"
          size="2xs"
          variant="ghost"
          disabled={!hasStrokes}
          onClick={() =>
            onContentStateChange({ strokes: strokes.slice(0, -1) })
          }
        >
          <LuUndo2 />
        </IconButton>

        <IconButton
          aria-label="全消去"
          size="2xs"
          variant="ghost"
          disabled={!hasStrokes}
          onClick={() => onContentStateChange({ strokes: [] })}
        >
          <LuTrash2 />
        </IconButton>
      </HStack>

      <OpacitySlider opacity={opacity} onOpacityChange={onOpacityChange} />
    </VStack>
  );
}
