import { Box, Heading, Image, Text, useColorModeValue, VStack } from "@chakra-ui/react";

const data = {
  imageURL: 'https://i.kinja-img.com/gawker-media/image/upload/c_fit,f_auto,g_center,q_60,w_645/f6417001e9235e4eb2ff52939d113bad.jpg',
  name: 'Francisco AI',
  id: 1,
  valid: true,
  validness: 0.9,
};


const ImageDetail = () => {
  return (
    <VStack>
      <Box
        bgColor={useColorModeValue("white", "gray.900")}
        rounded="lg"
        p={8}
        boxShadow="lg"
        w="70%"
        alignItems={'center'}
        justifyContent={'center'}
        display={'flex'}
        flexDirection={'column'}
        gap={6}
        borderColor={data.valid ? 'green.500' : 'red.500'}
        borderWidth={'2px'}
      >
        <Heading alignSelf={'center'}>El Papa AI</Heading>
        <Image
          src={data.imageURL}
          alt={`Picture of ${data.name}`}
          roundedTop="lg"
        />
        <Text fontSize={'2xl'}>{data.validness * 100}% Valid</Text>
      </Box>
      <Box>

      </Box>
    </VStack>
  );
}

export default ImageDetail;