"use client";
import { VStack } from "@chakra-ui/react";
import { PanelControlsProps } from "../../types";
import { ImageContentState } from "./ImagePanelContent";
import OpacitySlider from "../../shared/OpacitySlider";

export default function ImagePanelControls({
  contentState,
  opacity,
  onOpacityChange,
}: PanelControlsProps<ImageContentState>) {
  if (!contentState.imageUrl) return null;

  return (
    <VStack px={3} py={2} gap={2} w="100%">
      <OpacitySlider opacity={opacity} onOpacityChange={onOpacityChange} />
    </VStack>
  );
}
