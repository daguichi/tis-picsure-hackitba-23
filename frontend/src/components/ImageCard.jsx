import {
  Flex,
  Box,
  Image,
  useColorModeValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function ImageCard(props) {
  const navigate = useNavigate();

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      maxW="sm"
      borderWidth="1px"
      rounded="lg"
      shadow="lg"
      position="relative"
      cursor="pointer"
      _hover={{
        transform: 'scale(1.05)',
        shadow: '2xl',
      }}
      transition="all 0.2s"
      overflow="hidden"
      onClick={() => {
        navigate(`/image?url=${encodeURIComponent(props.url)}`);
      }}
    >
      <Image
        src={props.url}
        alt={`Picture of ${props.description}`}
        roundedTop="lg"
        width="100%"
        height="auto"
      />

      <Box p="6" height="auto">
        <Flex
          direction="column"
          justifyContent="space-between"
          alignContent="center"
          height="100%"
        >
          <Box
            fontSize="2xl"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {props.description}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}


export default ImageCard;