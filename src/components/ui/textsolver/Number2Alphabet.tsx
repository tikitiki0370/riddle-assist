"use client";
import { Card, Clipboard, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { number2Alphabet } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface Number2AlphabetProps {
  target: string;
}

export default function Number2Alphabet({ target }: Number2AlphabetProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(number2Alphabet(target).join(" "));
  }, [target]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>数値をアルファベット</Card.Title>
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
