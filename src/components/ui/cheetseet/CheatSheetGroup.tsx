import { Collapsible, VStack } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import type { CheatSheetData } from "@/lib/parseCheatSheet";
import CheatSheetTable from "./CheatSheetTable";

type Props = {
	label: string;
	sheets: CheatSheetData[];
	dataTutorial?: string;
};

export default function CheatSheetGroup({ label, sheets, dataTutorial }: Props) {
	return (
		<Collapsible.Root defaultOpen w="100%">
			<Collapsible.Trigger
				data-tutorial={dataTutorial}
				paddingY="1"
				display="flex"
				gap="2"
				alignItems="center"
				fontSize="lg"
				fontWeight="bold"
			>
				<Collapsible.Indicator
					transition="transform 0.2s"
					_open={{ transform: "rotate(90deg)" }}
				>
					<LuChevronRight />
				</Collapsible.Indicator>
				{label}
			</Collapsible.Trigger>
			<Collapsible.Content>
				<VStack pl="4" gap="0">
					{sheets.map((sheet) => (
						<CheatSheetTable
							key={sheet.title}
							title={sheet.title}
							rows={sheet.rows}
						/>
					))}
				</VStack>
			</Collapsible.Content>
		</Collapsible.Root>
	);
}
