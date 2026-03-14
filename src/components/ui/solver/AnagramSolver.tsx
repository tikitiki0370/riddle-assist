"use client";
import {
  Box,
  Button,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { LuClipboard, LuTrash2 } from "react-icons/lu";
import { generateAnagrams } from "@/lib/solverEngine/puzzle/anagram";

const MAX_LENGTH = 10;

export default function AnagramSolver() {
  const [input, setInput] = useState("");

  const results = useMemo(() => {
    if (input.length === 0) return [];
    return generateAnagrams(input);
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join("\n"));
  };

  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4}>
        <Input
          placeholder="文字列を入力"
          value={input}
          maxLength={MAX_LENGTH}
          onChange={(e) => setInput(e.target.value)}
          size="sm"
          width="200px"
        />
        <Button
          size="sm"
          variant="outline"
          colorPalette="red"
          onClick={() => setInput("")}
        >
          <LuTrash2 /> Clear
        </Button>
      </HStack>

      {results.length > 0 && (
        <VStack gap={3} align="stretch">
          <HStack gap={2}>
            <Text fontSize="sm" fontWeight="medium">
              {results.length} パターン
            </Text>
            <Button size="xs" variant="ghost" onClick={handleCopy}>
              <LuClipboard /> コピー
            </Button>
          </HStack>
          <Box
            maxH="400px"
            overflowY="auto"
            borderWidth="1px"
            borderRadius="md"
            p={3}
          >
            <Text fontSize="sm" whiteSpace="pre-wrap" fontFamily="mono">
              {results.join("\n")}
            </Text>
          </Box>
        </VStack>
      )}
    </VStack>
  );
}
