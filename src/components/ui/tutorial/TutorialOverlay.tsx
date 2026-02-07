"use client";

import {
  Box,
  Button,
  HStack,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useLayoutEffect, useRef, useState } from "react";
import { useTutorial, type HighlightRect } from "@/hooks/useTutorial";
import type { Placement } from "./tutorialSteps";

const TOOLTIP_GAP = 12;
const VIEWPORT_MARGIN = 16;

interface TooltipPosition {
  top: number;
  left: number;
}

function calcTooltipPosition(
  highlightRect: HighlightRect,
  tooltipWidth: number,
  tooltipHeight: number,
  placement: Placement,
): TooltipPosition {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top: number;
  let left: number;

  const centerX = highlightRect.left + highlightRect.width / 2;

  const tryPlacement = (p: Placement): { top: number; left: number; fits: boolean } => {
    let t: number;
    let l: number;
    let fits = true;

    switch (p) {
      case "bottom":
        t = highlightRect.top + highlightRect.height + TOOLTIP_GAP;
        l = centerX - tooltipWidth / 2;
        if (t + tooltipHeight > vh - VIEWPORT_MARGIN) fits = false;
        break;
      case "top":
        t = highlightRect.top - tooltipHeight - TOOLTIP_GAP;
        l = centerX - tooltipWidth / 2;
        if (t < VIEWPORT_MARGIN) fits = false;
        break;
      case "right":
        t = highlightRect.top + highlightRect.height / 2 - tooltipHeight / 2;
        l = highlightRect.left + highlightRect.width + TOOLTIP_GAP;
        if (l + tooltipWidth > vw - VIEWPORT_MARGIN) fits = false;
        break;
      case "left":
        t = highlightRect.top + highlightRect.height / 2 - tooltipHeight / 2;
        l = highlightRect.left - tooltipWidth - TOOLTIP_GAP;
        if (l < VIEWPORT_MARGIN) fits = false;
        break;
    }

    return { top: t!, left: l!, fits };
  };

  const opposite: Record<Placement, Placement> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };

  const primary = tryPlacement(placement);
  if (primary.fits) {
    top = primary.top;
    left = primary.left;
  } else {
    const fallback = tryPlacement(opposite[placement]);
    top = fallback.top;
    left = fallback.left;
  }

  // Clamp horizontal position within viewport
  left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - tooltipWidth - VIEWPORT_MARGIN));
  // Clamp vertical position within viewport
  top = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - tooltipHeight - VIEWPORT_MARGIN));

  return { top, left };
}

export default function TutorialOverlay() {
  const {
    tutorial,
    isOpen,
    currentStep,
    currentStepData,
    highlightRect,
    isTransitioning,
    next,
    back,
    close,
  } = useTutorial();

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);

  // Update tooltip position when highlight rect changes (driven by hook's scroll/resize listeners)
  useLayoutEffect(() => {
    if (!highlightRect || !currentStepData || !tooltipRef.current) return;
    const tooltipEl = tooltipRef.current;
    const pos = calcTooltipPosition(
      highlightRect,
      tooltipEl.offsetWidth,
      tooltipEl.offsetHeight,
      currentStepData.placement,
    );
    setTooltipPos(pos);
  }, [highlightRect, currentStepData]);

  if (!isOpen || !tutorial || !currentStepData || !highlightRect) return null;

  const isLast = currentStep === tutorial.steps.length - 1;
  const hasValidPrev = currentStep > 0;
  const totalSteps = tutorial.steps.length;
  const tooltipReady = tooltipPos !== null;

  return (
    <Portal>
      {/* Backdrop - click to advance */}
      <Box
        position="fixed"
        inset={0}
        zIndex={9998}
        onClick={next}
        cursor="pointer"
      />

      {/* Highlight box */}
      <Box
        position="fixed"
        zIndex={9999}
        pointerEvents="none"
        borderRadius="md"
        transition={isTransitioning ? "top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease" : "none"}
        boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.5)"
        style={{
          top: highlightRect.top,
          left: highlightRect.left,
          width: highlightRect.width,
          height: highlightRect.height,
        }}
      />

      {/* Tooltip */}
      <Box
        ref={tooltipRef}
        position="fixed"
        zIndex={10000}
        bg="bg"
        borderRadius="lg"
        boxShadow="lg"
        p={4}
        maxW="320px"
        minW="240px"
        opacity={tooltipReady ? 1 : 0}
        style={{
          top: tooltipPos?.top ?? 0,
          left: tooltipPos?.left ?? 0,
        }}
      >
        <VStack gap={2} align="stretch">
          <Text fontWeight="bold" fontSize="md">
            {currentStepData.title}
          </Text>
          <Text fontSize="sm" color="fg.muted" lineHeight="tall">
            {currentStepData.description}
          </Text>
          <HStack justify="space-between" pt={2}>
            <Button variant="ghost" size="sm" onClick={close}>
              スキップ
            </Button>
            <HStack gap={2}>
              <Text fontSize="xs" color="fg.muted">
                {currentStep + 1}/{totalSteps}
              </Text>
              {hasValidPrev && (
                <Button variant="outline" size="sm" onClick={back}>
                  戻る
                </Button>
              )}
              <Button colorPalette="blue" size="sm" onClick={next}>
                {isLast ? "完了" : "次へ"}
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Portal>
  );
}
