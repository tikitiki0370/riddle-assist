"use client";
import {
  Box,
  Center,
  Container,
  Heading,
  SegmentGroup,
  VStack,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";

const solverTypes = [
  { value: "magic", label: "魔法陣" },
  { value: "crossword", label: "クロスワード" },
] as const;

export default function SolverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const activeSegment =
    solverTypes.find((s) => pathname.endsWith(s.value))?.value ??
    "magic";

  return (
    <Box py={10}>
      <Center pb={10}>
        <Heading>Solver</Heading>
      </Center>
      <Container w="60vw">
        <VStack gap={6} align="stretch">
          <SegmentGroup.Root
            value={activeSegment}
            onValueChange={(e) => router.push(`/solver/${e.value}`)}
          >
            <SegmentGroup.Indicator />
            {solverTypes.map((s) => (
              <SegmentGroup.Item key={s.value} value={s.value}>
                <SegmentGroup.ItemText>{s.label}</SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            ))}
          </SegmentGroup.Root>

          {children}
        </VStack>
      </Container>
    </Box>
  );
}
