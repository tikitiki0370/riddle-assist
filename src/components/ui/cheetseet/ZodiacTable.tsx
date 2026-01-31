import { Collapsible, Stack, Table } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

const zodiacData = [
  { num: 1, kanji: "子", reading: "ねずみ" },
  { num: 2, kanji: "丑", reading: "うし" },
  { num: 3, kanji: "寅", reading: "とら" },
  { num: 4, kanji: "卯", reading: "うさぎ" },
  { num: 5, kanji: "辰", reading: "たつ" },
  { num: 6, kanji: "巳", reading: "へび" },
  { num: 7, kanji: "午", reading: "うま" },
  { num: 8, kanji: "未", reading: "ひつじ" },
  { num: 9, kanji: "申", reading: "さる" },
  { num: 10, kanji: "酉", reading: "とり" },
  { num: 11, kanji: "戌", reading: "いぬ" },
  { num: 12, kanji: "亥", reading: "いのしし" },
];

export default function ZodiacTable() {
  return (
    <Collapsible.Root defaultOpen w="100%">
      <Collapsible.Trigger
        paddingY="3"
        display="flex"
        gap="2"
        alignItems="center"
      >
        <Collapsible.Indicator
          transition="transform 0.2s"
          _open={{ transform: "rotate(90deg)" }}
        >
          <LuChevronRight />
        </Collapsible.Indicator>
        十二支
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Stack>
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                {zodiacData.map((z) => (
                  <Table.ColumnHeader key={z.num} textAlign="center">
                    {z.num}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                {zodiacData.map((z) => (
                  <Table.Cell key={z.num} textAlign="center">
                    {z.kanji}
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                {zodiacData.map((z) => (
                  <Table.Cell key={z.num} textAlign="center">
                    {z.reading}
                  </Table.Cell>
                ))}
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
