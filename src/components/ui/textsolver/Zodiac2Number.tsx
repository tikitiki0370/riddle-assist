"use client";
import { Card, Clipboard, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { zodiac2Number } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface Zodiac2NumberProps {
  target: string;
  separator: string;
}

export default function Zodiac2Number({ target, separator }: Zodiac2NumberProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const result = zodiac2Number(target, separator).filter((r) => r !== "");
    setValue(result.join(" "));
  }, [target, separator]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>十二支を数値</Card.Title>
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
