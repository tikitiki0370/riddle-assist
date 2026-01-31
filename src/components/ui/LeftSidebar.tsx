"use client";
import { Button, ClientOnly, HStack, IconButton, Skeleton, VStack } from "@chakra-ui/react";
import { ColorModeIcon, useColorMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { useState } from "react";
import { LuPanelLeftClose, LuPanelLeftOpen, LuTable } from "react-icons/lu";
import { AiOutlineFontSize } from "react-icons/ai";
import Link from "next/link";

export default function LeftSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();
  const label = colorMode === "dark" ? "ダークモード" : "ライトモード";

  return (
    <VStack
      as="nav"
      align="stretch"
      w={isOpen ? "250px" : "48px"}
      minH="100vh"
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
            variant="ghost"
            justifyContent="flex-start"
            w="100%"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <AiOutlineFontSize /> Text to
          </Button>
        ) : (
          <HStack justify="center">
            <Tooltip content="Text to" positioning={{ placement: "right" }}>
              <IconButton
                aria-label="Text to"
                variant="ghost"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <AiOutlineFontSize />
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
    </VStack>
  );
}
