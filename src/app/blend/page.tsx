"use client";

import {
  Box,
  Center,
  Heading,
  HStack,
  IconButton,
  Input,
  Switch,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { LuGripVertical, LuSearch, LuTrash2 } from "react-icons/lu";
import {
  alphabet2Number,
  number2Alphabet,
  hiragana2Number,
  number2Hiragana,
  iroha2Number,
  number2Iroha,
  zodiac2Number,
  number2Zodiac,
  starSign2Number,
  number2StarSign,
  calendar2Number,
  number2Calendar,
  musicalScale2Number,
  number2MusicalScale,
  rainbow2Number,
  number2Rainbow,
  text2Morse,
  text2MorseJa,
  morse2Text,
  morse2TextJa,
  caesarShift,
} from "@/lib/solverEngine";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ------------------------------------------------------------------ */
/*  オペレーション定義                                                  */
/* ------------------------------------------------------------------ */

interface OperationParam {
  key: string;
  label: string;
  type: "number" | "textarea";
  default: number | string;
  min?: number;
  max?: number;
}

interface OperationDef {
  id: string;
  name: string;
  category: string;
  params?: OperationParam[];
  fn: (input: string, params: Record<string, number | string>) => string;
}

const OPERATIONS: OperationDef[] = [
  // 入出力
  {
    id: "input",
    name: "入力",
    category: "入出力",
    params: [{ key: "text", label: "", type: "textarea", default: "" }],
    fn: (_s, p) => String(p.text ?? ""),
  },
  {
    id: "output",
    name: "出力",
    category: "入出力",
    fn: (s) => s,
  },

  // 進数変換
  {
    id: "dec2base",
    name: "10進数 → N進数",
    category: "進数変換",
    params: [{ key: "base", label: "基数", type: "number", default: 2, min: 2, max: 36 }],
    fn: (s, p) => {
      const base = (p.base as number) ?? 2;
      return s.trim().split(/\s+/).map((t) => {
        const n = parseInt(t, 10);
        return isNaN(n) ? t : n.toString(base);
      }).join(" ");
    },
  },
  {
    id: "base2dec",
    name: "N進数 → 10進数",
    category: "進数変換",
    params: [{ key: "base", label: "基数", type: "number", default: 2, min: 2, max: 36 }],
    fn: (s, p) => {
      const base = (p.base as number) ?? 2;
      return s.trim().split(/\s+/).map((t) => {
        const n = parseInt(t, base);
        return isNaN(n) ? t : n.toString(10);
      }).join(" ");
    },
  },

  // テキスト
  { id: "reverse", name: "反転", category: "テキスト", fn: (s) => [...s].reverse().join("") },
  { id: "to-upper", name: "大文字変換", category: "テキスト", fn: (s) => s.toUpperCase() },
  { id: "to-lower", name: "小文字変換", category: "テキスト", fn: (s) => s.toLowerCase() },
  { id: "trim", name: "トリム", category: "テキスト", fn: (s) => s.split("\n").map((l) => l.trim()).join("\n") },
  { id: "sort-lines", name: "行ソート", category: "テキスト", fn: (s) => s.split("\n").sort().join("\n") },
  { id: "unique-lines", name: "重複行削除", category: "テキスト", fn: (s) => [...new Set(s.split("\n"))].join("\n") },
  { id: "remove-whitespace", name: "空白除去", category: "テキスト", fn: (s) => s.replace(/\s+/g, "") },

  // 暗号
  {
    id: "atbash",
    name: "アトバシュ暗号",
    category: "暗号",
    fn: (s) => s.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(base + 25 - (c.charCodeAt(0) - base));
    }),
  },
  { id: "char-code", name: "文字 → コードポイント", category: "変換", fn: (s) => [...s].map((c) => c.codePointAt(0)).join(" ") },
  {
    id: "code-char",
    name: "コードポイント → 文字",
    category: "変換",
    fn: (s) => {
      try { return s.trim().split(/\s+/).map((n) => String.fromCodePoint(parseInt(n, 10))).join(""); }
      catch { return "[変換エラー]"; }
    },
  },

  // solverEngine: アルファベット
  { id: "alpha2num", name: "アルファベット → 数字", category: "文字変換", fn: (s) => alphabet2Number(s, "").join(" ") },
  { id: "num2alpha", name: "数字 → アルファベット", category: "文字変換", fn: (s) => number2Alphabet(s, " ").join("") },

  // solverEngine: かな
  { id: "hira2num", name: "ひらがな → 数字", category: "文字変換", fn: (s) => hiragana2Number(s, "").join(" ") },
  { id: "num2hira", name: "数字 → ひらがな", category: "文字変換", fn: (s) => number2Hiragana(s, " ").join("") },
  { id: "iroha2num", name: "いろは → 数字", category: "文字変換", fn: (s) => iroha2Number(s, "").join(" ") },
  { id: "num2iroha", name: "数字 → いろは", category: "文字変換", fn: (s) => number2Iroha(s, " ").join("") },

  // solverEngine: トークン
  { id: "zodiac2num", name: "干支 → 数字", category: "トークン変換", fn: (s) => zodiac2Number(s, "").join(" ") },
  { id: "num2zodiac", name: "数字 → 干支", category: "トークン変換", fn: (s) => number2Zodiac(s, " ").join("") },
  { id: "star2num", name: "星座 → 数字", category: "トークン変換", fn: (s) => starSign2Number(s, "").join(" ") },
  { id: "num2star", name: "数字 → 星座", category: "トークン変換", fn: (s) => number2StarSign(s, " ").join("") },
  { id: "cal2num", name: "月 → 数字", category: "トークン変換", fn: (s) => calendar2Number(s, "").join(" ") },
  { id: "num2cal", name: "数字 → 月", category: "トークン変換", fn: (s) => number2Calendar(s, " ").join("") },
  { id: "scale2num", name: "音階 → 数字", category: "トークン変換", fn: (s) => musicalScale2Number(s, "").join(" ") },
  { id: "num2scale", name: "数字 → 音階", category: "トークン変換", fn: (s) => number2MusicalScale(s, " ").join("") },
  { id: "rainbow2num", name: "虹色 → 数字", category: "トークン変換", fn: (s) => rainbow2Number(s, "").join(" ") },
  { id: "num2rainbow", name: "数字 → 虹色", category: "トークン変換", fn: (s) => number2Rainbow(s, " ").join("") },

  // solverEngine: モールス
  { id: "text2morse", name: "テキスト → モールス", category: "モールス", fn: (s) => text2Morse(s) },
  { id: "text2morse-ja", name: "テキスト → モールス(和文)", category: "モールス", fn: (s) => text2MorseJa(s) },
  { id: "morse2text", name: "モールス → テキスト", category: "モールス", fn: (s) => morse2Text(s) },
  { id: "morse2text-ja", name: "モールス → テキスト(和文)", category: "モールス", fn: (s) => morse2TextJa(s) },

  // solverEngine: シーザー
  {
    id: "caesar",
    name: "シーザー暗号",
    category: "暗号",
    params: [{ key: "n", label: "シフト", type: "number", default: 3, min: -25, max: 25 }],
    fn: (s, p) => caesarShift(s, (p.n as number) ?? 3),
  },
];

