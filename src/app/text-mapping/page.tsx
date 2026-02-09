"use client";
import {
  Box,
  Button,
  Center,
  Clipboard,
  Container,
  Heading,
  HStack,
  Spacer,
  Spinner,
  Switch,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Suspense, useCallback, useRef, useState } from "react";
import { LuCheck, LuCopy, LuTrash2 } from "react-icons/lu";
import { useTextMapping } from "@/hooks/useTextMapping";
import SymbolPalette from "@/components/ui/textmapping/SymbolPalette";
import MappingTable, { MappingTableHandle } from "@/components/ui/textmapping/MappingTable";
import MappingPreview from "@/components/ui/textmapping/MappingPreview";

export default function TextMappingPage() {
  return (
    <Suspense fallback={<Center py={10}><Spinner /></Center>}>
      <TextMappingPageContent />
    </Suspense>
  );
}

function TextMappingPageContent() {
  const {
    encoded,
    updateEncoded,
    mappings,
    setMapping,
    clearMappings,
    symbolsOnly,
    setSymbolsOnly,
    uniqueSymbols,
    decoded,
    unmappedSymbols,
    duplicateReplacements,
  } = useTextMapping();

  const [focusedSymbol, setFocusedSymbol] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mappingTableRef = useRef<MappingTableHandle>(null);

  const handleInsertSymbol = useCallback(
    (symbol: string, cursorPos: number) => {
      updateEncoded(
        (prev) => prev.slice(0, cursorPos) + symbol + prev.slice(cursorPos),
      );
    },
    [updateEncoded],
  );

  const handlePreviewSymbolClick = useCallback((symbol: string) => {
    mappingTableRef.current?.focusSymbol(symbol);
  }, []);

  return (
    <Box py={10}>
      <Center pb={10}>
        <Heading>テキストマッピング</Heading>
      </Center>
      <Container w="60vw">
        <VStack gap={6} align="stretch">
          {/* Encoded text input */}
          <Textarea
            ref={textareaRef}
            data-tutorial="textmapping-input"
            value={encoded}
            onChange={(e) => updateEncoded(e.target.value)}
            placeholder="暗号テキストを入力またはペースト..."
            rows={3}
            fontSize="lg"
          />

          {/* Symbol palette */}
          <Box data-tutorial="textmapping-palette">
            <SymbolPalette
              textareaRef={textareaRef}
              onInsertSymbol={handleInsertSymbol}
            />
          </Box>

          {/* Mapping table */}
          <Box data-tutorial="textmapping-table">
            <MappingTable
              ref={mappingTableRef}
              uniqueSymbols={uniqueSymbols}
              mappings={mappings}
              duplicateReplacements={duplicateReplacements}
              focusedSymbol={focusedSymbol}
              onSetMapping={setMapping}
              onSymbolFocus={setFocusedSymbol}
            />
          </Box>

          {/* Preview */}
          <Box data-tutorial="textmapping-preview">
            <MappingPreview
              encoded={encoded}
              mappings={mappings}
              unmappedSymbols={unmappedSymbols}
              focusedSymbol={focusedSymbol}
              onSymbolClick={handlePreviewSymbolClick}
            />
          </Box>

          {/* Controls */}
          {encoded && (
            <HStack gap={2} flexWrap="wrap">
              <Button variant="outline" colorPalette="red" onClick={clearMappings}>
                <LuTrash2 /> マッピングをクリア
              </Button>
              <Clipboard.Root value={decoded}>
                <Clipboard.Trigger asChild>
                  <Button variant="outline">
                    <Clipboard.Indicator copied={<LuCheck />}>
                      <LuCopy />
                    </Clipboard.Indicator>
                    コピー
                  </Button>
                </Clipboard.Trigger>
              </Clipboard.Root>
              <Spacer />
              <Switch.Root
                size="sm"
                checked={symbolsOnly}
                onCheckedChange={(details) => setSymbolsOnly(details.checked)}
              >
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>記号のみ</Switch.Label>
              </Switch.Root>
            </HStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
