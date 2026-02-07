"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getTutorialForPath,
  type PageTutorial,
  type TutorialStep,
} from "@/components/ui/tutorial/tutorialSteps";

const STORAGE_KEY = "riddle-assist-tutorial-seen";
export const TUTORIAL_OPEN_EVENT = "open-tutorial";

const HIGHLIGHT_PADDING = 8;

/** Maps pageId to the version that was seen. Old boolean values are treated as version 0. */
type SeenMap = Record<string, number>;

function loadSeen(): SeenMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, number | boolean>;
      // Migrate old boolean format to version 0
      const migrated: SeenMap = {};
      for (const [key, value] of Object.entries(parsed)) {
        migrated[key] = typeof value === "boolean" ? 0 : value;
      }
      return migrated;
    }
  } catch {
    /* ignore */
  }
  return {};
}

function saveSeen(map: SeenMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function hasSeenLatest(tutorial: PageTutorial): boolean {
  const seen = loadSeen();
  const seenVersion = seen[tutorial.pageId];
  return seenVersion !== undefined && seenVersion >= tutorial.version;
}

function findTargetElement(step: TutorialStep): Element | null {
  return document.querySelector(`[data-tutorial="${step.target}"]`);
}

function calcHighlightRect(el: Element): {
  top: number;
  left: number;
  width: number;
  height: number;
} {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top - HIGHLIGHT_PADDING,
    left: rect.left - HIGHLIGHT_PADDING,
    width: rect.width + HIGHLIGHT_PADDING * 2,
    height: rect.height + HIGHLIGHT_PADDING * 2,
  };
}

export interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface UseTutorialReturn {
  tutorial: PageTutorial | undefined;
  isOpen: boolean;
  currentStep: number;
  currentStepData: TutorialStep | undefined;
  highlightRect: HighlightRect | null;
  isTransitioning: boolean;
  next: () => void;
  back: () => void;
  close: () => void;
}

export function useTutorial(): UseTutorialReturn {
  const pathname = usePathname();
  const tutorial = getTutorialForPath(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(
    null,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isOpenRef = useRef(false);

  // Find the next valid step index (where target element exists in DOM)
  const findValidStep = useCallback(
    (startIndex: number, direction: 1 | -1 = 1): number => {
      if (!tutorial) return -1;
      let idx = startIndex;
      while (idx >= 0 && idx < tutorial.steps.length) {
        const el = findTargetElement(tutorial.steps[idx]);
        if (el) return idx;
        idx += direction;
      }
      return -1;
    },
    [tutorial],
  );

  // Navigate to a step: scroll into view and update highlight
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (!tutorial) return;
      const step = tutorial.steps[stepIndex];
      const el = findTargetElement(step);
      if (!el) return;

      el.scrollIntoView({ behavior: "instant", block: "center" });
      setHighlightRect(calcHighlightRect(el));
      setCurrentStep(stepIndex);

      // Enable CSS transition briefly for step changes
      setIsTransitioning(true);
      clearTimeout(transitionTimer.current);
      transitionTimer.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 350);
    },
    [tutorial],
  );

  // Mark tutorial as seen in localStorage with current version
  const markSeen = useCallback(() => {
    if (!tutorial) return;
    const seen = loadSeen();
    seen[tutorial.pageId] = tutorial.version;
    saveSeen(seen);
  }, [tutorial]);

  const close = useCallback(() => {
    setIsOpen(false);
    isOpenRef.current = false;
    setCurrentStep(0);
    setHighlightRect(null);
    markSeen();
  }, [markSeen]);

  const next = useCallback(() => {
    if (!tutorial) return;
    const nextIdx = findValidStep(currentStep + 1, 1);
    if (nextIdx === -1) {
      close();
    } else {
      goToStep(nextIdx);
    }
  }, [tutorial, currentStep, findValidStep, goToStep, close]);

  const back = useCallback(() => {
    if (!tutorial) return;
    const prevIdx = findValidStep(currentStep - 1, -1);
    if (prevIdx !== -1) {
      goToStep(prevIdx);
    }
  }, [tutorial, currentStep, findValidStep, goToStep]);

  const open = useCallback(() => {
    if (!tutorial) return;
    const firstValid = findValidStep(0, 1);
    if (firstValid === -1) return;
    setIsOpen(true);
    isOpenRef.current = true;
    goToStep(firstValid);
  }, [tutorial, findValidStep, goToStep]);

  // Auto-open on first visit or when version changes
  useEffect(() => {
    if (!tutorial) return;
    if (hasSeenLatest(tutorial)) return;

    const timer = setTimeout(() => {
      open();
    }, 300);
    return () => clearTimeout(timer);
  }, [tutorial, open]);

  // Close on route change
  useEffect(() => {
    if (isOpenRef.current) {
      setIsOpen(false);
      isOpenRef.current = false;
      setHighlightRect(null);
    }
  }, [pathname]);

  // Listen for re-open event from sidebar help button
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === pathname) {
        open();
      }
    };
    window.addEventListener(TUTORIAL_OPEN_EVENT, handler);
    return () => window.removeEventListener(TUTORIAL_OPEN_EVENT, handler);
  }, [pathname, open]);

  // Recalculate highlight position on scroll/resize
  useEffect(() => {
    if (!isOpen || !tutorial) return;

    const updatePosition = () => {
      const step = tutorial.steps[currentStep];
      if (!step) return;
      const el = findTargetElement(step);
      if (!el) return;
      setHighlightRect(calcHighlightRect(el));
    };

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition, { passive: true });
    // Also handle scrollable containers
    document.addEventListener("scroll", updatePosition, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("scroll", updatePosition, {
        capture: true,
      });
    };
  }, [isOpen, tutorial, currentStep]);

  const currentStepData = tutorial?.steps[currentStep];

  return {
    tutorial,
    isOpen,
    currentStep,
    currentStepData,
    highlightRect,
    isTransitioning,
    next,
    back,
    close,
  };
}
