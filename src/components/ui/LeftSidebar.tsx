"use client";
import { Button, ClientOnly, HStack, IconButton, Skeleton, VStack } from "@chakra-ui/react";
import { ColorModeIcon, useColorMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { useState } from "react";
import { LuCircleHelp, LuGrid3X3, LuImage, LuLanguages, LuPanelLeftClose, LuPanelLeftOpen, LuPuzzle, LuSettings, LuTable } from "react-icons/lu";
import SettingsDrawer from "@/components/ui/SettingsDrawer";
import { AiOutlineFontSize } from "react-icons/ai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TUTORIAL_OPEN_EVENT } from "@/hooks/useTutorial";

export default function LeftSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const label = colorMode === "dark" ? "ライトモード" : "ダークモード";
  const pathname = usePathname();

  const handleHelp = () => {
    window.dispatchEvent(
      new CustomEvent(TUTORIAL_OPEN_EVENT, { detail: pathname }),
    );
  };

  return (
    <VStack
      as="nav"
      align="stretch"
      w={isOpen ? "250px" : "48px"}
      h="100vh"
      position="sticky"
      top={0}
      borderRightWidth="1px"
      pt={2}
      pb={4}
      px={isOpen ? 4 : 1}
      transition="width 0.2s, padding 0.2s"
      overflow="hidden"
      flexShrink={0}
      gap={0}
    >
      <HStack justify={isOpen ? "flex-end" : "center"}>
        <IconButton
          aria-label="Toggle sidebar"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <LuPanelLeftClose /> : <LuPanelLeftOpen />}
        </IconButton>
      </HStack>

      <VStack align="stretch" mt={4} gap={2}>
        {isOpen ? (
          <Button
            asChild
            variant="ghost"
            justifyContent="flex-start"
            w="100%"
          >
            <Link href="/">
              <AiOutlineFontSize /> Text Converter
            </Link>
          </Button>
        ) : (
          <HStack justify="center">
            <Tooltip content="Text to" positioning={{ placement: "right" }}>
              <IconButton
                asChild
                aria-label="Text to"
                variant="ghost"
                size="sm"
              >
                <Link href="/">
                  <AiOutlineFontSize />
                </Link>
              </IconButton>
            </Tooltip>
          </HStack>
        )}

        {isOpen ? (
          <Button
            asChild
            variant="ghost"
            justifyContent="flex-start"
            w="100%"
          >
            <Link href="/sheet">
              <LuTable /> CheetSheet
            </Link>
          </Button>
        ) : (
          <HStack justify="center">
            <Tooltip content="CheetSheet" positioning={{ placement: "right" }}>
              <IconButton
                asChild
                aria-label="CheetSheet"
                variant="ghost"
                size="sm"
              >
                <Link href="/sheet">
                  <LuTable />
                </Link>
              </IconButton>
            </Tooltip>
          </HStack>
        )}

        {isOpen ? (
          <Button
            asChild
            variant="ghost"
            justifyContent="flex-start"
            w="100%"
          >
            <Link href="/mapping">
              <LuLanguages /> Text Mapping
            </Link>
          </Button>
        ) : (
          <HStack justify="center">
            <Tooltip content="Text Mapping" positioning={{ placement: "right" }}>
              <IconButton
                asChild
                aria-label="Text Mapping"
                variant="ghost"
                size="sm"
              >
                <Link href="/mapping">
                  <LuLanguages />
                </Link>
              </IconButton>
            </Tooltip>
          </HStack>
        )}

        {isOpen ? (
          <Button
            asChild
            variant="ghost"
            justifyContent="flex-start"
            w="100%"
          >
            <Link href="/input">
              <LuGrid3X3 /> Input Text
            </Link>
          </Button>
        ) : (
          <HStack justify="center">
            <Tooltip content="Input Text" positioning={{ placement: "right" }}>
              <IconButton
                asChild
                aria-label="Input Text"
                variant="ghost"
                size="sm"
              >
                <Link href="/input">
                  <LuGrid3X3 />
                </Link>
              </IconButton>
            </Tooltip>
          </HStack>
        )}

        {isOpen ? (
          <Button
            asChild
            variant="ghost"
            justifyContent="flex-start"
            w="100%"
          >
            <Link href="/text-image">
              <LuImage /> Text Image
            </Link>
          </Button>
        ) : (
          <HStack justify="center">
            <Tooltip content="Text Image" positioning={{ placement: "right" }}>
              <IconButton
                asChild
                aria-label="Text Image"
                variant="ghost"
                size="sm"
              >
                <Link href="/text-image">
                  <LuImage />
                </Link>
              </IconButton>
            </Tooltip>
          </HStack>
        )}

        {isOpen ? (
          <Button
            asChild
            variant="ghost"
            justifyContent="flex-start"
            w="100%"
          >
            <Link href="/solver">
              <LuPuzzle /> Puzzle Solver
            </Link>
          </Button>
        ) : (
          <HStack justify="center">
            <Tooltip content="Puzzle Solver" positioning={{ placement: "right" }}>
              <IconButton
                asChild
                aria-label="Puzzle Solver"
                variant="ghost"
                size="sm"
              >
                <Link href="/solver">
                  <LuPuzzle />
                </Link>
              </IconButton>
            </Tooltip>
          </HStack>
        )}

        <ClientOnly fallback={<Skeleton h="9" w="100%" borderRadius="md" />}>
          {isOpen ? (
            <Button
              variant="ghost"
              justifyContent="flex-start"
              w="100%"
              onClick={toggleColorMode}
            >
              <ColorModeIcon /> {label}
            </Button>
          ) : (
            <HStack justify="center">
              <Tooltip content={label} positioning={{ placement: "right" }}>
                <IconButton
                  aria-label={label}
                  variant="ghost"
                  size="sm"
                  onClick={toggleColorMode}
                >
                  <ColorModeIcon />
                </IconButton>
              </Tooltip>
            </HStack>
          )}
        </ClientOnly>
      </VStack>

      <VStack align="stretch" mt="auto" gap={2} px={isOpen ? 0 : undefined}>
        {isOpen ? (
          <Button
            variant="ghost"
            justifyContent="flex-start"
            w="100%"
            onClick={handleHelp}
          >
            <LuCircleHelp /> ヘルプ
          </Button>
        ) : (
          <HStack justify="center">
            <Tooltip content="ヘルプ" positioning={{ placement: "right" }}>
              <IconButton
                aria-label="ヘルプ"
                variant="ghost"
                size="sm"
                onClick={handleHelp}
              >
                <LuCircleHelp />
              </IconButton>
            </Tooltip>
          </HStack>
        )}

        {isOpen ? (
          <Button
            variant="ghost"
            justifyContent="flex-start"
            w="100%"
            onClick={() => setIsSettingsOpen(true)}
          >
            <LuSettings /> 設定
          </Button>
        ) : (
          <HStack justify="center">
            <Tooltip content="設定" positioning={{ placement: "right" }}>
              <IconButton
                aria-label="設定"
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
              >
                <LuSettings />
              </IconButton>
            </Tooltip>
          </HStack>
        )}
      </VStack>

      <SettingsDrawer open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </VStack>
  );
}
