"use client";
import { Card, Clipboard, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { number2Zodiac } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface Number2ZodiacProps {
  target: string;
}

export default function Number2Zodiac({ target }: Number2ZodiacProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(number2Zodiac(target).join(" "));
  }, [target]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>数値を十二支</Card.Title>
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
