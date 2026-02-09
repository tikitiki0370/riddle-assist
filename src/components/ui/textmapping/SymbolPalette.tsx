"use client";
import { Box, Center, SegmentGroup, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { RefObject, useCallback, useRef, useState } from "react";
import { SymbolCategory } from "@/types/textMapping";

const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    id: "shapes",
    label: "図形",
    symbols: ["○", "●", "◎", "△", "▲", "▽", "▼", "□", "■", "◇", "◆", "☆", "★", "▷", "▶", "◁", "◀"],
  },
  {
    id: "suits",
    label: "トランプ",
    symbols: ["♠", "♣", "♥", "♦", "♤", "♧", "♡", "♢"],
  },
  {
    id: "arrows",
    label: "矢印",
    symbols: ["↑", "↓", "←", "→", "↗", "↘", "↙", "↖", "↔", "↕"],
  },
  {
    id: "misc",
    label: "その他",
    symbols: ["♪", "♫", "☀", "☁", "☂", "☃", "✿", "❀", "☎", "✉", "⚡", "☾", "†", "‡", "§", "¶"],
  },
];

interface SymbolPaletteProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onInsertSymbol: (symbol: string, cursorPos: number) => void;
}

export default function SymbolPalette({ textareaRef, onInsertSymbol }: SymbolPaletteProps) {
  const [activeCategory, setActiveCategory] = useState(SYMBOL_CATEGORIES[0].id);
  const pendingCursorPos = useRef<number | null>(null);

  const currentCategory = SYMBOL_CATEGORIES.find((c) => c.id === activeCategory) ?? SYMBOL_CATEGORIES[0];

  const restoreCursor = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea && pendingCursorPos.current !== null) {
      textarea.focus();
      textarea.setSelectionRange(pendingCursorPos.current, pendingCursorPos.current);
      pendingCursorPos.current = null;
    }
  }, [textareaRef]);

  const handleSymbolClick = (symbol: string) => {
    const textarea = textareaRef.current;
    const cursorPos = textarea?.selectionStart ?? textarea?.value.length ?? 0;
    pendingCursorPos.current = cursorPos + symbol.length;
    onInsertSymbol(symbol, cursorPos);

    // Restore focus and cursor position after React re-render
    requestAnimationFrame(restoreCursor);
  };

  return (
    <VStack gap={2} align="stretch">
      <SegmentGroup.Root
        value={activeCategory}
        onValueChange={(e) => { if (e.value) setActiveCategory(e.value); }}
        size="sm"
      >
        <SegmentGroup.Indicator />
        {SYMBOL_CATEGORIES.map((cat) => (
          <SegmentGroup.Item key={cat.id} value={cat.id}>
            <SegmentGroup.ItemText>{cat.label}</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        ))}
      </SegmentGroup.Root>

      <SimpleGrid minChildWidth="48px" gap={1}>
        {currentCategory.symbols.map((symbol) => (
          <Box
            key={symbol}
            aspectRatio={1}
            borderWidth={1}
            borderRadius="md"
            cursor="pointer"
            userSelect="none"
            _hover={{ bg: { base: "gray.50", _dark: "gray.700" } }}
            _active={{ bg: { base: "blue.50", _dark: "blue.900" } }}
            onClick={() => handleSymbolClick(symbol)}
          >
            <Center h="full">
              <Text fontSize="lg" fontWeight="medium">
                {symbol}
              </Text>
            </Center>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
