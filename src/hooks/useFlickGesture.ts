import { useCallback, useRef, useState } from "react";
import { FlickDirection } from "@/lib/flickInput/keyMapping";

interface UseFlickGestureOptions {
  threshold?: number;
  onFlick: (direction: FlickDirection) => void;
}

interface UseFlickGestureReturn {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
  currentDirection: FlickDirection | null;
  isActive: boolean;
}

export function useFlickGesture({
  threshold = 30,
  onFlick,
}: UseFlickGestureOptions): UseFlickGestureReturn {
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const [currentDirection, setCurrentDirection] = useState<FlickDirection | null>(null);
  const [isActive, setIsActive] = useState(false);

  const calculateDirection = useCallback(
    (startX: number, startY: number, endX: number, endY: number): FlickDirection => {
      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < threshold) {
        return "center";
      }

      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      if (angle >= -45 && angle < 45) return "right";
      if (angle >= 45 && angle < 135) return "down";
      if (angle >= -135 && angle < -45) return "up";
      return "left";
    },
    [threshold]
  );

  const cleanup = useCallback(() => {
    startPos.current = null;
    setIsActive(false);
    setCurrentDirection(null);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsActive(true);
    setCurrentDirection("center");
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startPos.current) return;

      const direction = calculateDirection(
        startPos.current.x,
        startPos.current.y,
        e.clientX,
        e.clientY
      );
      setCurrentDirection(direction);
    },
    [calculateDirection]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!startPos.current) return;

      const direction = calculateDirection(
        startPos.current.x,
        startPos.current.y,
        e.clientX,
        e.clientY
      );

      onFlick(direction);
      cleanup();
    },
    [calculateDirection, onFlick, cleanup]
  );

  const onPointerCancel = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    currentDirection,
    isActive,
  };
}
