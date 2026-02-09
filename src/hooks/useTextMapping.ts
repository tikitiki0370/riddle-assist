import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const WHITESPACE_RE = /\s/;
const ALPHA_KANA_RE = /[a-zA-Z0-9ぁ-んァ-ヶ]/;

export function useTextMapping() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [encoded, setEncoded] = useState(() => searchParams.get("q") ?? "");
  const [symbolsOnly, setSymbolsOnly] = useState(
    () => searchParams.get("so") === "1",
  );
  const [mappings, setMappings] = useState<Record<string, string>>(() => {
    try {
      const raw = searchParams.get("m");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;
  const isInitialRender = useRef(true);

  // URL sync
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    const params = new URLSearchParams(searchParamsRef.current.toString());

    if (encoded) {
      params.set("q", encoded);
    } else {
      params.delete("q");
    }

    if (symbolsOnly) {
      params.set("so", "1");
    } else {
      params.delete("so");
    }

    const nonEmpty = Object.fromEntries(
      Object.entries(mappings).filter(([, v]) => v !== ""),
    );
    if (Object.keys(nonEmpty).length > 0) {
      params.set("m", JSON.stringify(nonEmpty));
    } else {
      params.delete("m");
    }

    router.replace(`?${params.toString()}`);
  }, [encoded, symbolsOnly, mappings, router]);

  // Unique symbols (order of first appearance, excluding whitespace)
  const uniqueSymbols = useMemo(() => {
    const chars = Array.from(encoded);
    const seen = new Set<string>();
    const result: string[] = [];
    for (const ch of chars) {
      if (WHITESPACE_RE.test(ch)) continue;
      if (symbolsOnly && ALPHA_KANA_RE.test(ch)) continue;
      if (!seen.has(ch)) {
        seen.add(ch);
        result.push(ch);
      }
    }
    return result;
  }, [encoded, symbolsOnly]);

  // Decoded text (single-pass, no recursive substitution)
  const decoded = useMemo(() => {
    return Array.from(encoded)
      .map((ch) => mappings[ch] || ch)
      .join("");
  }, [encoded, mappings]);

  // Unmapped symbols
  const unmappedSymbols = useMemo(() => {
    const set = new Set<string>();
    for (const sym of uniqueSymbols) {
      if (!mappings[sym]) set.add(sym);
    }
    return set;
  }, [uniqueSymbols, mappings]);

  // Duplicate replacement detection
  const duplicateReplacements = useMemo(() => {
    const replacementToSymbols = new Map<string, string[]>();
    for (const sym of uniqueSymbols) {
      const r = mappings[sym];
      if (r) {
        const arr = replacementToSymbols.get(r) ?? [];
        arr.push(sym);
        replacementToSymbols.set(r, arr);
      }
    }
    const duplicates = new Set<string>();
    for (const [, symbols] of replacementToSymbols) {
      if (symbols.length > 1) {
        for (const s of symbols) duplicates.add(s);
      }
    }
    return duplicates;
  }, [uniqueSymbols, mappings]);

  const updateEncoded = useCallback(
    (textOrFn: string | ((prev: string) => string)) => {
      setEncoded(textOrFn);
    },
    [],
  );

  const setMapping = useCallback((symbol: string, replacement: string) => {
    setMappings((prev) => ({ ...prev, [symbol]: replacement }));
  }, []);

  const clearMappings = useCallback(() => {
    setMappings({});
  }, []);

  return {
    encoded,
    updateEncoded,
    mappings,
    setMapping,
    clearMappings,
    symbolsOnly,
    setSymbolsOnly,
    uniqueSymbols,
    decoded,
    unmappedSymbols,
    duplicateReplacements,
  };
}
