"use client";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { TranslateEntry, PresetConfig } from "@/types/translate";

interface TranslatePreviewProps {
  result: string;
  entries: TranslateEntry[];
  activePreset: PresetConfig | null;
  activeFontFamily: string | null;
}

export default function TranslatePreview({
  result,
  entries,
  activePreset,
  activeFontFamily,
}: TranslatePreviewProps) {
  // output -> TranslateEntry のマップを作成
  const outputToEntry = useMemo(() => {
    const map = new Map<string, TranslateEntry>();
    for (const entry of entries) {
      map.set(entry.output, entry);
    }
    return map;
  }, [entries]);

  // result の各文字を表示要素に変換
  const renderChars = useMemo(() => {
    const isCaseSensitive = activePreset?.caseSensitive;

    return result.split("").map((char, i) => {
      const upperChar = char.toUpperCase();
      // caseSensitive: true → 大文字でマッチ、false → 入力文字 → 大文字の順でマッチ
      const entry = isCaseSensitive
        ? outputToEntry.get(upperChar)
        : (outputToEntry.get(char) || outputToEntry.get(upperChar));

      if (char === " ") {
        return <Box key={i} w="1em" display="inline-block" />;
      }

      if (entry?.imageUrl) {
        const imageSrc = activePreset
          ? `/translate-preset/${activePreset.id}/${entry.imageUrl}`
          : entry.imageUrl;
        return (
          <Image
            key={i}
            src={imageSrc}
            alt={entry.output}
            height="48px"
            objectFit="contain"
            display="inline-block"
          />
        );
      }

      if (entry && activeFontFamily) {
        const displayChar = isCaseSensitive ? entry.display : char;
        return (
          <Text
            key={i}
            as="span"
            style={{ fontFamily: activeFontFamily, fontSize: "2rem" }}
          >
            {displayChar}
          </Text>
        );
      }

      // 対応するエントリがない文字はそのまま表示
      return (
        <Text
          key={i}
          as="span"
          style={{ fontFamily: activeFontFamily ?? undefined, fontSize: "2rem" }}
        >
          {char}
        </Text>
      );
    });
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
