"use client";
import { Grid } from "@chakra-ui/react";
import FlickKey from "./FlickKey";
import { FlickKeyConfig, FLICK_KEYS } from "@/lib/flickInput/keyMapping";

interface FlickInputProps {
  onInput: (char: string) => void;
  keys?: FlickKeyConfig[];
  columns?: number;
}

export default function FlickInput({ onInput, keys = FLICK_KEYS, columns = 3 }: FlickInputProps) {
  return (
    <Grid templateColumns={`repeat(${columns}, 60px)`} gap={2} justifyContent="center">
      {keys.map((keyConfig) => (
        <FlickKey key={keyConfig.id} config={keyConfig} onInput={onInput} />
      ))}
    </Grid>
  );
}
