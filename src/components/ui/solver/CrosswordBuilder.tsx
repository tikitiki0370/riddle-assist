"use client";
import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  NumberInput,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import { LuHammer, LuRefreshCw, LuTrash2, LuUndo2 } from "react-icons/lu";

export default function CrosswordBuilder() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [mask, setMask] = useState<boolean[]>(Array(225).fill(true));
  const [texts, setTexts] = useState<string[]>(Array(225).fill(""));
  const [mode, setMode] = useState<"build" | "input">("build");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const total = rows * cols;

  const handleRowsChange = (value: number) => {
    setRows(value);
    const newTotal = value * cols;
    setMask(Array(newTotal).fill(true));
    setTexts(Array(newTotal).fill(""));
  };

  const handleColsChange = (value: number) => {
    setCols(value);
    const newTotal = rows * value;
    setMask(Array(newTotal).fill(true));
    setTexts(Array(newTotal).fill(""));
  };

  const toggleCell = (index: number) => {
    setMask((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleTextChange = (index: number, value: string) => {
    const char = value.slice(-1);
    setTexts((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
  };

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      let target = -1;

      if (e.key === "ArrowLeft") {
        for (let c = col - 1; c >= 0; c--) {
          const idx = row * cols + c;
          if (mask[idx]) { target = idx; break; }
        }
      } else if (e.key === "ArrowRight") {
        for (let c = col + 1; c < cols; c++) {
          const idx = row * cols + c;
          if (mask[idx]) { target = idx; break; }
        }
      } else if (e.key === "ArrowUp") {
        for (let r = row - 1; r >= 0; r--) {
          const idx = r * cols + col;
          if (mask[idx]) { target = idx; break; }
        }
      } else if (e.key === "ArrowDown") {
        for (let r = row + 1; r < rows; r++) {
          const idx = r * cols + col;
          if (mask[idx]) { target = idx; break; }
        }
      }

      if (target !== -1) {
        e.preventDefault();
        inputRefs.current[target]?.focus();
      }
    },
    [cols, rows, mask],
  );

  const clearBuild = () => {
    setMask(Array(total).fill(true));
  };

  const invertMask = () => {
    setMask((prev) => prev.map((v) => !v));
  };

  const clearInput = () => {
    setTexts(Array(total).fill(""));
  };

  const CELL_SIZE = "28px";

  if (mode === "input") {
    return (
      <VStack gap={6} align="stretch">
        <HStack gap={4}>
          <Button size="sm" variant="outline" onClick={() => setMode("build")}>
            <LuUndo2 /> 戻る
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorPalette="red"
            onClick={clearInput}
          >
            <LuTrash2 /> Clear
          </Button>
        </HStack>

        <Center>
          <Box w="fit-content">
            <SimpleGrid columns={cols} gap="1px">
              {Array.from({ length: total }).map((_, i) =>
                mask[i] ? (
                  <Input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    w={CELL_SIZE}
                    h={CELL_SIZE}
                    minW={0}
                    p={0}
                    textAlign="center"
                    fontSize="sm"
                    borderRadius={0}
                    value={texts[i]}
                    onChange={(e) => handleTextChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                  />
                ) : (
                  <Box
                    key={i}
                    w={CELL_SIZE}
                    h={CELL_SIZE}
                    bg="black"
                  />
                ),
              )}
            </SimpleGrid>
          </Box>
        </Center>
      </VStack>
    );
  }

  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4} flexWrap="wrap">
        <HStack gap={2}>
          <Text fontSize="sm" fontWeight="medium">行:</Text>
          <NumberInput.Root
            size="sm"
            width="80px"
            value={String(rows)}
            onValueChange={(e) => {
              const v = Number(e.value);
              if (v >= 1 && v <= 30) handleRowsChange(v);
            }}
            min={1}
            max={30}
          >
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
            <NumberInput.Input />
          </NumberInput.Root>
        </HStack>
        <HStack gap={2}>
          <Text fontSize="sm" fontWeight="medium">列:</Text>
          <NumberInput.Root
            size="sm"
            width="80px"
            value={String(cols)}
            onValueChange={(e) => {
              const v = Number(e.value);
              if (v >= 1 && v <= 30) handleColsChange(v);
            }}
            min={1}
            max={30}
          >
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
            <NumberInput.Input />
          </NumberInput.Root>
        </HStack>
        <Button size="sm" onClick={() => setMode("input")}>
          <LuHammer /> 作成
        </Button>
        <Button size="sm" variant="outline" onClick={invertMask}>
          <LuRefreshCw /> 反転
        </Button>
        <Button
          size="sm"
          variant="outline"
          colorPalette="red"
          onClick={clearBuild}
        >
          <LuTrash2 /> Clear
        </Button>
      </HStack>

      <Center>
        <Box w="fit-content">
          <SimpleGrid columns={cols} gap="1px">
            {Array.from({ length: total }).map((_, i) => (
              <Box
                key={i}
                w={CELL_SIZE}
                h={CELL_SIZE}
                bg={mask[i] ? "bg" : "black"}
                borderWidth="1px"
                borderColor="border"
                cursor="pointer"
                onClick={() => toggleCell(i)}
                _hover={{ opacity: 0.7 }}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Center>
    </VStack>
  );
}
