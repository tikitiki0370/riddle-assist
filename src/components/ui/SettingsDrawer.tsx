"use client";
import { useState } from "react";
import { Button, Drawer, Portal, Text, VStack } from "@chakra-ui/react";

const STORAGE_KEYS = [
  "riddle-assist-visible-solvers",
  "riddle-assist-separator",
  "floating-panels",
  "memo-slots",
  "riddle-assist-tutorial-seen",
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SettingsDrawer({ open, onClose }: Props) {
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    setConfirming(false);
    window.location.reload();
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => {
        if (!e.open) {
          onClose();
          setConfirming(false);
        }
      }}
      placement="end"
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.CloseTrigger />
            <Drawer.Header>設定</Drawer.Header>
            <Drawer.Body>
              <VStack align="stretch" gap={4}>
                <Text fontWeight="bold">データ管理</Text>
                {!confirming ? (
                  <Button
                    colorPalette="red"
                    variant="outline"
                    onClick={() => setConfirming(true)}
                  >
                    保存データをリセット
                  </Button>
                ) : (
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" color="fg.muted">
                      すべての保存データが削除されます。この操作は取り消せません。
                    </Text>
                    <Button colorPalette="red" onClick={handleReset}>
                      リセットする
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirming(false)}>
                      キャンセル
                    </Button>
                  </VStack>
                )}
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
