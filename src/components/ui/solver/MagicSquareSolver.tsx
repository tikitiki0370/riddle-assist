"use client";
import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  NumberInput,
  SimpleGrid,
  Slider,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LuPlay, LuTrash2 } from "react-icons/lu";
import type { MagicSquareResult } from "@/lib/solverEngine/puzzle/magicSquare";

export default function MagicSquareSolver() {
  const [n, setN] = useState(3);
  const [cells, setCells] = useState<string[]>(Array(9).fill(""));
  const [result, setResult] = useState<MagicSquareResult | null>(null);
  const [patternIndex, setPatternIndex] = useState(0);
  const [isSolving, setIsSolving] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const terminateWorker = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  };

  useEffect(() => {
    return () => terminateWorker();
  }, []);

  const handleNChange = (value: number) => {
    setN(value);
    setCells(Array(value * value).fill(""));
    setResult(null);
    setPatternIndex(0);
  };

  const handleCellChange = (index: number, value: string) => {
    const num = value.replace(/[^0-9]/g, "");
    setCells((prev) => {
      const next = [...prev];
      next[index] = num;
      return next;
    });
  };

  const handleSolve = () => {
    terminateWorker();

    const prefilled = cells.map((v) => {
      const num = parseInt(v, 10);
      return isNaN(num) ? null : num;
    });

    setIsSolving(true);
    setResult(null);
    setPatternIndex(0);

    const worker = new Worker(
      new URL(
        "../../../lib/solverEngine/puzzle/magicSquare/worker.ts",
        import.meta.url,
      ),
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<MagicSquareResult>) => {
      setResult(e.data);
      setIsSolving(false);
      workerRef.current = null;
    };

    worker.postMessage({ n, prefilled });
  };

  const handleClear = () => {
    terminateWorker();
    setCells(Array(n * n).fill(""));
    setResult(null);
    setPatternIndex(0);
    setIsSolving(false);
  };

  const prefilledSet = new Set<number>();
  cells.forEach((v, i) => {
    if (v !== "") prefilledSet.add(i);
  });

  const currentSolution = result?.solutions[patternIndex];
  const solutionCount = result?.solutions.length ?? 0;
  const magic = (n * (n * n + 1)) / 2;

  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4}>
        <HStack gap={2}>
          <Text fontSize="sm" fontWeight="medium">N:</Text>
          <NumberInput.Root
            size="sm"
            width="80px"
            value={String(n)}
            onValueChange={(e) => {
              const v = Number(e.value);
              if (v >= 3 && v <= 5) handleNChange(v);
            }}
            min={3}
            max={5}
          >
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
            <NumberInput.Input />
          </NumberInput.Root>
        </HStack>
        <Text fontSize="xs" color="fg.muted">
          定数 = {magic}
        </Text>
        <Button size="sm" onClick={handleSolve} disabled={isSolving}>
          <LuPlay /> ソルブ
        </Button>
        <Button
          size="sm"
          variant="outline"
          colorPalette="red"
          onClick={handleClear}
        >
          <LuTrash2 /> Clear
        </Button>
      </HStack>

      {/* Grid */}
      <Center>
        <Box position="relative" w="fit-content">
          <SimpleGrid columns={n} gap={1}>
            {Array.from({ length: n * n }).map((_, i) => {
              const isPrefilled = prefilledSet.has(i);
              const showResult = currentSolution != null;

              return (
                <Box key={i}>
                  {showResult ? (
                    <Center
                      w="48px"
                      h="48px"
                      borderWidth="1px"
                      borderRadius="md"
                      fontWeight={isPrefilled ? "bold" : "normal"}
                      bg={isPrefilled ? "colorPalette.subtle" : undefined}
                      fontSize="lg"
                    >
                      {currentSolution[i]}
                    </Center>
                  ) : (
                    <Input
                      w="48px"
                      h="48px"
                      textAlign="center"
                      fontSize="lg"
                      p={0}
                      value={cells[i]}
                      onChange={(e) => handleCellChange(i, e.target.value)}
                      placeholder="·"
                      disabled={isSolving}
                    />
                  )}
                </Box>
              );
            })}
          </SimpleGrid>
          {isSolving && (
            <Center
              position="absolute"
              inset={0}
              bg="bg/60"
              borderRadius="md"
            >
              <Spinner size="lg" />
            </Center>
          )}
        </Box>
      </Center>

      {/* Results */}
      {result != null && (
        <VStack gap={3} align="stretch">
          {solutionCount === 0 ? (
            <Text color="fg.muted" textAlign="center">解が見つかりませんでした</Text>
          ) : (
            <>
              <HStack gap={1}>
                <Text fontSize="sm" whiteSpace="nowrap">パターン</Text>
                <NumberInput.Root
                  size="xs"
                  width="70px"
                  min={1}
                  max={solutionCount}
                  value={String(patternIndex + 1)}
                  onValueChange={(e) => {
                    const v = Number(e.value);
                    if (v >= 1 && v <= solutionCount) setPatternIndex(v - 1);
                  }}
                >
                  <NumberInput.Control>
                    <NumberInput.IncrementTrigger />
                    <NumberInput.DecrementTrigger />
                  </NumberInput.Control>
                  <NumberInput.Input />
                </NumberInput.Root>
                <Text fontSize="sm" whiteSpace="nowrap">
                  / {solutionCount}
                  {!result.exhausted && "（上限到達）"}
                </Text>
              </HStack>
              {solutionCount > 1 && (
                <Slider.Root
                  size="sm"
                  min={0}
                  max={solutionCount - 1}
                  step={1}
                  value={[patternIndex]}
                  onValueChange={(details) => setPatternIndex(details.value[0])}
                >
                  <Slider.Control>
                    <Slider.Track>
                      <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumbs />
                  </Slider.Control>
                </Slider.Root>
              )}
            </>
          )}
        </VStack>
      )}
    </VStack>
  );
}
