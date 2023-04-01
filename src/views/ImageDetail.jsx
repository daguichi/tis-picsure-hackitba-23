import { Box, Button, Heading, Image, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { TiTick, TiCancel } from "react-icons/ti";
const data = {
  imageURL: 'https://i.kinja-img.com/gawker-media/image/upload/c_fit,f_auto,g_center,q_60,w_645/f6417001e9235e4eb2ff52939d113bad.jpg',
  name: 'Francisco AI',
  id: 1,
  valid: true,
  validness: 0.9,
};


const ImageDetail = () => {

  const noOfVoters = 100;

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
        borderColor={data.validness > 0.5 ? 'green.500' : 'red.500'}
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
        <Button leftIcon={<TiTick />} colorScheme='blue' mr={3} onClick={() => console.log('accept')}>
          Valid
        </Button>
        <Button leftIcon={<TiCancel />} colorScheme='red' onClick={() => console.log('Invalid')}>
          Invalid
        </Button>
      </Box>
      <Box>
        <Heading>Voted by {noOfVoters} persons</Heading>
        <VStack>
          <Text>Valid: {Math.round(noOfVoters * data.validness, 2)}</Text>
          <Text>Invalid: {Math.round(noOfVoters * (1 - data.validness), 2)}</Text>
        </VStack>

      </Box>
    </VStack>
  );
}

export default ImageDetail;