import CalenderTable from "@/components/ui/cheetseet/CalenderTable";
import ZodiacTable from "@/components/ui/cheetseet/ZodiacTable";
import { Box, Center, Container, Heading, VStack } from "@chakra-ui/react";

export default function CheatSheetPage() {
  return (
    <Box>
      <Center py={10}>
        <Heading>早見表</Heading>
      </Center>
      <Container w={"60vw"}>
        <VStack>
          <ZodiacTable />
          <CalenderTable />
        </VStack>
      </Container>
    </Box>
  );
}
