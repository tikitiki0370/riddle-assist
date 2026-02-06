"use client";
import { Card, Clipboard, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { alphabet2Number } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface Alphabet2NumberProps {
  target: string;
  separator: string;
}

export default function Alphabet2Number({ target, separator }: Alphabet2NumberProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const result = alphabet2Number(target, separator).filter((r) => r !== "");
    setValue(result.join(" "));
  }, [target, separator]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>アルファベットを数値</Card.Title>
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
