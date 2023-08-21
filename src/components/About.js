import { Box, Flex, Text } from "@chakra-ui/react";

export default function About() {

  return (
    <Flex justify="center" align="center" height="100vh" paddingBottom="200px">
      <Box width="700px">
        <Text fontSize="48px" textShadow="0 5px #000000">
            About
        </Text>
        <Text
            fontSize="16px"
            letterSpacing="-5.5%"
            textShadow="0 2px 2px #000000"
        > Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </Text>
      </Box>
    </Flex>
  );
}

