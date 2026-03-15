export interface DictionaryInfo {
  id: string;
  name: string;
  wordCount: number;
}

const BATCH_SIZE = 1000;
const MAX_CONCURRENT = 5;

function getApiBase(): string {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1")
    return "http://localhost:8787";
  if (host.endsWith("tikitiki.dev")) return "https://riddle-api.tikitiki.dev";
  if (host.endsWith("tikiserver.com"))
    return "https://riddle-api.tikiserver.com";
  return "";
}

interface ListMatchExactResponse {
  dict: string;
  matched: string[];
  total: number;
}

async function fetchBatch(
  apiBase: string,
  dictId: string,
  words: string[],
  signal?: AbortSignal
): Promise<string[]> {
  const res = await fetch(
    `${apiBase}/api/v1/wordsearch/list-match/exact?dict=${encodeURIComponent(dictId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ words }),
      signal,
    }
  );
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      (body as { error?: string })?.error ?? `API error: ${res.status}`
    );
  }
  const data: ListMatchExactResponse = await res.json();
  return data.matched;
}

export async function fetchDictionaries(): Promise<DictionaryInfo[]> {
  const apiBase = getApiBase();
  const res = await fetch(`${apiBase}/api/v1/wordsearch/dictionaries`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const data: { dictionaries: DictionaryInfo[] } = await res.json();
  return data.dictionaries;
}

export async function listMatchExact(
  dictId: string,
  words: string[],
  signal?: AbortSignal
): Promise<string[]> {
  const apiBase = getApiBase();

  if (words.length <= BATCH_SIZE) {
    return fetchBatch(apiBase, dictId, words, signal);
  }

  const batches: string[][] = [];
  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    batches.push(words.slice(i, i + BATCH_SIZE));
  }

  const matched: string[] = [];
  for (let i = 0; i < batches.length; i += MAX_CONCURRENT) {
    const chunk = batches.slice(i, i + MAX_CONCURRENT);
    const results = await Promise.all(
      chunk.map((batch) => fetchBatch(apiBase, dictId, batch, signal))
    );
    matched.push(...results.flat());
  }

  return matched;
}
