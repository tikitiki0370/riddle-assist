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
const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

function charToNumber(char: string): number | "" {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) return code - 65 + 1;
  if (code >= 97 && code <= 122) return code - 97 + 1;

  const hIdx = HIRAGANA.indexOf(char);
  if (hIdx !== -1) return hIdx + 1;

  const kIdx = KATAKANA.indexOf(char);
  if (kIdx !== -1) return kIdx + 1;

  return "";
}

interface Text2NumberProps {
  target: string;
}

export default function Text2Number({ target }: Text2NumberProps) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    const result = target.split("").map(charToNumber);
    setValue(result.join(" "));
  }, [target]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>文字を数値に</Card.Title>
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
