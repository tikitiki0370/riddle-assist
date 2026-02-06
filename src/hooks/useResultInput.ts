import { useCallback, useState } from "react";
import { MappingEntry } from "@/types/mapping";

export type CaseMode = "lower" | "upper";

export function useResultInput() {
  const [result, setResult] = useState("");
  const [caseMode, setCaseModeState] = useState<CaseMode>("upper");

  const handleCharClick = useCallback((entry: MappingEntry) => {
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
