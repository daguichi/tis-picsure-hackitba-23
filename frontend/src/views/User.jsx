import { useState, useEffect } from 'react';
import { useMetaMask } from 'metamask-react';
import { Box, Text, useColorModeValue, Avatar, HStack, VStack } from '@chakra-ui/react';
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
            <Text fontSize="2xl">Account:</Text>
            <Text fontSize="lg" color="gray.500">{accountUser}</Text>
          </HStack>
          <HStack>
            <Text fontSize="2xl">Reputation:</Text>
            <Text fontSize="lg" color="gray.500">{userData.wins}</Text>
          </HStack>
          <HStack>
            <Text fontSize="2xl">Tokens:</Text>
            <Text fontSize="lg" color="gray.500">{userData.tokens}</Text>
          </HStack>
        </VStack>

      </HStack>

      <Text fontSize="2xl" fontWeight="bold" mt={4}>
        Uploaded images
      </Text>
      <HStack spacing={4} justifyContent="center">

        {ownImages.length === 0 ? <Text fontSize="lg" color="gray.500">No images uploaded</Text>
          :

          ownImages.map(image => (
            <ImageCard key={image.url} description={image.description} url={image.url} />
          ))}
      </HStack>
      <Text fontSize="2xl" fontWeight="bold" mt={4}>
        Assigned images
      </Text>
      <HStack spacing={4} justifyContent="center">
        {assignedImages.length === 0 ? <Text fontSize="lg" color="gray.500">No images assigned</Text>
          :
          assignedImages.map(image => (
            <ImageCard key={image.url} description={image.description} url={image.url} />
          ))}
      </HStack>
    </Box>
  );
};

export default User;
