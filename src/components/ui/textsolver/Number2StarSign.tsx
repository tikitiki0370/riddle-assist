"use client";
import { Card, Clipboard, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { number2StarSign } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface Number2StarSignProps {
  target: string;
  separator: string;
}

export default function Number2StarSign({ target, separator }: Number2StarSignProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const result = number2StarSign(target, separator).filter((r) => r !== "");
    setValue(result.join(" "));
  }, [target, separator]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>数値を星座</Card.Title>
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
