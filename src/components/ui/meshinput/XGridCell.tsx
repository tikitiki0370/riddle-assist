"use client";
import { Box } from "@chakra-ui/react";

interface XGridCellProps {
  chars: string[];  // [上, 右, 下, 左] の4文字
  showDot: boolean;
  onCellClick: (char: string) => void;
}

export default function XGridCell({ chars, showDot, onCellClick }: XGridCellProps) {
  // 井型グリッド（60px × 3 = 180px）と同じサイズ
  const size = 180;
  const half = size / 2;

  // X字で分割された4つの三角形
  const triangles = [
    {
      // 上三角形
      points: `0,0 ${size},0 ${half},${half}`,
      labelX: half,
      labelY: 30,
      dotX: half,
      dotY: half - 25,
    },
    {
      // 右三角形
      points: `${size},0 ${size},${size} ${half},${half}`,
      labelX: size - 30,
      labelY: half,
      dotX: half + 25,
      dotY: half,
    },
    {
      // 下三角形
      points: `${size},${size} 0,${size} ${half},${half}`,
      labelX: half,
      labelY: size - 30,
      dotX: half,
      dotY: half + 25,
    },
    {
      // 左三角形
      points: `0,${size} 0,0 ${half},${half}`,
      labelX: 30,
      labelY: half,
      dotX: half - 25,
      dotY: half,
    },
  ];

  return (
    <Box position="relative" w={`${size}px`} h={`${size}px`}>
      <svg width={size} height={size}>
        {/* X線 */}
        <line x1="0" y1="0" x2={size} y2={size} stroke="currentColor" strokeWidth="2" />
        <line x1={size} y1="0" x2="0" y2={size} stroke="currentColor" strokeWidth="2" />

        {/* クリック可能エリア */}
        {triangles.map((tri, index) => (
          <g key={index}>
            <polygon
              points={tri.points}
              fill="transparent"
              cursor="pointer"
              onClick={() => onCellClick(chars[index])}
              style={{ transition: "fill 0.1s" }}
              onMouseEnter={(e) => (e.currentTarget.style.fill = "rgba(128,128,128,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.fill = "transparent")}
            />
            {/* 文字 */}
            <text
              x={tri.labelX}
              y={tri.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
              fontWeight="500"
              fill="currentColor"
              pointerEvents="none"
            >
              {chars[index]}
            </text>
            {/* 点（中央に向かう方向） */}
            {showDot && (
              <circle
                cx={tri.dotX}
                cy={tri.dotY}
                r="4"
                fill="currentColor"
                pointerEvents="none"
              />
            )}
          </g>
        ))}
      </svg>
    </Box>
  );
}
