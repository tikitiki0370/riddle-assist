"use client";
import { Card, Clipboard, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { hiragana2Number } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface Hiragana2NumberProps {
  target: string;
  separator: string;
}

export default function Hiragana2Number({ target, separator }: Hiragana2NumberProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const result = hiragana2Number(target, separator).filter((r) => r !== "");
    setValue(result.join(" "));
  }, [target, separator]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>ひらがなを数値</Card.Title>
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
