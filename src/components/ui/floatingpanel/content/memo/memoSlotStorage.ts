const MEMO_SLOTS_KEY = "memo-slots";

export interface MemoSlot {
  slotNumber: number;
  html: string;
}

export function loadMemoSlots(): MemoSlot[] {
  try {
    const raw = localStorage.getItem(MEMO_SLOTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MemoSlot[];
  } catch {
    return [];
  }
}

export function saveMemoSlots(slots: MemoSlot[]): void {
  try {
    localStorage.setItem(MEMO_SLOTS_KEY, JSON.stringify(slots));
  } catch {
    // quota exceeded 等は無視
  }
}

export function findFirstAvailableSlot(openSlotNumbers: number[]): MemoSlot | null {
  const slots = loadMemoSlots();
  // 保存されたスロットのうち、現在開いていない最小番号を返す
  const available = slots
    .filter((s) => !openSlotNumbers.includes(s.slotNumber))
    .sort((a, b) => a.slotNumber - b.slotNumber);
  return available[0] ?? null;
}

export function getNextAvailableSlotNumber(openSlotNumbers: number[]): number {
  const slots = loadMemoSlots();
  const usedNumbers = new Set([
    ...slots.map((s) => s.slotNumber),
    ...openSlotNumbers,
  ]);
  // 1から順に空いている番号を探す
  let n = 1;
  while (usedNumbers.has(n)) {
    n++;
  }
  return n;
}

export function saveMemoSlot(slotNumber: number, html: string): void {
  const slots = loadMemoSlots();
  const idx = slots.findIndex((s) => s.slotNumber === slotNumber);
  if (idx >= 0) {
    slots[idx] = { slotNumber, html };
  } else {
    slots.push({ slotNumber, html });
  }
  saveMemoSlots(slots);
}

export function deleteMemoSlot(slotNumber: number): void {
  const slots = loadMemoSlots();
  const filtered = slots.filter((s) => s.slotNumber !== slotNumber);
  saveMemoSlots(filtered);
}

export function isEmptyHtml(html: string): boolean {
  if (!html || html === "" || html === "<p></p>") return true;
  // brタグを除去し、その後すべてのタグを除去してテキストが空かチェック
  const textContent = html
    .replace(/<br\s*\/?>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
  return textContent === "";
}
