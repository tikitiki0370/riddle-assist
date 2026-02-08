"use client";
import { HStack, Slider, Text } from "@chakra-ui/react";

interface OpacitySliderProps {
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

export default function OpacitySlider({
  opacity,
  onOpacityChange,
}: OpacitySliderProps) {
  return (
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
  );
}
