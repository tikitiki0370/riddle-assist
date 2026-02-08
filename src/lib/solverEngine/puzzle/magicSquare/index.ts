export interface MagicSquareResult {
  solutions: number[][];
  exhausted: boolean;
}

const DEFAULT_MAX_SOLUTIONS = 10000;

export function solveMagicSquare(
  n: number,
  prefilled: (number | null)[],
  maxSolutions: number = DEFAULT_MAX_SOLUTIONS,
): MagicSquareResult {
  const total = n * n;
  const magic = (n * (total + 1)) / 2;

  // Validate prefilled
  const used = new Set<number>();
  const grid = new Array<number>(total).fill(0);
  const emptyCells: number[] = [];

  for (let i = 0; i < total; i++) {
    const v = prefilled[i];
    if (v != null) {
      if (v < 1 || v > total || used.has(v)) {
        return { solutions: [], exhausted: true };
      }
      used.add(v);
      grid[i] = v;
    } else {
      emptyCells.push(i);
    }
  }

  // Available numbers sorted ascending
  const available: number[] = [];
  for (let v = 1; v <= total; v++) {
    if (!used.has(v)) available.push(v);
  }

  // Precompute row/col for each cell
  const rowOf = (idx: number) => Math.floor(idx / n);
  const colOf = (idx: number) => idx % n;

  // Precompute row sums, col sums, diag sums from prefilled
  const rowSum = new Array<number>(n).fill(0);
  const colSum = new Array<number>(n).fill(0);
  let diagSum1 = 0; // top-left to bottom-right
  let diagSum2 = 0; // top-right to bottom-left
  const rowCount = new Array<number>(n).fill(0); // filled count per row
  const colCount = new Array<number>(n).fill(0);
  let diagCount1 = 0;
  let diagCount2 = 0;

  for (let i = 0; i < total; i++) {
    if (prefilled[i] != null) {
      const r = rowOf(i);
      const c = colOf(i);
      rowSum[r] += grid[i];
      colSum[c] += grid[i];
      rowCount[r]++;
      colCount[c]++;
      if (r === c) {
        diagSum1 += grid[i];
        diagCount1++;
      }
      if (r + c === n - 1) {
        diagSum2 += grid[i];
        diagCount2++;
      }
    }
  }

  const solutions: number[][] = [];
  const availableUsed = new Array<boolean>(available.length).fill(false);

  function backtrack(emptyIdx: number): boolean {
    if (solutions.length >= maxSolutions) return true;

    if (emptyIdx === emptyCells.length) {
      solutions.push([...grid]);
      return solutions.length >= maxSolutions;
    }

    const cellIdx = emptyCells[emptyIdx];
    const r = rowOf(cellIdx);
    const c = colOf(cellIdx);
    const isOnDiag1 = r === c;
    const isOnDiag2 = r + c === n - 1;

    const filledInRowAfter = rowCount[r] + 1;
    const filledInColAfter = colCount[c] + 1;
    const filledInDiag1After = isOnDiag1 ? diagCount1 + 1 : 0;
    const filledInDiag2After = isOnDiag2 ? diagCount2 + 1 : 0;

    for (let ai = 0; ai < available.length; ai++) {
      if (availableUsed[ai]) continue;
      const v = available[ai];

      const newRowSum = rowSum[r] + v;
      const newColSum = colSum[c] + v;

      // Row pruning
      if (newRowSum > magic) continue;
      if (filledInRowAfter === n && newRowSum !== magic) continue;

      // Col pruning
      if (newColSum > magic) continue;
      if (filledInColAfter === n && newColSum !== magic) continue;

      // Diagonal pruning
      if (isOnDiag1) {
        const newDiag = diagSum1 + v;
        if (newDiag > magic) continue;
        if (filledInDiag1After === n && newDiag !== magic) continue;
      }
      if (isOnDiag2) {
        const newDiag = diagSum2 + v;
        if (newDiag > magic) continue;
        if (filledInDiag2After === n && newDiag !== magic) continue;
      }

      // Place
      grid[cellIdx] = v;
      availableUsed[ai] = true;
      rowSum[r] = newRowSum;
      colSum[c] = newColSum;
      rowCount[r]++;
      colCount[c]++;
      if (isOnDiag1) { diagSum1 += v; diagCount1++; }
      if (isOnDiag2) { diagSum2 += v; diagCount2++; }

      if (backtrack(emptyIdx + 1)) return true;

      // Undo
      grid[cellIdx] = 0;
      availableUsed[ai] = false;
      rowSum[r] -= v;
      colSum[c] -= v;
      rowCount[r]--;
      colCount[c]--;
      if (isOnDiag1) { diagSum1 -= v; diagCount1--; }
      if (isOnDiag2) { diagSum2 -= v; diagCount2--; }
    }

    return false;
  }

  backtrack(0);

  return {
    solutions,
    exhausted: solutions.length < maxSolutions,
  };
}
