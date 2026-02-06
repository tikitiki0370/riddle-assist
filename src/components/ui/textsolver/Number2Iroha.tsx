"use client";
import { Card, Clipboard, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { number2Iroha } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface Number2IrohaProps {
  target: string;
  separator: string;
}

export default function Number2Iroha({ target, separator }: Number2IrohaProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const result = number2Iroha(target, separator).filter((r) => r !== "");
    setValue(result.join(" "));
  }, [target, separator]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>数値をいろは順</Card.Title>
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
