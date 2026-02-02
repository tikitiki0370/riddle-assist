"use client";
import {
  Box,
  Button,
  Center,
  ClientOnly,
  Heading,
  SimpleGrid,
  Textarea,
  Container,
} from "@chakra-ui/react";
import Text2Number from "@/components/ui/textsolver/Text2Number";
import { ComponentType, Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Number2Alphabet from "@/components/ui/textsolver/Number2Alphabet";
import BrainfuckRunner from "@/components/ui/textsolver/BrainfuckRunner";
import ReplaceToolbar from "@/components/ui/ReplaceToolbar";
import KemonoFriendsRunner from "@/components/ui/textsolver/KemonoFriendsRunner";
import Number2Hiragana from "@/components/ui/textsolver/Number2Hiragana";
import Alphabet2Number from "@/components/ui/textsolver/Alphabet2Number";
import Hiragana2Number from "@/components/ui/textsolver/Hiragana2Number";
import { LuPlus } from "react-icons/lu";
import SolverSelectDialog from "@/components/ui/textsolver/SolverSelectDialog";

interface SolverDef {
  id: string;
  label: string;
  component: ComponentType<{ target: string }>;
}

const SOLVER_COMPONENTS: SolverDef[] = [
  { id: "text2number", label: "文字を数値に", component: Text2Number },
  { id: "number2alphabet", label: "数値をアルファベット", component: Number2Alphabet },
  { id: "number2hiragana", label: "数値をひらがな", component: Number2Hiragana },
  { id: "alphabet2number", label: "アルファベットを数値", component: Alphabet2Number },
  { id: "hiragana2number", label: "ひらがなを数値", component: Hiragana2Number },
  { id: "brainfuck", label: "Brainfuck", component: BrainfuckRunner },
  { id: "kemono", label: "けものフレンズ(Brainfuck)", component: KemonoFriendsRunner },
];

const DEFAULT_VISIBLE = new Set([
  "text2number", "number2alphabet", "number2hiragana",
]);

const STORAGE_KEY = "riddle-assist-visible-solvers";

function loadVisible(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw) as string[];
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch { /* ignore */ }
  return new Set(DEFAULT_VISIBLE);
}

function saveVisible(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
}

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
  const [visibleSet, setVisibleSet] = useState<Set<string>>(DEFAULT_VISIBLE);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setVisibleSet(loadVisible());
  }, []);

  const toggle = useCallback((id: string, checked: boolean) => {
    setVisibleSet((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      saveVisible(next);
      return next;
    });
  }, []);

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
    <Box py={10}>
      <Center pb={10}>
        <Heading>文字列変換</Heading>
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
        />
        <Box pt={4}>
          <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
            <LuPlus /> ツールを追加
          </Button>
        </Box>
        <Box pt={6}>
          <Center>
            <ClientOnly>
              <SimpleGrid w={"60vw"} columns={2} columnGap={10} rowGap={10}>
                {SOLVER_COMPONENTS.filter(({ id }) => visibleSet.has(id)).map(
                  ({ id, component: Comp }) => (
                    <Comp key={id} target={target} />
                  )
                )}
              </SimpleGrid>
            </ClientOnly>
          </Center>
        </Box>
      </Container>

      <SolverSelectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        solvers={SOLVER_COMPONENTS}
        visibleSet={visibleSet}
        onToggle={toggle}
      />
    </Box>
  );
}
