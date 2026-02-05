import { useCallback, useState } from "react";
import { MappingEntry } from "@/types/mapping";

export function useResultInput() {
  const [result, setResult] = useState("");

  const handleCharClick = useCallback((entry: MappingEntry) => {
    setResult((prev) => prev + entry.output);
  }, []);

  const handleSpace = useCallback(() => {
    setResult((prev) => prev + " ");
  }, []);

  const handleBackspace = useCallback(() => {
    setResult((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setResult("");
  }, []);

  return {
    result,
    setResult,
    handleCharClick,
    handleSpace,
    handleBackspace,
    handleClear,
  };
}