const OP_MAP = new Map(OPERATIONS.map((op) => [op.id, op]));
const FIXED_OPS = new Set(["input", "output"]);

/* ------------------------------------------------------------------ */
/*  レシピステップ型                                                    */
/* ------------------------------------------------------------------ */

interface RecipeStep {
  instanceId: number;
  operationId: string;
  params: Record<string, number | string>;
  enabled: boolean;
}

let _nextId = 0;
const nextId = () => ++_nextId;

function createStep(operationId: string): RecipeStep {
  const op = OP_MAP.get(operationId)!;
  const params: Record<string, number | string> = {};
  op.params?.forEach((p) => { params[p.key] = p.default; });
  return { instanceId: nextId(), operationId, params, enabled: true };
}

/* ------------------------------------------------------------------ */
/*  操作カタログアイテム（ドラッグ元）                                    */
/* ------------------------------------------------------------------ */

function DraggableOperation({ op }: { op: OperationDef }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `op-${op.id}`,
    data: { type: "operation", operationId: op.id },
  });

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      px={3}
      py={1.5}
      borderWidth="1px"
      borderRadius="md"
      fontSize="sm"
      cursor="grab"
      opacity={isDragging ? 0.4 : 1}
      _hover={{ bg: "bg.subtle" }}
      userSelect="none"
    >
      {op.name}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  ステップ行（固定・ソート可能 共通）                                   */
