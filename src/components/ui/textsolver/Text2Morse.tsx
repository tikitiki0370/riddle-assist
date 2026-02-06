"use client";
import { Card, Clipboard, Input, InputGroup, HStack, NativeSelect } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { text2Morse, text2MorseJa } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

type Lang = "en" | "ja";

interface Text2MorseProps {
  target: string;
  separator: string;
}

export default function Text2Morse({ target, separator: _separator }: Text2MorseProps) {
  const [lang, setLang] = useState<Lang>("en");
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(lang === "en" ? text2Morse(target) : text2MorseJa(target));
  }, [target, lang]);

  return (
    <Card.Root>
      <Card.Header>
        <HStack justify="space-between">
          <Card.Title>テキスト → モールス</Card.Title>
          <NativeSelect.Root size="sm" width="80px">
            <NativeSelect.Field
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
            >
              <option value="en">英文</option>
              <option value="ja">和文</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </HStack>
      </Card.Header>
      <Card.Body>
        <Clipboard.Root value={value}>
          <InputGroup endElement={<ClipboardIconButton />}>
            <Clipboard.Input asChild>
              <Input />
            </Clipboard.Input>
          </InputGroup>
        </Clipboard.Root>
      </Card.Body>
    </Card.Root>
  );
}
