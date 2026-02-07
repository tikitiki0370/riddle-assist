"use client";
import {
  Box,
  Button,
  Center,
  Clipboard,
  Container,
  Heading,
  HStack,
  Input,
  InputGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { LuCheck, LuCopy, LuDelete, LuSpace, LuTrash2 } from "react-icons/lu";
import FlickInput from "@/components/ui/flickinput/FlickInput";
import GojuonInput from "@/components/ui/gojuoninput/GojuonInput";
import MeshInput from "@/components/ui/meshinput/MeshInput";
import KeyboardInput from "@/components/ui/keyboardinput/KeyboardInput";
import { QWERTY_LAYOUT, JIS_KANA_LAYOUT } from "@/components/ui/keyboardinput/keyboardData";
import { FLICK_KEYS, FLICK_KEYS_EN } from "@/lib/flickInput/keyMapping";

export default function InputPage() {
  const [result, setResult] = useState("");

  const handleInput = useCallback((char: string) => {
    setResult((prev) => prev + char);
  }, []);

  return (
    <Box py={10}>
      <Center pb={10}>
        <Heading>Input Text</Heading>
      </Center>
      <Container w={"60vw"}>
        <VStack gap={6} align="stretch">
          {/* Result - Sticky */}
          <Box
            position="sticky"
            top={0}
            zIndex={10}
            bg="bg"
            py={2}
            mx={-4}
            px={4}
          >
            <Clipboard.Root value={result}>
              <InputGroup
                endElement={
                  <Clipboard.Trigger asChild>
                    <Button variant="ghost" size="sm">
                      <Clipboard.Indicator copied={<LuCheck />}>
                        <LuCopy />
                      </Clipboard.Indicator>
                    </Button>
                  </Clipboard.Trigger>
                }
              >
                <Input
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="入力した文字がここに表示されます..."
                />
              </InputGroup>
            </Clipboard.Root>
            <HStack gap={2} pt={2}>
              <Button variant="outline" onClick={() => setResult((prev) => prev + " ")}>
                <LuSpace /> Space
              </Button>
              <Button variant="outline" onClick={() => setResult((prev) => prev.slice(0, -1))}>
                <LuDelete /> Back
              </Button>
              <Button variant="outline" colorPalette="red" onClick={() => setResult("")}>
                <LuTrash2 /> Clear
              </Button>
            </HStack>
          </Box>

          {/* 五十音表 */}
          <VStack gap={1}>
            <Text fontSize="xs" color="gray.400">50音</Text>
            <GojuonInput onInput={handleInput} />
          </VStack>

          {/* QWERTY */}
          <VStack gap={1}>
            <Text fontSize="xs" color="gray.400">QWERTY</Text>
            <KeyboardInput onInput={handleInput} {...QWERTY_LAYOUT} displayChar={(c) => c.toUpperCase()} />
          </VStack>

          {/* JIS かな */}
          <VStack gap={1}>
            <Text fontSize="xs" color="gray.400">JIS かな</Text>
            <KeyboardInput onInput={handleInput} {...JIS_KANA_LAYOUT} />
          </VStack>

          {/* フリック入力 */}
          <HStack gap={8} justify="center" align="start" flexWrap="wrap">
            <VStack gap={1}>
              <Text fontSize="xs" color="gray.400">日本語</Text>
              <FlickInput onInput={handleInput} keys={FLICK_KEYS} columns={3} />
            </VStack>
            <VStack gap={1}>
              <Text fontSize="xs" color="gray.400">English</Text>
              <FlickInput onInput={handleInput} keys={FLICK_KEYS_EN} columns={3} />
            </VStack>
          </HStack>

          {/* メッシュ暗号入力 */}
          <MeshInput onInput={handleInput} />
        </VStack>
      </Container>
    </Box>
  );
}
