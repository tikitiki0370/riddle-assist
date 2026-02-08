"use client";
import {
  Box,
  Button,
  Center,
  Clipboard,
  Container,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  SegmentGroup,
  SimpleGrid,
  Spacer,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { Suspense, useState } from "react";
import { LuCheck, LuCopy, LuDelete, LuSpace, LuTrash2 } from "react-icons/lu";
import { CaseMode } from "@/hooks/useResultInput";
import CreateTranslateModal from "@/components/ui/translate/CreateTranslateModal";
import TranslateCard from "@/components/ui/translate/TranslateCard";
import TranslatePreview from "@/components/ui/translate/TranslatePreview";
import { useTranslatePresets } from "@/hooks/useTranslatePresets";
import { useResultInput } from "@/hooks/useResultInput";

export default function TranslatePage() {
  return (
    <Suspense fallback={<Center py={10}><Spinner /></Center>}>
      <TranslatePageContent />
    </Suspense>
  );
}

function TranslatePageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    presets,
    loadingPresets,
    activePresetId,
    activePreset,
    entries,
    activeFontFamily,
    mode,
    setMode,
    isPresetActive,
    customFontName,
    handlePresetClick,
    handleFontLoaded,
  } = useTranslatePresets();

  const {
    result,
    setResult,
    handleCharClick,
    handleSpace,
    handleBackspace,
    handleClear,
    caseMode,
    setCaseMode,
  } = useResultInput();

  return (
    <Box py={10}>
      <Center pb={10}>
        <Heading>翻訳機</Heading>
      </Center>
      <Container w="60vw">
        <VStack gap={6} align="stretch">
          {/* Preset Cards */}
          <Box data-tutorial="translate-presets" overflowX="auto" overflowY="hidden" p={1}>
            <HStack gap={4} minW="max-content">
              {loadingPresets ? (
                <Center><Spinner size="sm" /></Center>
              ) : (
                presets.map((preset) => (
                  <TranslateCard
                    key={preset.id}
                    preset={preset}
                    isActive={activePresetId === preset.id}
                    onClick={() => handlePresetClick(preset.id)}
                  />
                ))
              )}

              {/* Create New Card */}
              <TranslateCard
                title={customFontName || "新規作成"}
                subtitle={customFontName ? "カスタムフォント" : "フォントファイルを利用できます"}
                isActive={!!customFontName && !activePreset}
                onClick={() => setIsModalOpen(true)}
              />
            </HStack>
          </Box>

          {/* Create New Modal */}
          <CreateTranslateModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onFontLoaded={handleFontLoaded}
          />

          {/* Result */}
          <Clipboard.Root data-tutorial="translate-result" value={result}>
            <InputGroup
              endElement={
                <Clipboard.Trigger asChild>
                  <Button variant="ghost" size="sm">
                    <Clipboard.Indicator copied={<LuCheck />}>
                      <LuCopy />
                    </Clipboard.Indicator>
                  </Button>
                </Clipboard.Trigger>
              }
            >
              <Input
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="ボタンをクリックして文字を入力..."
              />
            </InputGroup>
          </Clipboard.Root>

          {/* Preview */}
          <TranslatePreview
            result={result}
            entries={entries}
            activePreset={activePreset}
            activeFontFamily={activeFontFamily}
          />

          {/* Mode Toggle (only for custom font) */}
          {!isPresetActive && (
            <SegmentGroup.Root
              value={mode}
              onValueChange={(e) => setMode(e.value as "abc" | "hiragana")}
            >
              <SegmentGroup.Indicator />
              <SegmentGroup.Item value="abc">
                <SegmentGroup.ItemText>ABC123</SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
              <SegmentGroup.Item value="hiragana">
                <SegmentGroup.ItemText>あいうえお</SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            </SegmentGroup.Root>
          )}

          {/* Character Grid */}
          <SimpleGrid data-tutorial="translate-grid" minChildWidth="60px" gap={2}>
            {entries.map((entry, index) => {
              const displayText = activePreset?.caseSensitive
                ? entry.display
                : caseMode === "lower" ? entry.display.toLowerCase() : entry.display.toUpperCase();

              return (
                <Button
                  key={`${entry.display}-${index}`}
                  size="lg"
                  variant="outline"
                  onClick={() => handleCharClick(entry)}
                  style={{
                    fontFamily: (!entry.imageUrl && activeFontFamily) ? activeFontFamily : undefined,
                    fontSize: entry.imageUrl ? undefined : "1.5rem",
                  }}
                  p={entry.imageUrl ? 1 : undefined}
                >
                  {entry.imageUrl ? (
                    <Image
                      src={activePreset ? `/translate-preset/${activePreset.id}/${entry.imageUrl}` : entry.imageUrl}
                      alt={entry.output}
                      height="32px"
                      objectFit="contain"
                    />
                  ) : (
                    displayText
                  )}
                </Button>
              );
            })}
          </SimpleGrid>

          {/* Control Buttons */}
          <HStack gap={2} flexWrap="wrap">
            <Button variant="outline" onClick={handleSpace}>
              <LuSpace /> Space
            </Button>
            <Button variant="outline" onClick={handleBackspace}>
              <LuDelete /> Back
            </Button>
            <Button variant="outline" colorPalette="red" onClick={handleClear}>
              <LuTrash2 /> Clear
            </Button>
            <Spacer />
            <SegmentGroup.Root
              value={caseMode}
              onValueChange={(e) => setCaseMode(e.value as CaseMode)}
            >
              <SegmentGroup.Indicator />
              <SegmentGroup.Item value="lower">
                <SegmentGroup.ItemText>小文字</SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
              <SegmentGroup.Item value="upper">
                <SegmentGroup.ItemText>大文字</SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            </SegmentGroup.Root>
          </HStack>

        </VStack>
      </Container>
    </Box>
  );
}
