import { useState, useEffect } from 'react';
import { useMetaMask } from 'metamask-react';
import { Box, Text, Wrap, useColorModeValue, Avatar, HStack, VStack, Divider, Progress, WrapItem } from '@chakra-ui/react';
import { getImagesByOwningUser, getImagesByAssignedUser, getUserByAddress } from "../contractMethods";
import ImageCard from "../components/ImageCard";
import { useLocation } from 'react-router-dom';
import { getProfilePicture } from '../utils';


const User = () => {
  const { status, account, balance } = useMetaMask();

  const [ownImages, setOwnImages] = useState([]);
  const [assignedImages, setAssignedImages] = useState([]);
  const [userData, setUserData] = useState([]);

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const accountUser = pathSegments.pop();

  useEffect(() => {
    getUserByAddress(accountUser).then((d) => setUserData(d))
    getImagesByOwningUser(accountUser).then((d) => setOwnImages(d))
    getImagesByAssignedUser(accountUser).then((d) => setAssignedImages(d))
  }, [accountUser]);

  return (


    <Box p={6} boxShadow="md" rounded="md"
      bgColor={useColorModeValue("white", "gray.900")}
    >
      <HStack mt={4}>
        <Avatar src={getProfilePicture(account)} alt="Profile avatar" rounded="full" boxSize="150px" />
        <VStack ml={16} alignItems="flex-start">
          <Text fontSize="2xl" fontWeight="bold">
            Vitalik Butherin
          </Text>
          <HStack>
            <Text fontSize="2xl">Cuenta:</Text>
            <Text fontSize="lg" color="gray.500">{accountUser}</Text>
          </HStack>

          <HStack>
            <Text fontSize="2xl">Tokens:</Text>
            <Text fontSize="lg" color="gray.500">{userData.tokens}</Text>
          </HStack>
        </VStack>

      </HStack>
      <Divider my={8} />
      <Text fontSize="3xl" fontWeight="bold" my={8}>
        Reputación del {userData.wins}%
      </Text>
      <Progress colorScheme='green' size='lg' value={userData.wins} mt={8} />
      <Divider my={8} />

      <Text fontSize="3xl" fontWeight="bold" mt={4}>
        Imágenes subidas a votación por el usuario
      </Text>
      <Wrap spacing={4} justifyContent="center" align="center">

        {ownImages.length === 0 ? <Text fontSize="lg" color="gray.500">Sin imágenes</Text>
          :

          ownImages.map(image => (
            <WrapItem key={image.url}>
              <ImageCard key={image.url} description={image.description} url={image.url} />
            </WrapItem>
          ))}
      </Wrap>
      <Text fontSize="3xl" fontWeight="bold" mt={4}>
        Imágenes asignadas al usuario para votar      </Text>
        <Wrap spacing={4} justifyContent="center" align="center">
        {assignedImages.length === 0 ? <Text fontSize="lg" color="gray.500">Sin imágenes</Text>
          :
          assignedImages.map(image => (
            <WrapItem key={image.url}>
              <ImageCard key={image.url} description={image.description} url={image.url} />
            </WrapItem>
          ))}
      </Wrap>
    </Box>
  );
};

export default User;
