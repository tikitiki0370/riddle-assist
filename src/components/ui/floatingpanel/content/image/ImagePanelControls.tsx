"use client";
import { HStack, Slider, Text, VStack } from "@chakra-ui/react";
import { PanelControlsProps } from "../../types";
import { ImageContentState } from "./ImagePanelContent";

export default function ImagePanelControls({
  contentState,
  opacity,
  onOpacityChange,
}: PanelControlsProps<ImageContentState>) {
  if (!contentState.imageUrl) return null;

  return (
    <VStack px={3} py={2} gap={2} w="100%">
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
          value={[opacity]}
          onValueChange={(details) => onOpacityChange(details.value[0])}
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
  );
}
