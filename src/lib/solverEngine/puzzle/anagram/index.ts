export function generateAnagrams(input: string): string[] {
  if (input.length === 0) return [];

  const results: Set<string> = new Set();
  const chars = [...input];
  const used = new Array(chars.length).fill(false);

  function backtrack(current: string) {
    if (current.length === chars.length) {
      results.add(current);
      return;
    }
    for (let i = 0; i < chars.length; i++) {
      if (used[i]) continue;
      if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      backtrack(current + chars[i]);
      used[i] = false;
    }
  }

  chars.sort();
  backtrack("");
  return [...results];
}
