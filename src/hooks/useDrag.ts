"use client";
import { useCallback, useRef } from "react";

interface UseDragOptions {
  position: { x: number; y: number };
  onMove: (pos: { x: number; y: number }) => void;
}

interface UseDragReturn {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}

export function useDrag({ position, onMove }: UseDragOptions): UseDragReturn {
  const offsetRef = useRef<{ dx: number; dy: number } | null>(null);
  const positionRef = useRef(position);
  positionRef.current = position;

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      offsetRef.current = {
        dx: e.clientX - positionRef.current.x,
        dy: e.clientY - positionRef.current.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!offsetRef.current) return;
      onMove({
        x: e.clientX - offsetRef.current.dx,
        y: e.clientY - offsetRef.current.dy,
      });
    },
    [onMove]
  );

  const onPointerUp = useCallback(() => {
    offsetRef.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp };
}
