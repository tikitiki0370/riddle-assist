"use client";

import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";
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
}

function redrawAll(ctx: CanvasRenderingContext2D, strokes: StrokeData[]) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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

  // Sync external changes (undo/clear from Controls) to local state
  useEffect(() => {
    const external = (contentState.strokes ?? []) as StrokeData[];
    if (external !== lastSyncedRef.current) {
      strokesRef.current = [...external];
      lastSyncedRef.current = external;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redrawAll(ctx, strokesRef.current);
    }
  }, [contentState.strokes]);

  // Resize canvas buffer to match container
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redrawAll(ctx, strokesRef.current);
    }
  }, []);

  // Observe container resize
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [resizeCanvas]);

  // Pointer event handlers for drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getRelativePos = (e: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      const point = getRelativePos(e);
      currentStrokeRef.current = [point];
      canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!currentStrokeRef.current) return;
      const point = getRelativePos(e);
      currentStrokeRef.current.push(point);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const points = currentStrokeRef.current;
      ctx.strokeStyle = strokeColorRef.current;
      ctx.lineWidth = strokeWidthRef.current;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      if (points.length >= 2) {
        const prev = points[points.length - 2];
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    };

    const onPointerUp = () => {
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

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

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
          cursor: "crosshair",
          touchAction: "none",
        }}
      />
    </Box>
  );
}
