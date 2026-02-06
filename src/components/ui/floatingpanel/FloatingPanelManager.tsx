"use client";
import {
  Box,
  HStack,
  IconButton,
  Popover,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { FloatingPanelBase, FloatingPanelState } from "./types";
import { getPanelContentDef, PANEL_CONTENT_DEFS } from "./registry";
import FloatingPanel from "./FloatingPanel";

const STORAGE_KEY = "floating-panels";

function loadPanels(): FloatingPanelState[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const panels: FloatingPanelState[] = JSON.parse(raw);
    // blob URL は永続化できないので復元時にクリア
    return panels
      .filter((p) => getPanelContentDef(p.type))
      .map((p) => {
        const def = getPanelContentDef(p.type);
        if (def?.onRestore) {
          return { ...p, contentState: def.onRestore(p.contentState) };
        }
        return p;
      });
  } catch {
    return [];
  }
}

function savePanels(panels: FloatingPanelState[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(panels));
  } catch {
    // quota exceeded 等は無視
  }
}

export default function FloatingPanelManager() {
  const [panels, setPanels] = useState<FloatingPanelState[]>([]);
  const nextZRef = useRef(1000);
  const [fabOpen, setFabOpen] = useState(false);
  const initializedRef = useRef(false);

  // 初回マウント時に localStorage から復元
  useEffect(() => {
    const restored = loadPanels();
    if (restored.length > 0) {
      const maxZ = Math.max(...restored.map((p) => p.zIndex));
      nextZRef.current = maxZ + 1;
      setPanels(restored);
    }
    initializedRef.current = true;
  }, []);

  // panels 変更時に localStorage へ保存（デバウンス付き）
  const latestPanelsRef = useRef(panels);
  latestPanelsRef.current = panels;
  const saveScheduledRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) return;
    saveScheduledRef.current = true;
    const timer = setTimeout(() => {
      savePanels(panels);
      saveScheduledRef.current = false;
    }, 500);
    return () => clearTimeout(timer);
  }, [panels]);

  // アンマウント・タブ閉じ時に未保存分をフラッシュ
  useEffect(() => {
    const flush = () => {
      if (saveScheduledRef.current) {
        savePanels(latestPanelsRef.current);
        saveScheduledRef.current = false;
      }
    };
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, []);

  const addPanel = useCallback((type: string) => {
    const def = getPanelContentDef(type);
    if (!def) return;

    const id = crypto.randomUUID();
    const z = nextZRef.current++;
    setPanels((prev) => {
      const offset = (prev.length % 5) * 30;
      return [
        ...prev,
        {
          id,
          type,
          position: { x: 100 + offset, y: 100 + offset },
          panelWidth: def.defaultWidth ?? 300,
          panelHeight: def.defaultHeight ?? 250,
          opacity: 0.7,
          zIndex: z,
          contentState: def.createInitialState(),
        },
      ];
    });
    setFabOpen(false);
  }, []);

  const updateChrome = useCallback(
    (id: string, patch: Partial<FloatingPanelBase>) => {
      setPanels((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
      );
    },
    []
  );

  const updateContent = useCallback(
    (id: string, patch: Partial<Record<string, unknown>>) => {
      setPanels((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const def = getPanelContentDef(p.type);
          const oldContentState = p.contentState;
          const newContentState = { ...oldContentState, ...patch };
          def?.onContentStateChange?.(oldContentState, newContentState);
          return { ...p, contentState: newContentState };
        })
      );
    },
    []
  );

  const removePanel = useCallback((id: string) => {
    setPanels((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) {
        const def = getPanelContentDef(target.type);
        def?.onCleanup?.(target.contentState);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const removeAllPanels = useCallback(() => {
    setPanels((prev) => {
      for (const p of prev) {
        const def = getPanelContentDef(p.type);
        def?.onCleanup?.(p.contentState);
      }
      return [];
    });
  }, []);

  const bringToFront = useCallback((id: string) => {
    const z = nextZRef.current++;
    setPanels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, zIndex: z } : p))
    );
  }, []);

  return (
    <>
      {/* FABボタン — 右下固定、Popover メニュー */}
      <Box position="fixed" bottom={6} right={6} zIndex={999}>
        <Popover.Root
          open={fabOpen}
          onOpenChange={(e) => setFabOpen(e.open)}
          positioning={{ placement: "top-end" }}
        >
          <Popover.Trigger asChild>
            <IconButton
              aria-label="パネルを追加"
              rounded="full"
              size="lg"
              colorPalette="blue"
            >
              <LuPlus />
            </IconButton>
          </Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content width="auto" p={1}>
                <Popover.Body p={0}>
                  {PANEL_CONTENT_DEFS.map((def) => {
                    const Icon = def.icon;
                    return (
                      <Box
                        key={def.type}
                        as="button"
                        display="flex"
                        alignItems="center"
                        w="100%"
                        px={3}
                        py={2}
                        rounded="md"
                        cursor="pointer"
                        _hover={{ bg: { base: "gray.100", _dark: "gray.700" } }}
                        onClick={() => addPanel(def.type)}
                      >
                        <HStack gap={2}>
                          <Icon />
                          <Text fontSize="sm">{def.label}</Text>
                        </HStack>
                      </Box>
                    );
                  })}
                  {panels.length > 0 && (
                    <>
                      <Box borderTopWidth={1} my={1} />
                      <Box
                        as="button"
                        display="flex"
                        alignItems="center"
                        w="100%"
                        px={3}
                        py={2}
                        rounded="md"
                        cursor="pointer"
                        _hover={{ bg: { base: "red.50", _dark: "red.900/30" } }}
                        color={{ base: "red.600", _dark: "red.400" }}
                        onClick={() => {
                          removeAllPanels();
                          setFabOpen(false);
                        }}
                      >
                        <HStack gap={2}>
                          <LuTrash2 />
                          <Text fontSize="sm">すべて閉じる</Text>
                        </HStack>
                      </Box>
                    </>
                  )}
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      </Box>

      {/* 全パネルをPortalで描画 */}
      <Portal>
        {panels.map((panel) => {
          const contentDef = getPanelContentDef(panel.type);
          if (!contentDef) return null;
          return (
            <FloatingPanel
              key={panel.id}
              panel={panel}
              contentDef={contentDef}
              onUpdateChrome={updateChrome}
              onUpdateContent={updateContent}
              onRemove={removePanel}
              onBringToFront={bringToFront}
            />
          );
        })}
      </Portal>
    </>
  );
}
