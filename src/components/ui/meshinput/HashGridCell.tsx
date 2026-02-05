"use client";
import { Box, Center, Text } from "@chakra-ui/react";

interface HashGridCellProps {
  char: string;
  position: number;
  showDot: boolean;
  onClick: () => void;
}

// 位置に応じた境界線を返す（ピッグペン暗号の形状）
// 0 | 1 | 2
// ---------
// 3 | 4 | 5
// ---------
// 6 | 7 | 8
function getBorders(position: number) {
  const borders = {
    top: false,
    right: false,
    bottom: false,
    left: false,
  };

  // 上の行以外は上線あり
  if (position >= 3) borders.top = true;
  // 下の行以外は下線あり
  if (position <= 5) borders.bottom = true;
  // 左の列以外は左線あり
  if (position % 3 !== 0) borders.left = true;
  // 右の列以外は右線あり
  if (position % 3 !== 2) borders.right = true;

  return borders;
}

// 点の位置を返す（セルの開いている方向 = 中央に向かう方向）
// 0: 右下, 1: 下, 2: 左下
// 3: 右,   4: 下（文字の下）, 5: 左
// 6: 右上, 7: 上, 8: 左上
function getDotPosition(position: number): { top?: string; bottom?: string; left?: string; right?: string } {
  switch (position) {
    case 0: return { bottom: "8px", right: "8px" };      // 右下（中央寄り）
    case 1: return { bottom: "8px", left: "50%" };       // 下中央
    case 2: return { bottom: "8px", left: "8px" };       // 左下（中央寄り）
    case 3: return { top: "50%", right: "8px" };         // 右中央
    case 4: return { bottom: "6px", left: "50%" };       // 下（文字の下）
    case 5: return { top: "50%", left: "8px" };          // 左中央
    case 6: return { top: "8px", right: "8px" };         // 右上（中央寄り）
    case 7: return { top: "8px", left: "50%" };          // 上中央
    case 8: return { top: "8px", left: "8px" };          // 左上（中央寄り）
    default: return { bottom: "8px", left: "50%" };
  }
}

export default function HashGridCell({ char, position, showDot, onClick }: HashGridCellProps) {
  const borders = getBorders(position);
  const dotPos = getDotPosition(position);

  // 点のtransform（中央揃えが必要な場合）
  const needsTranslateX = dotPos.left === "50%";
  const needsTranslateY = dotPos.top === "50%";
  let transform = "";
  if (needsTranslateX && needsTranslateY) {
    transform = "translate(-50%, -50%)";
  } else if (needsTranslateX) {
    transform = "translateX(-50%)";
  } else if (needsTranslateY) {
    transform = "translateY(-50%)";
  }

  return (
    <Box
      w="60px"
      h="60px"
      position="relative"
      cursor="pointer"
      onClick={onClick}
      _hover={{ bg: { base: "gray.100", _dark: "gray.700" } }}
      borderTopWidth={borders.top ? "2px" : 0}
      borderRightWidth={borders.right ? "2px" : 0}
      borderBottomWidth={borders.bottom ? "2px" : 0}
      borderLeftWidth={borders.left ? "2px" : 0}
      borderColor="currentColor"
    >
      {/* 文字 */}
      <Center h="full">
        <Text fontSize="xl" fontWeight="medium">
          {char}
        </Text>
      </Center>

      {/* 点の表示 */}
      {showDot && (
        <Box
          position="absolute"
          top={dotPos.top}
          bottom={dotPos.bottom}
          left={dotPos.left}
          right={dotPos.right}
          transform={transform || undefined}
          w="8px"
          h="8px"
          borderRadius="full"
          bg="currentColor"
          pointerEvents="none"
        />
      )}
    </Box>
  );
}
