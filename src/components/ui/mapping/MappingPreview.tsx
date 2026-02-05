"use client";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { MappingEntry, PresetConfig } from "@/types/mapping";

interface MappingPreviewProps {
  result: string;
  mappings: MappingEntry[];
  activePreset: PresetConfig | null;
  activeFontFamily: string | null;
}

export default function MappingPreview({
  result,
  mappings,
  activePreset,
  activeFontFamily,
}: MappingPreviewProps) {
  // output -> MappingEntry のマップを作成
  const outputToEntry = useMemo(() => {
    const map = new Map<string, MappingEntry>();
    for (const entry of mappings) {
      map.set(entry.output, entry);
    }
    return map;
  }, [mappings]);

  // result の各文字を表示要素に変換
  const renderChars = useMemo(() => {
    const chars: React.ReactNode[] = [];
    let i = 0;

    while (i < result.length) {
      const char = result[i];
      const entry = outputToEntry.get(char);

      if (char === " ") {
        // スペースは空白として表示
        chars.push(
          <Box key={i} w="1em" display="inline-block" />
        );
      } else if (entry?.imageUrl) {
        // 画像ベースのエントリ
        const imageSrc = activePreset
          ? `/mapping-preset/${activePreset.id}/${entry.imageUrl}`
          : entry.imageUrl;
        chars.push(
          <Image
            key={i}
            src={imageSrc}
            alt={entry.output}
            height="48px"
            objectFit="contain"
            display="inline-block"
          />
        );
      } else if (entry && activeFontFamily) {
        // フォントベースのエントリ
        chars.push(
          <Text
            key={i}
            as="span"
            style={{
              fontFamily: activeFontFamily,
              fontSize: "2rem",
            }}
          >
            {entry.display}
          </Text>
        );
      } else {
        // マッピングにない文字はそのまま表示
        chars.push(
          <Text
            key={i}
            as="span"
            style={{
              fontFamily: activeFontFamily || undefined,
              fontSize: "2rem",
            }}
          >
            {char}
          </Text>
        );
      }

      i++;
    }

    return chars;
  }, [result, outputToEntry, activePreset, activeFontFamily]);

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      minH="60px"
      overflowX="auto"
    >
      <Flex align="center" gap={1} flexWrap="wrap">
        {result ? renderChars : (
          <Text color="gray.500" fontSize="2rem">
            入力した文字がここに表示されます
          </Text>
        )}
      </Flex>
    </Box>
  );
}
