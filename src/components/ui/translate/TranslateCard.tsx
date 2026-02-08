"use client";
import { Card, Center, Image, Text } from "@chakra-ui/react";
import { LuType, LuImage, LuPlus } from "react-icons/lu";
import { ReactNode } from "react";
import { PresetConfig } from "@/types/translate";

interface TranslateCardProps {
  preset?: PresetConfig;
  title?: string;
  icon?: ReactNode;
  subtitle?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export default function TranslateCard({
  preset,
  title,
  icon,
  subtitle,
  onClick,
  isActive,
}: TranslateCardProps) {
  // プリセットがある場合はその情報を使用
  const displayTitle = preset?.name ?? title ?? "新規作成";
  const displaySubtitle = preset?.description ?? subtitle;

  // サムネイルURL
  const thumbnailUrl = preset?.thumbnail
    ? `/translate-preset/${preset.id}/${preset.thumbnail}`
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
      boxShadow={isActive ? "0 0 0 2px var(--chakra-colors-blue-500)" : undefined}
      _hover={isActive ? undefined : { boxShadow: "0 0 0 1px var(--chakra-colors-gray-400)" }}
      w="140px"
      flexShrink={0}
    >
      <Card.Header p={3} pb={0}>
        <Center h="40px">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={displayTitle}
              h="32px"
              objectFit="contain"
            />
          ) : (
            displayIcon
          )}
        </Center>
      </Card.Header>
      <Card.Body p={3} pt={2}>
        <Text fontWeight="medium" textAlign="center" lineClamp={2} fontSize="sm">
          {displayTitle}
        </Text>
      </Card.Body>
      <Card.Footer p={3} pt={0} h="40px">
        <Text fontSize="xs" color="gray.500" textAlign="center" lineClamp={2} w="full">
          {displaySubtitle || "\u00A0"}
        </Text>
      </Card.Footer>
    </Card.Root>
  );
}
