"use client";

import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { PanelContentProps } from "../../types";

interface Point {
  x: number;
  y: number;
}

interface StrokeData {
  points: Point[];
  color: string;
  width: number;
}

export interface CanvasContentState extends Record<string, unknown> {
  strokes: StrokeData[];
  strokeColor: string;
  strokeWidth: number;
  scale: number;
  offset: { x: number; y: number };
  mode: "draw" | "move";
}

/** Clear canvas and redraw all strokes with zoom/pan transform. */
function redrawAll(
  ctx: CanvasRenderingContext2D,
  strokes: StrokeData[],
  scale: number,
  offset: { x: number; y: number },
) {
  const dpr = window.devicePixelRatio || 1;
  // Reset transform to clear the entire canvas
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // Apply zoom/pan transform
  ctx.setTransform(
    dpr * scale, 0, 0, dpr * scale,
    dpr * offset.x, dpr * offset.y,
  );
  for (const stroke of strokes) {
    if (stroke.points.length < 2) continue;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 0; i < stroke.points.length; i++) {
      const p = stroke.points[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const clampScale = (s: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));

export default function CanvasPanelContent({
  contentState,
  onContentStateChange,
}: PanelContentProps<CanvasContentState>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const strokesRef = useRef<StrokeData[]>(contentState.strokes ?? []);
  const currentStrokeRef = useRef<Point[] | null>(null);
  const lastSyncedRef = useRef<StrokeData[]>(contentState.strokes ?? []);

  const onContentStateChangeRef = useRef(onContentStateChange);
  onContentStateChangeRef.current = onContentStateChange;
  const strokeColorRef = useRef(contentState.strokeColor);
  strokeColorRef.current = contentState.strokeColor;
  const strokeWidthRef = useRef(contentState.strokeWidth);
  strokeWidthRef.current = contentState.strokeWidth;

  // View transform refs (source of truth during interaction)
  const scaleRef = useRef(contentState.scale ?? 1);
  const offsetRef = useRef<{ x: number; y: number }>(
    contentState.offset ?? { x: 0, y: 0 },
  );
  const modeRef = useRef<"draw" | "move">(contentState.mode ?? "draw");

  // Track last-synced view to skip self-triggered updates
  const viewSyncRef = useRef<{
    scale: number;
    offset: { x: number; y: number };
  }>({
    scale: contentState.scale ?? 1,
    offset: contentState.offset ?? { x: 0, y: 0 },
  });

  // Pan interaction state
  const panStartRef = useRef<{
    startX: number;
    startY: number;
    startOffset: { x: number; y: number };
    pointerId: number;
  } | null>(null);

  // ── External sync: strokes (undo / clear) ──
  useEffect(() => {
    const external = (contentState.strokes ?? []) as StrokeData[];
    if (external !== lastSyncedRef.current) {
      strokesRef.current = [...external];
      lastSyncedRef.current = external;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      redrawAll(ctx, strokesRef.current, scaleRef.current, offsetRef.current);
    }
  }, [contentState.strokes]);

  // ── External sync: scale / offset (zoom buttons in controls etc.) ──
  useEffect(() => {
    const s = contentState.scale ?? 1;
    const o = contentState.offset ?? { x: 0, y: 0 };
    if (s === viewSyncRef.current.scale && o === viewSyncRef.current.offset) {
      return;
    }
    viewSyncRef.current = { scale: s, offset: o };
    scaleRef.current = s;
    offsetRef.current = { ...o };
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    redrawAll(ctx, strokesRef.current, s, offsetRef.current);
  }, [contentState.scale, contentState.offset]);

  // ── External sync: mode ──
  useEffect(() => {
    modeRef.current = contentState.mode ?? "draw";
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = modeRef.current === "move" ? "grab" : "crosshair";
    }
  }, [contentState.mode]);

  // ── Resize canvas buffer ──
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      redrawAll(ctx, strokesRef.current, scaleRef.current, offsetRef.current);
    }
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [resizeCanvas]);

  // ── Helpers: apply view change ──
  const applyView = useCallback(
    (newScale: number, newOffset: { x: number; y: number }) => {
      scaleRef.current = newScale;
      offsetRef.current = newOffset;
      viewSyncRef.current = { scale: newScale, offset: newOffset };
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) redrawAll(ctx, strokesRef.current, newScale, newOffset);
      onContentStateChangeRef.current({ scale: newScale, offset: newOffset });
    },
    [],
  );

  /** Zoom centred on the viewport centre. */
  const zoomTo = useCallback(
    (newScale: number) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const oldScale = scaleRef.current;
      const clamped = clampScale(newScale);
      const o = offsetRef.current;
      applyView(clamped, {
        x: cx - (cx - o.x) * (clamped / oldScale),
        y: cy - (cy - o.y) * (clamped / oldScale),
      });
    },
    [applyView],
  );

  // ── Pointer events + wheel ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /** Convert screen-space pointer position to world-space coordinates. */
    const screenToWorld = (e: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const s = scaleRef.current;
      const o = offsetRef.current;
      return { x: (sx - o.x) / s, y: (sy - o.y) / s };
    };

    const onPointerDown = (e: PointerEvent) => {
      // Middle-click OR left-click in move mode → pan
      if (e.button === 1 || (e.button === 0 && modeRef.current === "move")) {
        panStartRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          startOffset: { ...offsetRef.current },
          pointerId: e.pointerId,
        };
        canvas.setPointerCapture(e.pointerId);
        canvas.style.cursor = "grabbing";
        e.preventDefault();
        return;
      }
      // Left-click in draw mode → start stroke
      if (e.button === 0) {
        currentStrokeRef.current = [screenToWorld(e)];
        canvas.setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      // ─ Panning ─
      if (panStartRef.current?.pointerId === e.pointerId) {
        const dx = e.clientX - panStartRef.current.startX;
        const dy = e.clientY - panStartRef.current.startY;
        const newOffset = {
          x: panStartRef.current.startOffset.x + dx,
          y: panStartRef.current.startOffset.y + dy,
        };
        offsetRef.current = newOffset;
        const ctx = canvas.getContext("2d");
        if (ctx) redrawAll(ctx, strokesRef.current, scaleRef.current, newOffset);
        return;
      }
      // ─ Drawing ─
      if (!currentStrokeRef.current) return;
      const point = screenToWorld(e);
      currentStrokeRef.current.push(point);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const s = scaleRef.current;
      const o = offsetRef.current;
      ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * o.x, dpr * o.y);
      ctx.strokeStyle = strokeColorRef.current;
      ctx.lineWidth = strokeWidthRef.current;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      const points = currentStrokeRef.current;
      if (points.length >= 2) {
        const prev = points[points.length - 2];
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    };

    const onPointerUp = (e: PointerEvent) => {
      // ─ End pan ─
      if (panStartRef.current?.pointerId === e.pointerId) {
        const newOffset = { ...offsetRef.current };
        viewSyncRef.current = { scale: scaleRef.current, offset: newOffset };
        onContentStateChangeRef.current({ offset: newOffset });
        panStartRef.current = null;
        canvas.style.cursor = modeRef.current === "move" ? "grab" : "crosshair";
        return;
      }
      // ─ End draw ─
      if (!currentStrokeRef.current) return;
      if (currentStrokeRef.current.length >= 2) {
        strokesRef.current = [
          ...strokesRef.current,
          {
            points: currentStrokeRef.current,
            color: strokeColorRef.current,
            width: strokeWidthRef.current,
          },
        ];
        const newStrokes = strokesRef.current;
        lastSyncedRef.current = newStrokes;
        onContentStateChangeRef.current({ strokes: newStrokes });
      }
      currentStrokeRef.current = null;
    };

    /** Wheel zoom centred on cursor position. */
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const oldScale = scaleRef.current;
      const factor = e.deltaY > 0 ? 0.95 : 1.05;
      const newScale = clampScale(oldScale * factor);
      const o = offsetRef.current;
      const newOffset = {
        x: cx - (cx - o.x) * (newScale / oldScale),
        y: cy - (cy - o.y) * (newScale / oldScale),
      };
      scaleRef.current = newScale;
      offsetRef.current = newOffset;
      viewSyncRef.current = { scale: newScale, offset: newOffset };
      const ctx = canvas.getContext("2d");
      if (ctx) redrawAll(ctx, strokesRef.current, newScale, newOffset);
      onContentStateChangeRef.current({ scale: newScale, offset: newOffset });
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  const currentScale = contentState.scale ?? 1;

  return (
    <Box
      ref={wrapperRef}
      flex={1}
      minH={0}
      pointerEvents="auto"
      position="relative"
      bg={{ base: "white", _dark: "gray.800" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          cursor:
            (contentState.mode ?? "draw") === "move" ? "grab" : "crosshair",
          touchAction: "none",
        }}
      />
      {/* Zoom controls overlay */}
      <HStack
        position="absolute"
        bottom={1}
        right={1}
        gap={0}
        pointerEvents="auto"
        bg={{ base: "white", _dark: "gray.700" }}
        rounded="md"
        shadow="sm"
        px={0.5}
        opacity={0.7}
        _hover={{ opacity: 1 }}
        transition="opacity 0.15s"
      >
        <IconButton
          aria-label="縮小"
          size="2xs"
          variant="ghost"
          onClick={() => zoomTo(scaleRef.current / 1.25)}
        >
          <LuMinus />
        </IconButton>
        <Text
          fontSize="2xs"
          minW="3.5em"
          textAlign="center"
          cursor="pointer"
          userSelect="none"
          onClick={() => applyView(1, { x: 0, y: 0 })}
          title="リセット"
        >
          {`${Math.round(currentScale * 100)}%`}
        </Text>
        <IconButton
          aria-label="拡大"
          size="2xs"
          variant="ghost"
          onClick={() => zoomTo(scaleRef.current * 1.25)}
        >
          <LuPlus />
        </IconButton>
      </HStack>
    </Box>
  );
}
