"use client";
import { VStack } from "@chakra-ui/react";
import { PanelControlsProps } from "../../types";
import { MemoContentState } from "./MemoPanelContent";
import OpacitySlider from "../../shared/OpacitySlider";

export default function MemoPanelControls({
  opacity,
  onOpacityChange,
}: PanelControlsProps<MemoContentState>) {
  return (
    <VStack px={3} py={2} gap={2} w="100%">
      <OpacitySlider opacity={opacity} onOpacityChange={onOpacityChange} />
    </VStack>
  );
}
