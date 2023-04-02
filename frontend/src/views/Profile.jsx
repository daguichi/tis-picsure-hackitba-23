import { useState, useEffect } from 'react';
import { useMetaMask } from 'metamask-react';
import { Box, Text, useColorModeValue, Avatar, HStack, VStack } from '@chakra-ui/react';
import { getImagesByOwningUser, getImagesByAssignedUser, getUserByAddress } from "../contractMethods";
import ImageCard from "../components/ImageCard";
import { getProfilePicture } from '../utils';


const ProfileView = () => {
  const { status, account, balance } = useMetaMask();

  const [userData, setUserData] = useState([]);
  const [ownImages, setOwnImages] = useState([]);
  const [assignedImages, setAssignedImages] = useState([]);

  useEffect(() => {
    getUserByAddress(account).then((d) => setUserData(d))
    getImagesByOwningUser(account).then((d) => setOwnImages(d))
    getImagesByAssignedUser(account).then((d) => setAssignedImages(d))
  }, [account]);

  return (
    <Box p={6} boxShadow="md" rounded="md"
      bgColor={useColorModeValue("white", "gray.900")}
    >
      <HStack mt={4}>
        <Avatar src={getProfilePicture(account)} alt="Profile avatar" rounded="full" boxSize="150px" />
        <VStack justifyContent="left" ml={16}>
          <Text fontSize="2xl" fontWeight="bold">
            Vitalik Butherin
          </Text>
          <HStack>
            <Text fontSize="2xl">Account:</Text>
            <Text fontSize="lg" color="gray.500">{account}</Text>
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

      <Text fontSize="2xl" fontWeight="bold" mt={8}>
        Your uploaded images
      </Text>
      <HStack spacing={4} justifyContent="center">
        {ownImages.map(image => (
          <ImageCard key={image.url} description={image.description} url={image.url}/>
        ))}
      </HStack>
      <Text fontSize="2xl" fontWeight="bold" mt={4}>
        Your assigned images
      </Text>
      <HStack spacing={4} justifyContent="center">
        {assignedImages.map(image => (
          <ImageCard key={image.url} description={image.description} url={image.url}/>
        ))}
      </HStack>
    </Box>
  );
};

export default ProfileView;
