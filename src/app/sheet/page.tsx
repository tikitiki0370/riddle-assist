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
				<VStack>
					{groups.map((group) => (
						<CheatSheetGroup
							key={group.label}
							label={group.label}
							sheets={group.sheets}
						/>
					))}
				</VStack>
			</Container>
		</Box>
	);
}
