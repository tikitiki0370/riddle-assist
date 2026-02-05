"use client";
import { Box, Center, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { useFlickGesture } from "@/hooks/useFlickGesture";
import { FlickDirection, FlickKeyConfig } from "@/lib/flickInput/keyMapping";

interface FlickKeyProps {
  config: FlickKeyConfig;
  onInput: (char: string) => void;
}

export default function FlickKey({ config, onInput }: FlickKeyProps) {
  const handleFlick = useCallback(
    (direction: FlickDirection) => {
      const char = config.characters[direction];
      if (char) {
        onInput(char);
      }
    },
    [config, onInput]
  );

  const {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    currentDirection,
    isActive,
  } = useFlickGesture({
    threshold: 30,
    onFlick: handleFlick,
  });

  const previewChar = isActive && currentDirection
    ? config.characters[currentDirection]
    : null;

  return (
    <Box
      position="relative"
      w="60px"
      h="60px"
      borderWidth={1}
      borderRadius="md"
      cursor="pointer"
      userSelect="none"
      bg={isActive ? { base: "blue.50", _dark: "blue.900" } : undefined}
      _hover={isActive ? undefined : { bg: { base: "gray.50", _dark: "gray.700" } }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      touchAction="none"
    >
      {/* メインラベル */}
      <Center h="full">
        <Text fontSize="xl" fontWeight="medium">
          {config.label}
        </Text>
      </Center>

      {/* 4隅に候補文字（空文字は表示しない） */}
      {config.characters.up && (
        <Text position="absolute" top={0} left="50%" transform="translateX(-50%)" fontSize="xs" color="gray.400">
          {config.characters.up}
        </Text>
      )}
      {config.characters.right && (
        <Text position="absolute" right={1} top="50%" transform="translateY(-50%)" fontSize="xs" color="gray.400">
          {config.characters.right}
        </Text>
      )}
      {config.characters.down && (
        <Text position="absolute" bottom={0} left="50%" transform="translateX(-50%)" fontSize="xs" color="gray.400">
          {config.characters.down}
        </Text>
      )}
      {config.characters.left && (
        <Text position="absolute" left={1} top="50%" transform="translateY(-50%)" fontSize="xs" color="gray.400">
          {config.characters.left}
        </Text>
      )}

      {/* フリック中のプレビュー */}
      {isActive && previewChar && (
        <Box
          position="absolute"
          top="-50px"
          left="50%"
          transform="translateX(-50%)"
          bg="blue.500"
          color="white"
          px={4}
          py={2}
          borderRadius="md"
          boxShadow="lg"
          zIndex={10}
        >
          <Text fontSize="2xl" fontWeight="bold">
            {previewChar}
          </Text>
        </Box>
      )}
    </Box>
  );
}
