import { solveMagicSquare } from ".";

self.onmessage = (
  e: MessageEvent<{
    n: number;
    prefilled: (number | null)[];
    maxSolutions?: number;
  }>,
) => {
  const { n, prefilled, maxSolutions } = e.data;
  const result = solveMagicSquare(n, prefilled, maxSolutions);
  self.postMessage(result);
};
