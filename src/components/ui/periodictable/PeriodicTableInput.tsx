"use client";
import { Box, Center, Grid, Text, VStack } from "@chakra-ui/react";
import {
  PERIODIC_TABLE_MAIN,
  PERIODIC_TABLE_EXTRA,
  ATOMIC_NUMBERS,
} from "./periodicTableData";

interface PeriodicTableInputProps {
  onInput: (char: string) => void;
}

function ElementCell({
  symbol,
  onClick,
}: {
  symbol: string;
  onClick: () => void;
}) {
  return (
    <Box
      borderWidth={1}
      borderRadius="md"
      cursor="pointer"
      userSelect="none"
      p={0.5}
      _hover={{ bg: { base: "gray.50", _dark: "gray.700" } }}
      _active={{ bg: { base: "blue.50", _dark: "blue.900" } }}
      onClick={onClick}
    >
      <Text fontSize="2xs" color="gray.400" lineHeight={1}>
        {ATOMIC_NUMBERS[symbol]}
      </Text>
      <Center>
        <Text fontSize="xs" fontWeight="medium" lineHeight={1}>
          {symbol}
        </Text>
      </Center>
    </Box>
  );
}

export default function PeriodicTableInput({
  onInput,
}: PeriodicTableInputProps) {
  const renderGrid = (rows: (string | null)[][], keyPrefix: string) => (
    <Grid templateColumns="repeat(18, 1fr)" gap={0.5} w="100%">
      {rows.flat().map((symbol, index) =>
        symbol !== null ? (
          <ElementCell
            key={`${keyPrefix}-${symbol}`}
            symbol={symbol}
            onClick={() => onInput(symbol)}
          />
        ) : (
          <Box key={`${keyPrefix}-empty-${index}`} />
        )
      )}
    </Grid>
  );

  return (
    <VStack gap={2} w="100%">
      {renderGrid(PERIODIC_TABLE_MAIN, "main")}
      {renderGrid(PERIODIC_TABLE_EXTRA, "extra")}
    </VStack>
  );
}
