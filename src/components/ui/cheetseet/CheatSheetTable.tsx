import { Collapsible, Stack, Table } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

type Props = {
	title: string;
	rows: string[][];
};

export default function CheatSheetTable({ title, rows }: Props) {
	const [header, ...body] = rows;

	return (
		<Collapsible.Root w="100%">
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
				{title}
			</Collapsible.Trigger>
			<Collapsible.Content>
				<Stack>
					<Table.ScrollArea>
					<Table.Root size="sm" variant="outline">
						<Table.Header>
							<Table.Row>
								{header.map((cell, i) => (
									<Table.ColumnHeader key={i} textAlign="center">
										{cell}
									</Table.ColumnHeader>
								))}
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{body.map((row, rowIdx) => (
								<Table.Row key={rowIdx}>
									{row.map((cell, cellIdx) => (
										<Table.Cell key={cellIdx} textAlign="center">
											{cell}
										</Table.Cell>
									))}
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
					</Table.ScrollArea>
				</Stack>
			</Collapsible.Content>
		</Collapsible.Root>
	);
}
