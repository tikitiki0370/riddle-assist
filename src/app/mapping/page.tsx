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
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { Suspense, useState } from "react";
import { LuCheck, LuCopy, LuDelete, LuSpace, LuTrash2 } from "react-icons/lu";
import CreateMappingModal from "@/components/ui/mapping/CreateMappingModal";
import MappingCard from "@/components/ui/mapping/MappingCard";
import MappingPreview from "@/components/ui/mapping/MappingPreview";
import { useMappingPresets } from "@/hooks/useMappingPresets";
import { useResultInput } from "@/hooks/useResultInput";

export default function MappingPage() {
  return (
    <Suspense fallback={<Center py={10}><Spinner /></Center>}>
      <MappingPageContent />
    </Suspense>
  );
}

function MappingPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    presets,
    loadingPresets,
    activePresetId,
    activePreset,
    mappings,
    activeFontFamily,
    mode,
    setMode,
    isPresetActive,
    customFontName,
    handlePresetClick,
    handleFontLoaded,
  } = useMappingPresets();

  const {
    result,
    setResult,
    handleCharClick,
    handleSpace,
    handleBackspace,
    handleClear,
  } = useResultInput();

  return (
    <Box py={10}>
      <Center pb={10}>
        <Heading>テキストマッピング</Heading>
      </Center>
      <Container w={"60vw"}>
        <VStack gap={6} align="stretch">
          {/* Preset Cards */}
          <SimpleGrid columns={4} gap={4}>
            {loadingPresets ? (
              <Center><Spinner size="sm" /></Center>
            ) : (
              presets.map((preset) => (
                <MappingCard
                  key={preset.id}
                  preset={preset}
                  isActive={activePresetId === preset.id}
                  onClick={() => handlePresetClick(preset.id)}
                />
              ))
            )}

            {/* Create New Card */}
            <MappingCard
              title={customFontName || "新規作成"}
              subtitle={customFontName ? "カスタムフォント" : "フォントファイルを利用できます"}
              isActive={!!customFontName && !activePreset}
              onClick={() => setIsModalOpen(true)}
            />
          </SimpleGrid>

          {/* Create New Modal */}
          <CreateMappingModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onFontLoaded={handleFontLoaded}
          />

          {/* Result */}
          <Clipboard.Root value={result}>
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
          <MappingPreview
            result={result}
            mappings={mappings}
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
          <SimpleGrid columns={7} gap={2}>
            {mappings.map((entry, index) => (
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
                    src={activePreset ? `/mapping-preset/${activePreset.id}/${entry.imageUrl}` : entry.imageUrl}
                    alt={entry.output}
                    height="32px"
                    objectFit="contain"
                  />
                ) : (
                  entry.display
                )}
              </Button>
            ))}
          </SimpleGrid>

          {/* Control Buttons */}
          <HStack gap={2}>
            <Button variant="outline" onClick={handleSpace}>
              <LuSpace /> Space
            </Button>
            <Button variant="outline" onClick={handleBackspace}>
              <LuDelete /> Back
            </Button>
            <Button variant="outline" colorPalette="red" onClick={handleClear}>
              <LuTrash2 /> Clear
            </Button>
          </HStack>

        </VStack>
      </Container>
    </Box>
  );
}