/* ------------------------------------------------------------------ */

function StepRow({
  step,
  pipelineValue,
  fixed,
  sortableProps,
  onToggle,
  onRemove,
  onParamChange,
}: {
  step: RecipeStep;
  pipelineValue?: string;
  fixed: boolean;
  sortableProps?: {
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    attributes: Record<string, unknown>;
    listeners: Record<string, unknown> | undefined;
  };
  onToggle: () => void;
  onRemove: () => void;
  onParamChange: (key: string, value: number | string) => void;
}) {
  const op = OP_MAP.get(step.operationId)!;
  const isOutput = step.operationId === "output";

  return (
    <VStack
      ref={sortableProps?.setNodeRef}
      style={sortableProps?.style}
      align="stretch"
      gap={1}
      px={3}
      py={2}
      borderWidth="1px"
      borderRadius="md"
      opacity={step.enabled ? 1 : 0.45}
    >
      <HStack gap={2}>
        {!fixed && (
          <Box
            {...sortableProps?.attributes}
            {...sortableProps?.listeners}
            cursor="grab"
            color="fg.muted"
            _hover={{ color: "fg" }}
            display="flex"
            alignItems="center"
          >
            <LuGripVertical />
          </Box>
        )}

        {!fixed && (
          <Switch.Root size="sm" checked={step.enabled} onCheckedChange={onToggle}>
            <Switch.HiddenInput />
            <Switch.Control><Switch.Thumb /></Switch.Control>
          </Switch.Root>
        )}

        <Text fontSize="sm" fontWeight="medium" flex="1" minW="0">
          {op.name}
        </Text>

        {op.params?.filter((p) => p.type === "number").map((p) => (
          <HStack key={p.key} gap={1}>
            <Text fontSize="xs" color="fg.muted">{p.label}</Text>
            <input
              type="number"
              value={(step.params[p.key] as number) ?? p.default}
              min={p.min}
              max={p.max}
              onChange={(e) => onParamChange(p.key, Number(e.target.value))}
              style={{
                width: "50px", fontSize: "12px", padding: "2px 4px",
                borderRadius: "4px", border: "1px solid var(--chakra-colors-border)",
                background: "transparent", color: "inherit",
              }}
            />
          </HStack>
        ))}

        {!fixed && (
          <IconButton
            aria-label="削除"
            variant="ghost"
            size="xs"
            colorPalette="red"
            onClick={onRemove}
          >
            <LuTrash2 />
          </IconButton>
        )}
      </HStack>

      {/* textarea param（入力ステップ） */}
      {op.params?.filter((p) => p.type === "textarea").map((p) => (
        <Textarea
          key={p.key}
          value={String(step.params[p.key] ?? "")}
          onChange={(e) => onParamChange(p.key, e.target.value)}
          placeholder="テキストを入力..."
          fontFamily="monospace"
          fontSize="sm"
          rows={3}
          resize="vertical"
        />
      ))}

      {/* 出力ステップ: パイプライン結果表示 */}
      {isOutput && pipelineValue !== undefined && (
        <Textarea
          value={pipelineValue}
          readOnly
          fontFamily="monospace"
          fontSize="sm"
          rows={3}
          resize="vertical"
        />
      )}
    </VStack>
  );
}

/* sortable wrapper */
function SortableStepRow(props: Omit<React.ComponentProps<typeof StepRow>, "sortableProps" | "fixed">) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.step.instanceId,
    data: { type: "recipe-step" },
  });

  return (
    <StepRow
      {...props}
      fixed={false}
      sortableProps={{
        setNodeRef,
        style: {
          transform: CSS.Transform.toString(transform),
          transition,
          zIndex: isDragging ? 10 : undefined,
          opacity: isDragging ? 0.4 : undefined,
        },
        attributes: attributes as unknown as Record<string, unknown>,
        listeners: listeners as unknown as Record<string, unknown> | undefined,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  ゴーストステップ（挿入位置インジケーター）                              */
/* ------------------------------------------------------------------ */

function GhostStep({ name }: { name: string }) {
  return (
    <HStack
      px={3}
      py={2}
      borderWidth="1px"
      borderStyle="dashed"
      borderRadius="md"
      opacity={0.3}
    >
      <Text fontSize="sm" fontWeight="medium">{name}</Text>
    </HStack>
  );
}

/* ------------------------------------------------------------------ */
/*  レシピドロップゾーン                                                 */
/* ------------------------------------------------------------------ */

function RecipeDropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: "recipe-drop-zone",
    data: { type: "recipe-zone" },
  });

  return (
    <VStack
      ref={setNodeRef}
      align="stretch"
      gap={1}
      p={2}
      borderWidth="2px"
      borderColor="border"
      borderRadius="md"
      overflow="auto"
      flex="1"
    >
      {children}
    </VStack>
  );
}

