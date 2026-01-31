"use client";
import { HStack, Input, Button } from "@chakra-ui/react";
import { useState } from "react";

interface ReplaceToolbarProps {
  text: string;
  onReplace: (newText: string) => void;
}

export default function ReplaceToolbar({ text, onReplace }: ReplaceToolbarProps) {
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");

  const handleReplace = () => {
    onReplace(text.replaceAll(search, replace));
  };

  return (
    <HStack>
      <Input
        placeholder="検索文字列"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Input
        placeholder="置換文字列"
        value={replace}
        onChange={(e) => setReplace(e.target.value)}
      />
      <Button variant="outline" disabled={search === ""} onClick={handleReplace}>
        置換
      </Button>
    </HStack>
  );
}
