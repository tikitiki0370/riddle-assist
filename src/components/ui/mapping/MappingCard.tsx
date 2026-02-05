"use client";
import { Card, Image, Text, VStack } from "@chakra-ui/react";
import { LuType, LuImage, LuPlus } from "react-icons/lu";
import { ReactNode } from "react";
import { PresetConfig } from "@/types/mapping";

interface MappingCardProps {
  preset?: PresetConfig;
  title?: string;
  icon?: ReactNode;
  subtitle?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export default function MappingCard({
  preset,
  title,
  icon,
  subtitle,
  onClick,
  isActive,
}: MappingCardProps) {
  // プリセットがある場合はその情報を使用
  const displayTitle = preset?.name ?? title ?? "新規作成";
  const displaySubtitle = preset?.description ?? subtitle;

  // サムネイルURL
  const thumbnailUrl = preset?.thumbnail
    ? `/mapping-preset/${preset.id}/${preset.thumbnail}`
    : null;

  // タイプに応じたアイコン（サムネイルがない場合）
  const displayIcon = icon ?? (
    preset?.type === "font" ? <LuType size={24} /> :
    preset?.type === "image" ? <LuImage size={24} /> :
    <LuPlus size={24} />
  );

  return (
    <Card.Root
      variant="outline"
      cursor="pointer"
      onClick={onClick}
      borderColor={isActive ? "blue.500" : undefined}
      borderWidth={isActive ? 2 : 1}
      _hover={{ borderColor: "blue.400" }}
    >
      <Card.Body>
        <VStack gap={2}>
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={displayTitle}
              height="32px"
              objectFit="contain"
            />
          ) : (
            displayIcon
          )}
          <Text fontWeight="medium" textAlign="center">{displayTitle}</Text>
          {displaySubtitle && (
            <Text fontSize="xs" color="gray.500" textAlign="center">
              {displaySubtitle}
            </Text>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
