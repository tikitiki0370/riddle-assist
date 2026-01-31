import { Collapsible, Stack, Table } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

const calenderData = [
  { num: 1, month: "1月", oldName: "睦月", en: "January", enShort: "Jan" },
  { num: 2, month: "2月", oldName: "如月", en: "February", enShort: "Feb" },
  { num: 3, month: "3月", oldName: "弥生", en: "March", enShort: "Mar" },
  { num: 4, month: "4月", oldName: "卯月", en: "April", enShort: "Apr" },
  { num: 5, month: "5月", oldName: "皐月", en: "May", enShort: "May" },
  { num: 6, month: "6月", oldName: "水無月", en: "June", enShort: "Jun" },
  { num: 7, month: "7月", oldName: "文月", en: "July", enShort: "Jul" },
  { num: 8, month: "8月", oldName: "葉月", en: "August", enShort: "Aug" },
  { num: 9, month: "9月", oldName: "長月", en: "September", enShort: "Sep" },
  { num: 10, month: "10月", oldName: "神無月", en: "October", enShort: "Oct" },
  { num: 11, month: "11月", oldName: "霜月", en: "November", enShort: "Nov" },
  { num: 12, month: "12月", oldName: "師月", en: "December", enShort: "Dec" },
];

export default function CalenderTable() {
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
        月の名前
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Stack>
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                {calenderData.map((c) => (
                  <Table.ColumnHeader key={c.num} textAlign="center">
                    {c.num}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                {calenderData.map((c) => (
                  <Table.Cell key={c.num} textAlign="center">
                    {c.month}
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                {calenderData.map((c) => (
                  <Table.Cell key={c.num} textAlign="center">
                    {c.oldName}
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                {calenderData.map((c) => (
                  <Table.Cell key={c.num} textAlign="center">
                    {c.en}
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                {calenderData.map((c) => (
                  <Table.Cell key={c.num} textAlign="center">
                    {c.enShort}
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
