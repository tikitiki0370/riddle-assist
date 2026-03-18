"use client";
import {
  Box,
  Button,
  HStack,
  Input,
  NativeSelect,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuBookOpen, LuClipboard, LuLoader, LuTrash2 } from "react-icons/lu";
import { generateAnagrams } from "@/lib/solverEngine/puzzle/anagram";
import {
  fetchDictionaries,
  anagramMatch,
  type DictionaryInfo,
} from "@/lib/api/wordsearch";

const MAX_LENGTH = 10;

export default function AnagramSolver() {
  const [input, setInput] = useState("");
  const [dictionaries, setDictionaries] = useState<DictionaryInfo[]>([]);
  const [selectedDict, setSelectedDict] = useState("");
  const [matchedWords, setMatchedWords] = useState<Set<string> | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchDictionaries()
      .then((dicts) => {
        setDictionaries(dicts);
        if (dicts.length > 0) setSelectedDict(dicts[0].id);
      })
      .catch(() => {});
  }, []);

  const results = useMemo(() => {
    if (input.length === 0) return [];
    return generateAnagrams(input);
  }, [input]);

  const cancelMatch = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsMatching(false);
    setMatchedWords(null);
    setMatchError(null);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    cancelMatch();
  };

  const handleClear = () => {
    handleInputChange("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join("\n"));
  };

  const handleCopyMatched = () => {
    if (!matchedWords) return;
    const matched = results.filter((r) => matchedWords.has(r));
    navigator.clipboard.writeText(matched.join("\n"));
  };

  const handleDictMatch = async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsMatching(true);
    setMatchError(null);
    try {
      const matched = await anagramMatch(selectedDict, input, controller.signal);
      if (!controller.signal.aborted) {
        setMatchedWords(new Set(matched));
      }
    } catch (e) {
      if (controller.signal.aborted) return;
      setMatchError(e instanceof Error ? e.message : "辞書マッチに失敗しました");
    } finally {
      if (!controller.signal.aborted) {
        setIsMatching(false);
      }
    }
  };

  const canMatch = input.length > 0 && selectedDict !== "";
  const matchedList = useMemo(
    () => (matchedWords ? results.filter((r) => matchedWords.has(r)) : []),
    [matchedWords, results]
  );

  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4}>
        <Input
          placeholder="文字列を入力"
          value={input}
          maxLength={MAX_LENGTH}
          onChange={(e) => handleInputChange(e.target.value)}
          size="sm"
          width="200px"
        />
        <Button
          size="sm"
          variant="outline"
          colorPalette="red"
          onClick={handleClear}
        >
          <LuTrash2 /> Clear
        </Button>
      </HStack>

      {results.length > 0 && (
        <VStack gap={3} align="stretch">
          <HStack gap={2} flexWrap="wrap">
            <Text fontSize="sm" fontWeight="medium">
              {results.length} パターン
            </Text>
            <Button size="xs" variant="ghost" onClick={handleCopy}>
              <LuClipboard /> コピー
            </Button>
            {dictionaries.length > 0 && (
              <NativeSelect.Root size="xs" width="auto">
                <NativeSelect.Field
                  value={selectedDict}
                  onChange={(e) => {
                    setSelectedDict(e.target.value);
                    cancelMatch();
                  }}
                >
                  {dictionaries.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            )}
            <Button
              size="xs"
              variant="solid"
              colorPalette="teal"
              onClick={handleDictMatch}
              disabled={!canMatch || isMatching}
            >
              {isMatching ? <LuLoader /> : <LuBookOpen />}
              {isMatching ? "検索中..." : "辞書マッチ"}
            </Button>
          </HStack>

          {matchError && (
            <Text fontSize="sm" color="fg.error">
              {matchError}
            </Text>
          )}

          {matchedWords && (
            <Box borderWidth="1px" borderRadius="md" p={3} borderColor="teal.500">
              <HStack gap={2} mb={2}>
                <Text fontSize="sm" fontWeight="medium" color="teal.600">
                  辞書ヒット: {matchedList.length}件
                </Text>
                {matchedList.length > 0 && (
                  <Button size="xs" variant="ghost" onClick={handleCopyMatched}>
                    <LuClipboard /> コピー
                  </Button>
                )}
              </HStack>
              {matchedList.length > 0 ? (
                <Text fontSize="sm" whiteSpace="pre-wrap" fontFamily="mono">
                  {matchedList.join("\n")}
                </Text>
              ) : (
                <Text fontSize="sm" color="fg.muted">
                  マッチする単語はありませんでした
                </Text>
              )}
            </Box>
          )}

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
