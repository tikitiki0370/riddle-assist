"use client";
import { Card, Clipboard, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { number2Calendar } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface Number2CalendarProps {
  target: string;
  separator: string;
}

export default function Number2Calendar({ target, separator }: Number2CalendarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const result = number2Calendar(target, separator).filter((r) => r !== "");
    setValue(result.join(" "));
  }, [target, separator]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>数値を月の名前</Card.Title>
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
