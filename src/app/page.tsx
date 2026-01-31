"use client";
import {
  Box,
  Card,
  Center,
  Heading,
  SimpleGrid,
  Input,
  Textarea,
  Container,
} from "@chakra-ui/react";
import Alphabet2Number from "@/components/ui/textsolver/Alphabet2Number";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Number2Alphabet from "@/components/ui/textsolver/Number2Alphabet";
import BrainfuckRunner from "@/components/ui/textsolver/BrainfuckRunner";
import ReplaceToolbar from "@/components/ui/ReplaceToolbar";
import KemonoFriendsRunner from "@/components/ui/textsolver/KemonoFriendsRunner";

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [target, setTarget] = useState(searchParams.get("q") ?? "");

  const handleChange = (value: string) => {
    setTarget(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.replace(`?${params.toString()}`);
  };
  return (
    <Box>
      <Center py={10}>
        <Heading>謎解きツール</Heading>
      </Center>
      <Container w={"60vw"}>
        <Box pb={2}>
          <ReplaceToolbar text={target} onReplace={handleChange} />
        </Box>
        <Textarea
          placeholder="Enter text"
          value={target}
          onChange={(e) => handleChange(e.target.value)}
          minH="200px"
        ></Textarea>
        <Box pt={10}>
          <Center>
            <SimpleGrid w={"60vw"} columns={2} columnGap={10} rowGap={10} >
              <Alphabet2Number target={target} />
              <Number2Alphabet target={target} />
              <BrainfuckRunner target={target} />
              <KemonoFriendsRunner target={target} />
            </SimpleGrid>
          </Center>
        </Box>
      </Container>
    </Box>
  );
}
