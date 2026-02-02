"use client";
import { Drawer, Portal } from "@chakra-ui/react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SettingsDrawer({ open, onClose }: Props) {
  return (
    <Drawer.Root open={open} onOpenChange={(e) => !e.open && onClose()} placement="end">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.CloseTrigger />
            <Drawer.Header>設定</Drawer.Header>
            <Drawer.Body />
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
