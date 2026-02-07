"use client";
import { Box, Center, Grid, Text, VStack } from "@chakra-ui/react";
import { KeyboardRow } from "./keyboardData";

interface KeyboardInputProps {
  onInput: (char: string) => void;
  rows: KeyboardRow[];
  maxExtent: number;
  displayChar?: (char: string) => string;
}

export default function KeyboardInput({
  onInput,
  rows,
  maxExtent,
  displayChar = (c) => c,
}: KeyboardInputProps) {
  return (
    <VStack gap={1} maxW="560px" w="100%" align="start">
      {rows.map((row, rowIndex) => (
        <Grid
          key={rowIndex}
          templateColumns={`repeat(${row.keys.length}, 1fr)`}
          gap={1}
          maxW={`${(row.keys.length / maxExtent) * 100}%`}
          ml={`${(row.offset / maxExtent) * 100}%`}
          w="100%"
        >
          {row.keys.map((char) => (
            <Box
              key={char}
              aspectRatio={1}
              borderWidth={1}
              borderRadius="md"
              cursor="pointer"
              userSelect="none"
              _hover={{ bg: { base: "gray.50", _dark: "gray.700" } }}
              _active={{ bg: { base: "blue.50", _dark: "blue.900" } }}
              onClick={() => onInput(char)}
            >
              <Center h="full">
                <Text fontSize="sm" fontWeight="medium">
                  {displayChar(char)}
                </Text>
              </Center>
            </Box>
          ))}
        </Grid>
      ))}
    </VStack>
  );
}
