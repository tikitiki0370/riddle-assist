"use client";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Input,
  Slider,
  Switch,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { LuRemoveFormatting } from "react-icons/lu";
import BinaryGrid from "@/components/ui/textimage/BinaryGrid";

function parseBinaryInput(
  input: string,
  columns: number,
  inverted: boolean,
): boolean[][] {
  const cleaned = input.replace(/[^01\n]/g, "");
  if (cleaned.length === 0) return [];

  let lines: string[];
  if (cleaned.includes("\n")) {
    lines = cleaned.split("\n").filter((line) => line.length > 0);
  } else {
    lines = [];
    for (let i = 0; i < cleaned.length; i += columns) {
      lines.push(cleaned.slice(i, i + columns));
    }
  }

  return lines.map((line) =>
    Array.from(line).map((ch) => {
      const isOne = ch === "1";
      return inverted ? !isOne : isOne;
    }),
  );
}

export default function TextImagePage() {
  const [rawInput, setRawInput] = useState("");
  const [columns, setColumns] = useState(8);
  const [cellSize, setCellSize] = useState(16);
  const [inverted, setInverted] = useState(false);

  const hasNewlines = rawInput.includes("\n");

  const gridData = useMemo(
    () => parseBinaryInput(rawInput, columns, inverted),
    [rawInput, columns, inverted],
  );

  return (
    <Box py={10}>
      <Center pb={10}>
        <Heading>Text Image</Heading>
      </Center>
      <Container w={"60vw"}>
        <VStack gap={6} align="stretch">
          {/* 入力エリア */}
          <Textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="0と1を入力 (改行で行を区切る)"
            fontFamily="monospace"
            minH="150px"
          />

          {/* コントロール */}
          <HStack gap={6} flexWrap="wrap" align="center">
            {/* 列数スライダー */}
            <HStack gap={2}>
              <HStack gap={2} opacity={hasNewlines ? 0.4 : 1}>
                <Text fontSize="sm" flexShrink={0}>
                  列数
                </Text>
                <Slider.Root
                  w="120px"
                  size="sm"
                  min={1}
                  max={64}
                  step={1}
                  value={[columns]}
                  onValueChange={(details) => setColumns(details.value[0])}
                  disabled={hasNewlines}
                >
                  <Slider.Control>
                    <Slider.Track>
                      <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumbs />
                  </Slider.Control>
                </Slider.Root>
                <Text fontSize="sm" w="30px" textAlign="right">
                  {columns}
                </Text>
              </HStack>
              {hasNewlines && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setRawInput((prev) => prev.replace(/\n/g, ""))}
                >
                  <LuRemoveFormatting /> 改行削除
                </Button>
              )}
            </HStack>

            {/* セルサイズ */}
            <HStack gap={2}>
              <Text fontSize="sm" flexShrink={0}>
                セルサイズ
              </Text>
              <Input
                type="number"
                value={cellSize}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (v >= 1 && v <= 64) setCellSize(v);
                }}
                w="70px"
                size="sm"
                min={1}
                max={64}
              />
              <Text fontSize="sm">px</Text>
            </HStack>

            {/* 反転トグル */}
            <HStack gap={2}>
              <Switch.Root
                size="sm"
                checked={inverted}
                onCheckedChange={(details) => setInverted(details.checked)}
              >
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>反転</Switch.Label>
              </Switch.Root>
            </HStack>
          </HStack>

          {/* グリッド出力 */}
          {gridData.length > 0 && (
            <BinaryGrid grid={gridData} cellSize={cellSize} />
          )}
        </VStack>
      </Container>
    </Box>
  );
}
