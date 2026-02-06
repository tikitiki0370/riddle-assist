"use client";
import { Box, Center, Grid, Text } from "@chakra-ui/react";
import { GOJUON_GRID } from "./gojuonData";

interface GojuonInputProps {
  onInput: (char: string) => void;
}

export default function GojuonInput({ onInput }: GojuonInputProps) {
  return (
    <Grid templateColumns="repeat(11, 40px)" gap={1} justifyContent="center">
      {GOJUON_GRID.flat().map((char, index) =>
        char !== null ? (
          <Box
            key={`${char}-${index}`}
            w="40px"
            h="40px"
            borderWidth={1}
            borderRadius="md"
            cursor="pointer"
            userSelect="none"
            _hover={{ bg: { base: "gray.50", _dark: "gray.700" } }}
            _active={{ bg: { base: "blue.50", _dark: "blue.900" } }}
            onClick={() => onInput(char)}
          >
            <Center h="full">
              <Text fontSize="md" fontWeight="medium">
                {char}
              </Text>
            </Center>
          </Box>
        ) : (
          <Box key={`empty-${index}`} w="40px" h="40px" />
        )
      )}
    </Grid>
  );
}
