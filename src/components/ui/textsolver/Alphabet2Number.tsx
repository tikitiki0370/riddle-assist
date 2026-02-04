"use client";
import { Card, Clipboard, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { alphabet2Number } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface Alphabet2NumberProps {
  target: string;
}

export default function Alphabet2Number({ target }: Alphabet2NumberProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(alphabet2Number(target).join(""));
  }, [target]);

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
