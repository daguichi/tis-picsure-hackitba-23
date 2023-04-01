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
      cursor={'pointer'}
      _hover={{
        transform: 'scale(1.05)',
        shadow: '2xl',
      }}
      transition="all 0.2s"
      overflow="hidden"
      onClick={() => {
        navigate(`/image/${props.url}`);
      }
      }
    >


      <Image
        src={props.url}
        alt={`Picture of ${props.description}`}
        roundedTop="lg"
      />

      <Box p="6">

        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box
            fontSize="2xl"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated>
            {props.description}
          </Box>

        </Flex>

        <Flex justifyContent="space-between" alignContent="center">
          {/* TODO */}
          <h1>Valid / Not valid</h1>
        </Flex>
      </Box>
    </Box>
  );
}

export default ImageCard;