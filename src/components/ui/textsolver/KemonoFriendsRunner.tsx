"use client";
import {
  Card,
  Clipboard,
  IconButton,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  tokenize,
  execute,
  KEMONO_FRIENDS_MAPPING,
} from "@/lib/brainfuckEngine";

interface KemonoFriendsRunnerProps {
  target: string;
}

export default function KemonoFriendsRunner({ target }: KemonoFriendsRunnerProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const ops = tokenize(target, KEMONO_FRIENDS_MAPPING);
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
        <Card.Title>けものフレンズ語 実行結果</Card.Title>
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

const ClipboardIconButton = () => {
  return (
    <Clipboard.Trigger asChild>
      <IconButton variant="surface" size="xs" me="-2">
        <Clipboard.Indicator />
      </IconButton>
    </Clipboard.Trigger>
  );
};
