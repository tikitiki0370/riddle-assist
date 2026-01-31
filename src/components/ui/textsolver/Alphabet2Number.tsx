"use client";
import {
  Card,
  Clipboard,
  IconButton,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Alphabet2NumberProps {
  target: string;
}

export default function Alphabet2Number({ target }: Alphabet2NumberProps) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    const result = target.split("").map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return code - 65 + 1;
      }
      if (code >= 97 && code <= 122) {
        return code - 97 + 1;
      }
      return 0;
    });
    setValue(result.join(""));
  }, [target]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>アルファベットを数値に変換</Card.Title>
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
