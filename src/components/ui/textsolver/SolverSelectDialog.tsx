"use client";
import {
  CheckboxCard,
  Dialog,
  Portal,
  SimpleGrid,
} from "@chakra-ui/react";

interface SolverOption {
  id: string;
  label: string;
}

interface SolverSelectDialogProps {
  open: boolean;
  onClose: () => void;
  solvers: SolverOption[];
  visibleSet: Set<string>;
  onToggle: (id: string, checked: boolean) => void;
}

export default function SolverSelectDialog({
  open,
  onClose,
  solvers,
  visibleSet,
  onToggle,
}: SolverSelectDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>表示するツール</Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <SimpleGrid columns={2} gap={3}>
                {solvers.map(({ id, label }) => (
                  <CheckboxCard.Root
                    key={id}
                    checked={visibleSet.has(id)}
                    onCheckedChange={(e) => onToggle(id, !!e.checked)}
                  >
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control>
                      <CheckboxCard.Content>
                        <CheckboxCard.Label>{label}</CheckboxCard.Label>
                      </CheckboxCard.Content>
                      <CheckboxCard.Indicator />
                    </CheckboxCard.Control>
                  </CheckboxCard.Root>
                ))}
              </SimpleGrid>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
