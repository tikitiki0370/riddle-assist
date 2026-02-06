"use client";
import { Card, Clipboard, Input, InputGroup, HStack, NativeSelect } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { morse2Text, morse2TextJa } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

type Lang = "en" | "ja";

interface Morse2TextProps {
  target: string;
  separator: string;
}

export default function Morse2Text({ target, separator: _separator }: Morse2TextProps) {
  const [lang, setLang] = useState<Lang>("en");
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(lang === "en" ? morse2Text(target) : morse2TextJa(target));
  }, [target, lang]);

  return (
    <Card.Root>
      <Card.Header>
        <HStack justify="space-between">
          <Card.Title>モールス → テキスト</Card.Title>
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
