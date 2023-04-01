import { useState, useEffect } from 'react';
import { useMetaMask } from 'metamask-react';
import { Box, Text, useColorModeValue, Avatar, HStack } from '@chakra-ui/react';
import { getImagesByOwningUser, getImagesByAssignedUser } from "../contractMethods";
import ImageCard from "../components/ImageCard";


const ProfileView = () => {
  const { status, account, balance } = useMetaMask();

  const [ownImages, setOwnImages] = useState([]);
  const [assignedImages, setAssignedImages] = useState([]);

  useEffect(() => {
    getImagesByOwningUser(account).then((d) => setOwnImages(d))
    getImagesByAssignedUser(account).then((d) => setAssignedImages(d))
  }, [account]);

  return (
    <Box p={6} boxShadow="md" rounded="md"
      bgColor={useColorModeValue("white", "gray.900")}
    >
      <Avatar alt="Profile avatar" rounded="full" boxSize="150px" />
      <Text fontSize="2xl" fontWeight="bold" mt={4}>
        Account
      </Text>
      <Text fontSize="lg" color="gray.500">
        {account}
      </Text>
      <Text fontSize="lg" color="green.500">
        {balance}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" mt={4}>
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
