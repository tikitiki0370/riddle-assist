"use client";
import { Card, Clipboard, Input, InputGroup, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { tokenize, execute, BRAINFUCK_MAPPING } from "@/lib/solverEngine";
import { ClipboardIconButton } from "./ClipboardIconButton";

interface BrainfuckRunnerProps {
  target: string;
  separator: string;
}

export default function BrainfuckRunner({ target, separator: _separator }: BrainfuckRunnerProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const ops = tokenize(target, BRAINFUCK_MAPPING);
    const result = execute(ops);
    if (result.startsWith("Error:")) {
      setError(result);
      setValue("");
    } else {
      setError("");
      setValue(result);
    }
  }, [target]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Brainfuck 実行結果</Card.Title>
      </Card.Header>
      <Card.Body>
        {error ? (
          <Text color="red.500">{error}</Text>
        ) : (
          <Clipboard.Root value={value}>
            <InputGroup endElement={<ClipboardIconButton />}>
              <Clipboard.Input asChild>
                <Input />
              </Clipboard.Input>
            </InputGroup>
          </Clipboard.Root>
        )}
      </Card.Body>
    </Card.Root>
  );
}
