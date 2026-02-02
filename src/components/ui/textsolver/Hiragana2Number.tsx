"use client";
import {
  Card,
  Clipboard,
  IconButton,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const HIRAGANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";

interface Hiragana2NumberProps {
  target: string;
}

export default function Hiragana2Number({ target }: Hiragana2NumberProps) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    const result = target.split("").map((char) => {
      const idx = HIRAGANA.indexOf(char);
      if (idx !== -1) return idx + 1;
      return "";
    });
    setValue(result.join(" "));
  }, [target]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>ひらがなを数値</Card.Title>
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
