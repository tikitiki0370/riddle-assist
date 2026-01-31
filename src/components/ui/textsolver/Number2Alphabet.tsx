"use client";
import {
  Card,
  Clipboard,
  IconButton,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Number2AlphabetProps {
  target: string;
}

export default function Number2Alphabet({ target }: Number2AlphabetProps) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    const result = target.split("").map((char) => {
      const num = parseInt(char, 10);
      if (num >= 1 && num <= 26) {
        return String.fromCharCode(num + 96);
      }
      return "";
    });
    setValue(result.join(""));
  }, [target]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>数値をアルファベットに変換</Card.Title>
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

const ClipboardIconButton = () => {
  return (
    <Clipboard.Trigger asChild>
      <IconButton variant="surface" size="xs" me="-2">
        <Clipboard.Indicator />
      </IconButton>
    </Clipboard.Trigger>
  );
};
