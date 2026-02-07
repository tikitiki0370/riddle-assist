"use client";
import { Box, Grid } from "@chakra-ui/react";
import { memo } from "react";

interface BinaryGridProps {
  grid: boolean[][];
  cellSize: number;
}

function BinaryGrid({ grid, cellSize }: BinaryGridProps) {
  if (grid.length === 0) return null;

  const maxCols = Math.max(...grid.map((row) => row.length));

  return (
    <Box overflowX="auto" borderWidth={1} borderColor="gray.300" display="inline-block">
      <Grid
        templateColumns={`repeat(${maxCols}, ${cellSize}px)`}
        templateRows={`repeat(${grid.length}, ${cellSize}px)`}
        gap={0}
      >
        {grid.flatMap((row, rowIdx) =>
          Array.from({ length: maxCols }, (_, colIdx) => {
            const filled = colIdx < row.length ? row[colIdx] : false;
            return (
              <Box
                key={`${rowIdx}-${colIdx}`}
                bg={filled ? "black" : "white"}
              />
            );
          }),
        )}
      </Grid>
    </Box>
  );
}

export default memo(BinaryGrid);
