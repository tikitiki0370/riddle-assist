"use client";
import { Box, Flex, Text } from "@chakra-ui/react";

interface MappingPreviewProps {
  encoded: string;
  mappings: Record<string, string>;
  unmappedSymbols: Set<string>;
  focusedSymbol: string | null;
  onSymbolClick: (symbol: string) => void;
}

export default function MappingPreview({
  encoded,
  mappings,
  unmappedSymbols,
  focusedSymbol,
  onSymbolClick,
}: MappingPreviewProps) {
  if (!encoded) return null;

  const chars = Array.from(encoded);

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" minH="60px" overflowX="auto">
      <Flex align="center" gap={0} flexWrap="wrap">
        {chars.map((ch, i) => {
          // Whitespace: render as-is
          if (/\s/.test(ch)) {
            if (ch === "\n") {
              return <Box key={i} flexBasis="100%" h={0} />;
            }
            return (
              <Text key={i} as="span" fontSize="2rem" whiteSpace="pre">
                {ch}
              </Text>
            );
          }

          const isMapped = !!mappings[ch];
          const isUnmapped = unmappedSymbols.has(ch);
          const isFocused = ch === focusedSymbol;
          const displayChar = isMapped ? mappings[ch] : ch;

          return (
            <Text
              key={i}
              as="span"
              fontSize="2rem"
              fontFamily="monospace"
              color={isUnmapped ? { base: "orange.500", _dark: "orange.300" } : undefined}
              bg={isFocused ? { base: "blue.100", _dark: "blue.900" } : undefined}
              cursor="pointer"
              onClick={() => onSymbolClick(ch)}
              borderBottom={isUnmapped ? "2px dashed" : undefined}
              borderColor={isUnmapped ? { base: "orange.300", _dark: "orange.500" } : undefined}
              transition="background 0.15s"
              px="1px"
            >
              {displayChar}
            </Text>
          );
        })}
      </Flex>
    </Box>
  );
}
