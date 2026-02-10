import { Collapsible, Stack, Table } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

const MAX_COLUMNS = 10;

function chunkColumns(rows: string[][], size: number): string[][][] {
	const colCount = rows[0]?.length ?? 0;
	if (colCount <= size) return [rows];
	const chunks: string[][][] = [];
	for (let start = 0; start < colCount; start += size) {
		const chunk = rows.map((row) => row.slice(start, start + size));
		const pad = size - chunk[0].length;
		if (pad > 0) {
			for (const row of chunk) {
				row.push(...Array<string>(pad).fill(""));
			}
		}
		chunks.push(chunk);
	}
	return chunks;
}

type Props = {
	title: string;
	rows: string[][];
};

export default function CheatSheetTable({ title, rows }: Props) {
	const chunks = chunkColumns(rows, MAX_COLUMNS);

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
					{chunks.map((chunk, chunkIdx) => {
						const [header, ...body] = chunk;
						return (
							<Table.ScrollArea key={chunkIdx}>
								<Table.Root size="sm" variant="outline" tableLayout="fixed">
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
						);
					})}
				</Stack>
			</Collapsible.Content>
		</Collapsible.Root>
	);
}
