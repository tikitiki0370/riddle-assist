"use client";
import { Card, Clipboard, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { starSign2Number } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface StarSign2NumberProps {
  target: string;
  separator: string;
}

export default function StarSign2Number({ target, separator }: StarSign2NumberProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const result = starSign2Number(target, separator).filter((r) => r !== "");
    setValue(result.join(" "));
  }, [target, separator]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>星座を数値</Card.Title>
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
