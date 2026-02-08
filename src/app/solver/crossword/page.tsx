"use client";
import { Alert } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";
import CrosswordBuilder from "@/components/ui/solver/CrosswordBuilder";

export default function CrosswordPage() {
  return (
    <>
      <Alert.Root status="info">
        <Alert.Indicator>
          <LuInfo />
        </Alert.Indicator>
        <Alert.Title>この機能は現在 auto solve 機能を持ちません</Alert.Title>
      </Alert.Root>
      <CrosswordBuilder />
    </>
  );
}
