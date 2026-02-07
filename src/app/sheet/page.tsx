import CheatSheetGroup from "@/components/ui/cheetseet/CheatSheetGroup";
import { loadCheatSheetGroups } from "@/lib/parseCheatSheet";
import { Box, Center, Container, Heading, VStack } from "@chakra-ui/react";

const groups = loadCheatSheetGroups();

export default function CheatSheetPage() {
	return (
		<Box>
			<Center py={10}>
				<Heading>早見表</Heading>
			</Center>
			<Container w={"70vw"}>
				<VStack data-tutorial="sheet-groups">
					{groups.map((group, index) => (
						<CheatSheetGroup
							key={group.label}
							label={group.label}
							sheets={group.sheets}
							dataTutorial={index === 0 ? "sheet-table-header" : undefined}
						/>
					))}
				</VStack>
			</Container>
		</Box>
	);
}
