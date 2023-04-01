import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const data = {
  imageURL: 'https://i.kinja-img.com/gawker-media/image/upload/c_fit,f_auto,g_center,q_60,w_645/f6417001e9235e4eb2ff52939d113bad.jpg',
  name: 'Francisco AI',
  id: 1,
};



function ImageCard() {

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
        navigate(`/image/${data.id}`);
      }
      }
    >


      <Image
        src={data.imageURL}
        alt={`Picture of ${data.name}`}
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
            {data.name}
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