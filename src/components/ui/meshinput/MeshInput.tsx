"use client";
import { Grid, HStack, Text, VStack } from "@chakra-ui/react";
import HashGridCell from "./HashGridCell";
import XGridCell from "./XGridCell";

interface MeshInputProps {
  onInput: (char: string) => void;
}

// 井型グリッド（点なし）: A-I
const HASH_NO_DOT = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
// 井型グリッド（点あり）: J-R
const HASH_WITH_DOT = ["J", "K", "L", "M", "N", "O", "P", "Q", "R"];
// X型グリッド（点なし）: S, U, V, T (上, 右, 下, 左)
const X_NO_DOT = ["S", "U", "V", "T"];
// X型グリッド（点あり）: W, Y, Z, X (上, 右, 下, 左)
const X_WITH_DOT = ["W", "Y", "Z", "X"];

export default function MeshInput({ onInput }: MeshInputProps) {
  return (
    <HStack gap={6} justify="center" align="start" flexWrap="wrap">
      {/* 井型グリッド（点なし）A-I */}
      <VStack gap={1}>
        <Text fontSize="xs" color="gray.400">A-I</Text>
        <Grid templateColumns="repeat(3, 60px)" gap={0}>
          {HASH_NO_DOT.map((char, index) => (
            <HashGridCell
              key={char}
              char={char}
              position={index}
              showDot={false}
              onClick={() => onInput(char)}
            />
          ))}
        </Grid>
      </VStack>

      {/* 井型グリッド（点あり）J-R */}
      <VStack gap={1}>
        <Text fontSize="xs" color="gray.400">J-R</Text>
        <Grid templateColumns="repeat(3, 60px)" gap={0}>
          {HASH_WITH_DOT.map((char, index) => (
            <HashGridCell
              key={char}
              char={char}
              position={index}
              showDot={true}
              onClick={() => onInput(char)}
            />
          ))}
        </Grid>
      </VStack>

      {/* X型グリッド（点なし）S-V */}
      <VStack gap={1}>
        <Text fontSize="xs" color="gray.400">S-V</Text>
        <XGridCell
          chars={X_NO_DOT}
          showDot={false}
          onCellClick={onInput}
        />
      </VStack>

      {/* X型グリッド（点あり）W-Z */}
      <VStack gap={1}>
        <Text fontSize="xs" color="gray.400">W-Z</Text>
        <XGridCell
          chars={X_WITH_DOT}
          showDot={true}
          onCellClick={onInput}
        />
      </VStack>
    </HStack>
  );
}
