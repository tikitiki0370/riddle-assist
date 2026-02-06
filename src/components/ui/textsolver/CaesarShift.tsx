"use client";
import { Card, Clipboard, Input, InputGroup, HStack, NumberInput } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { caesarShift } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface CaesarShiftProps {
  target: string;
  separator: string;
}

export default function CaesarShift({ target, separator: _separator }: CaesarShiftProps) {
  const [shift, setShift] = useState(1);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(caesarShift(target, shift));
  }, [target, shift]);

  return (
    <Card.Root>
      <Card.Header>
        <HStack justify="space-between">
          <Card.Title>シーザー暗号</Card.Title>
          <NumberInput.Root
            size="sm"
            width="80px"
            value={String(shift)}
            onValueChange={(e) => setShift(Number(e.value) || 0)}
            min={-25}
            max={25}
          >
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
            <NumberInput.Input />
          </NumberInput.Root>
        </HStack>
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
