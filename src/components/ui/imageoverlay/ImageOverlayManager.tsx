"use client";
import { Box, IconButton, Portal } from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import { LuImage } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import ImageOverlayPanel, {
  ImageOverlayState,
} from "./ImageOverlayPanel";

export default function ImageOverlayManager() {
  const [overlays, setOverlays] = useState<ImageOverlayState[]>([]);
  const nextZRef = useRef(1000);

  const addOverlay = useCallback(() => {
    const id = crypto.randomUUID();
    const z = nextZRef.current++;
    setOverlays((prev) => {
      const offset = (prev.length % 5) * 30;
      return [
        ...prev,
        {
          id,
          imageUrl: null,
          position: { x: 100 + offset, y: 100 + offset },
          panelWidth: 300,
          panelHeight: 250,
          opacity: 0.7,
          zIndex: z,
        },
      ];
    });
  }, []);

  const updateOverlay = useCallback(
    (id: string, patch: Partial<ImageOverlayState>) => {
      setOverlays((prev) =>
        prev.map((o) => {
          if (o.id !== id) return o;
          // 画像差し替え時は古いblob URLを解放
          if (
            patch.imageUrl &&
            o.imageUrl?.startsWith("blob:") &&
            patch.imageUrl !== o.imageUrl
          ) {
            URL.revokeObjectURL(o.imageUrl);
          }
          return { ...o, ...patch };
        })
      );
    },
    []
  );

  const removeOverlay = useCallback((id: string) => {
    setOverlays((prev) => {
      const target = prev.find((o) => o.id === id);
      if (target?.imageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(target.imageUrl);
      }
      return prev.filter((o) => o.id !== id);
    });
  }, []);

  const bringToFront = useCallback((id: string) => {
    const z = nextZRef.current++;
    setOverlays((prev) =>
      prev.map((o) => (o.id === id ? { ...o, zIndex: z } : o))
    );
  }, []);

  return (
    <>
      {/* FABボタン — 右下固定 */}
      <Box position="fixed" bottom={6} right={6} zIndex={999}>
        <Tooltip
          content="画像オーバーレイを追加"
          positioning={{ placement: "left" }}
        >
          <IconButton
            aria-label="画像オーバーレイを追加"
            rounded="full"
            size="lg"
            colorPalette="blue"
            onClick={addOverlay}
          >
            <LuImage />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 全パネルをPortalで描画 */}
      <Portal>
        {overlays.map((overlay) => (
          <ImageOverlayPanel
            key={overlay.id}
            overlay={overlay}
            onUpdate={updateOverlay}
            onRemove={removeOverlay}
            onBringToFront={bringToFront}
          />
        ))}
      </Portal>
    </>
  );
}
