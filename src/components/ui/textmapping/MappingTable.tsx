"use client";
import { Input, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface MappingTableHandle {
  focusSymbol: (symbol: string) => void;
}

interface MappingTableProps {
  uniqueSymbols: string[];
  mappings: Record<string, string>;
  duplicateReplacements: Set<string>;
  focusedSymbol: string | null;
  onSetMapping: (symbol: string, replacement: string) => void;
  onSymbolFocus: (symbol: string | null) => void;
}

const MappingTable = forwardRef<MappingTableHandle, MappingTableProps>(
  function MappingTable(
    {
      uniqueSymbols,
      mappings,
      duplicateReplacements,
      focusedSymbol,
      onSetMapping,
      onSymbolFocus,
    },
    ref,
  ) {
    const inputRefs = useRef(new Map<string, HTMLInputElement>());

    const setInputRef = useCallback((symbol: string, el: HTMLInputElement | null) => {
      if (el) {
        inputRefs.current.set(symbol, el);
      } else {
        inputRefs.current.delete(symbol);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      focusSymbol(symbol: string) {
        const input = inputRefs.current.get(symbol);
        if (input) {
          input.focus();
          input.select();
        }
      },
    }));

    if (uniqueSymbols.length === 0) return null;

    return (
      <SimpleGrid minChildWidth="60px" gap={1.5}>
        {uniqueSymbols.map((symbol) => {
          const isMapped = !!mappings[symbol];
          const isFocused = symbol === focusedSymbol;
          const isDuplicate = duplicateReplacements.has(symbol);

          const borderColor = isDuplicate
            ? { base: "red.400", _dark: "red.300" }
            : !isMapped
              ? { base: "orange.400", _dark: "orange.300" }
              : { base: "gray.200", _dark: "gray.600" };

          return (
            <VStack
              key={symbol}
              gap={0.5}
              p={1.5}
              borderWidth="1px"
              borderRadius="md"
              borderColor={borderColor}
              bg={isFocused ? { base: "blue.50", _dark: "blue.900" } : undefined}
              transition="background 0.15s, border-color 0.15s"
            >
              <Text fontSize="xl" fontFamily="monospace" textAlign="center">
                {symbol}
              </Text>
              <Input
                ref={(el) => setInputRef(symbol, el)}
                maxLength={1}
                value={mappings[symbol] || ""}
                onChange={(e) => onSetMapping(symbol, e.target.value.slice(-1))}
                onFocus={() => onSymbolFocus(symbol)}
                onBlur={() => onSymbolFocus(null)}
                textAlign="center"
                fontSize="md"
                size="xs"
              />
            </VStack>
          );
        })}
      </SimpleGrid>
    );
  },
);

export default MappingTable;
