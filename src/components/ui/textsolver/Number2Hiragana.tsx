"use client";
import {
  Card,
  Clipboard,
  IconButton,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const HIRAGANA = [
  "あ", "い", "う", "え", "お",
  "か", "き", "く", "け", "こ",
  "さ", "し", "す", "せ", "そ",
  "た", "ち", "つ", "て", "と",
  "な", "に", "ぬ", "ね", "の",
  "は", "ひ", "ふ", "へ", "ほ",
  "ま", "み", "む", "め", "も",
  "や", "ゆ", "よ",
  "ら", "り", "る", "れ", "ろ",
  "わ", "を", "ん",
];

interface Number2HiraganaProps {
  target: string;
}

export default function Number2Hiragana({ target }: Number2HiraganaProps) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    const result = target.split("").map((char) => {
      const num = parseInt(char, 10);
      if (num >= 1 && num <= HIRAGANA.length) {
        return HIRAGANA[num - 1];
      }
      return "";
    });
    setValue(result.join(" "));
  }, [target]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>数値をひらがな</Card.Title>
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
