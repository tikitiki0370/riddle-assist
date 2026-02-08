import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TranslateEntry } from "@/types/translate";

export type CaseMode = "lower" | "upper";

export function useResultInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState(searchParams.get("q") ?? "");
  const [caseMode, setCaseModeState] = useState<CaseMode>("upper");

  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (result) {
      params.set("q", result);
    } else {
      params.delete("q");
    }
    router.replace(`?${params.toString()}`);
  }, [result, router]);

  const handleCharClick = useCallback((entry: TranslateEntry) => {
    const char = caseMode === "lower"
      ? entry.output.toLowerCase()
      : entry.output.toUpperCase();
    setResult((prev) => prev + char);
  }, [caseMode]);

  const handleSpace = useCallback(() => {
    setResult((prev) => prev + " ");
  }, []);

  const handleBackspace = useCallback(() => {
    setResult((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setResult("");
  }, []);

  const setCaseMode = useCallback((mode: CaseMode) => {
    setCaseModeState(mode);
    setResult((prev) =>
      mode === "lower" ? prev.toLowerCase() : prev.toUpperCase()
    );
  }, []);

  return {
    result,
    setResult,
    handleCharClick,
    handleSpace,
    handleBackspace,
    handleClear,
    caseMode,
    setCaseMode,
  };
}