/* ------------------------------------------------------------------ */
/*  メインページ                                                       */
/* ------------------------------------------------------------------ */

export default function BlendPage() {
  const [recipe, setRecipe] = useState<RecipeStep[]>(() => [
    createStep("input"),
    createStep("output"),
  ]);
  const [search, setSearch] = useState("");
  const [activeDragOp, setActiveDragOp] = useState<string | null>(null);
  const isDragFromCatalog = useRef(false);
  const [dragOverId, setDragOverId] = useState<number | string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // 固定ステップ(入力/出力)のinstanceId
  const inputStep = recipe[0];
  const outputStep = recipe[recipe.length - 1];

  // 中間ステップ（ソート対象）
  const middleSteps = recipe.slice(1, -1);
  const middleIds = useMemo(() => middleSteps.map((s) => s.instanceId), [middleSteps]);

  const removeStep = useCallback((instanceId: number) => {
    setRecipe((prev) => prev.filter((s) => s.instanceId !== instanceId));
  }, []);

  const toggleStep = useCallback((instanceId: number) => {
    setRecipe((prev) =>
      prev.map((s) => s.instanceId === instanceId ? { ...s, enabled: !s.enabled } : s),
    );
  }, []);

  const updateParam = useCallback((instanceId: number, key: string, value: number | string) => {
    setRecipe((prev) =>
      prev.map((s) => s.instanceId === instanceId ? { ...s, params: { ...s.params, [key]: value } } : s),
    );
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === "operation") {
      setActiveDragOp(data.operationId as string);
      isDragFromCatalog.current = true;
    } else {
      isDragFromCatalog.current = false;
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setDragOverId(over.id as number | string);
    } else {
      setDragOverId(null);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveDragOp(null);
    setDragOverId(null);
    const { active, over } = event;
    if (!over) return;
    const activeData = active.data.current;

    if (activeData?.type === "operation") {
      const overData = over.data.current;
      const isOverRecipeZone = over.id === "recipe-drop-zone" || overData?.type === "recipe-step";
      if (isOverRecipeZone) {
        const newStep = createStep(activeData.operationId as string);
        setRecipe((prev) => {
          const next = [...prev];
          if (overData?.type === "recipe-step") {
            // 特定のステップの上にドロップ → その位置に挿入
            const overIdx = next.findIndex((s) => s.instanceId === over.id);
            // 入力の前には入れない、出力の後にも入れない
            const insertIdx = Math.max(1, Math.min(overIdx, next.length - 1));
            next.splice(insertIdx, 0, newStep);
          } else {
            // ゾーン自体にドロップ → 出力の手前
            next.splice(next.length - 1, 0, newStep);
          }
          return next;
        });
      }
      return;
    }

    // 中間ステップの並び替え（入力/出力は動かさない）
    if (activeData?.type === "recipe-step" && active.id !== over.id) {
      setRecipe((prev) => {
        const activeIdx = prev.findIndex((s) => s.instanceId === active.id);
        const overIdx = prev.findIndex((s) => s.instanceId === over.id);
        if (activeIdx <= 0 || activeIdx >= prev.length - 1) return prev; // 入力/出力は動かさない
        if (overIdx <= 0 || overIdx >= prev.length - 1) return prev;
        return arrayMove(prev, activeIdx, overIdx);
      });
    }
  }, []);

  // パイプライン計算
  const stepOutputs = useMemo(() => {
    const outputs = new Map<number, string>();
    let result = "";
    for (const step of recipe) {
      if (!step.enabled) continue;
      const op = OP_MAP.get(step.operationId);
      if (!op) continue;
      try { result = op.fn(result, step.params); }
      catch { result = "[処理エラー]"; break; }
      outputs.set(step.instanceId, result);
    }
    return outputs;
  }, [recipe]);

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase();
    const map = new Map<string, OperationDef[]>();
    for (const op of OPERATIONS) {
      if (FIXED_OPS.has(op.id)) continue;
      if (q && !op.name.toLowerCase().includes(q) && !op.category.toLowerCase().includes(q)) continue;
      const list = map.get(op.category) ?? [];
      list.push(op);
      map.set(op.category, list);
    }
    return map;
  }, [search]);

  const noop = useCallback(() => {}, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box py={6} h="100vh" overflow="auto">
        <Center pb={6}>
          <Heading>テキスト調合</Heading>
        </Center>

        <HStack align="stretch" gap={4} px={6} mx="auto" h="calc(100vh - 120px)">
          {/* 左: レシピ（入力・中間・出力が同一リスト内） */}
          <RecipeDropZone>
            {/* 入力（固定） */}
            <StepRow
              step={inputStep}
              fixed
              onToggle={() => toggleStep(inputStep.instanceId)}
              onRemove={noop}
              onParamChange={(k, v) => updateParam(inputStep.instanceId, k, v)}
            />

            {/* 中間ステップ（ソート可能） */}
            <SortableContext items={middleIds} strategy={verticalListSortingStrategy}>
              {/* 入力の上にホバー or ステップ0個 → 先頭にゴースト */}
              {activeDragOp && (dragOverId === inputStep.instanceId || (middleSteps.length === 0 && dragOverId != null)) && (
                <GhostStep name={OP_MAP.get(activeDragOp)?.name ?? ""} />
              )}
              {middleSteps.map((step) => (
                <Box key={step.instanceId}>
                  {/* 中間ステップの上にホバー → その前にゴースト */}
                  {activeDragOp && dragOverId === step.instanceId && (
                    <GhostStep name={OP_MAP.get(activeDragOp)?.name ?? ""} />
                  )}
                  <SortableStepRow
                    step={step}
                    onToggle={() => toggleStep(step.instanceId)}
                    onRemove={() => removeStep(step.instanceId)}
                    onParamChange={(k, v) => updateParam(step.instanceId, k, v)}
                  />
                </Box>
              ))}
              {/* 出力の上 or ゾーン自体にホバー → 末尾にゴースト */}
              {activeDragOp && middleSteps.length > 0 && (dragOverId === outputStep.instanceId || dragOverId === "recipe-drop-zone") && (
                <GhostStep name={OP_MAP.get(activeDragOp)?.name ?? ""} />
              )}
            </SortableContext>

            {/* 出力（固定・下部貼り付け） */}
            <Box mt="auto">
              <StepRow
                step={outputStep}
                pipelineValue={stepOutputs.get(outputStep.instanceId)}
                fixed
                onToggle={() => toggleStep(outputStep.instanceId)}
                onRemove={noop}
                onParamChange={(k, v) => updateParam(outputStep.instanceId, k, v)}
              />
            </Box>
          </RecipeDropZone>

          {/* 右: 操作カタログ */}
          <VStack w="240px" flexShrink={0} align="stretch" gap={2} overflow="auto">
            <Text fontWeight="bold" fontSize="sm">操作</Text>
            <HStack gap={1}>
              <LuSearch style={{ flexShrink: 0, opacity: 0.5 }} />
              <Input size="sm" placeholder="検索..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </HStack>
            <VStack align="stretch" gap={3} overflow="auto" flex="1" pr={1}>
              {[...filteredCategories.entries()].map(([cat, ops]) => (
                <VStack key={cat} align="stretch" gap={1}>
                  <Text fontSize="xs" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
                    {cat}
                  </Text>
                  {ops.map((op) => (
                    <DraggableOperation key={op.id} op={op} />
                  ))}
                </VStack>
              ))}
            </VStack>
          </VStack>
        </HStack>
      </Box>

      <DragOverlay dropAnimation={isDragFromCatalog.current ? null : undefined}>
        {activeDragOp && (
          <Box px={3} py={1.5} borderWidth="1px" borderRadius="md" fontSize="sm" bg="bg.panel" boxShadow="lg">
            {OP_MAP.get(activeDragOp)?.name}
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  );
}
