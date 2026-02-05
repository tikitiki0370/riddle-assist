"use client";
import {
  Box,
  Button,
  Dialog,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import { LuImage, LuUpload, LuX } from "react-icons/lu";

interface CreateMappingModalProps {
  open: boolean;
  onClose: () => void;
  onFontLoaded: (fontName: string, fontFamily: string) => void;
}

const FONT_FAMILY = "custom-mapping-font";

export default function CreateMappingModal({
  open,
  onClose,
  onFontLoaded,
}: CreateMappingModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFont = useCallback(
    async (file: File) => {
      try {
        const buffer = await file.arrayBuffer();
        const font = new FontFace(FONT_FAMILY, buffer);
        await font.load();
        document.fonts.add(font);
        onFontLoaded(file.name, FONT_FAMILY);
        onClose();
      } catch (e) {
        console.error("Failed to load font:", e);
        alert("フォントの読み込みに失敗しました");
      }
    },
    [onFontLoaded, onClose]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        loadFont(file);
      }
    },
    [loadFont]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        loadFont(file);
      }
    },
    [loadFont]
  );

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>新規マッピング作成</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <Button variant="ghost" size="sm" position="absolute" right={2} top={2}>
                  <LuX />
                </Button>
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={4}>
                {/* Font File Drop Area */}
                <Box
                  w="100%"
                  p={6}
                  borderWidth={2}
                  borderStyle="dashed"
                  borderColor={isDragging ? "blue.500" : "gray.300"}
                  borderRadius="md"
                  bg={isDragging ? "blue.50" : undefined}
                  textAlign="center"
                  cursor="pointer"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  _dark={{
                    borderColor: isDragging ? "blue.300" : "gray.600",
                    bg: isDragging ? "blue.900" : undefined,
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".ttf,.otf,.woff,.woff2"
                    style={{ display: "none" }}
                  />
                  <VStack gap={2}>
                    <LuUpload size={32} />
                    <Text fontWeight="medium">フォントファイル</Text>
                    <Text fontSize="sm" color="gray.500">
                      ドロップまたはクリックして選択
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      .ttf, .otf, .woff, .woff2
                    </Text>
                  </VStack>
                </Box>

                {/* Image Creation Option */}
                <Box
                  w="100%"
                  p={6}
                  borderWidth={1}
                  borderRadius="md"
                  textAlign="center"
                  cursor="not-allowed"
                  opacity={0.5}
                  _dark={{
                    borderColor: "gray.600",
                  }}
                >
                  <VStack gap={2}>
                    <LuImage size={32} />
                    <Text fontWeight="medium">画像から作成</Text>
                    <Text fontSize="sm" color="gray.500">
                      Coming soon...
                    </Text>
                  </VStack>
                </Box>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
