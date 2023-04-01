import { useState, useEffect } from 'react';
import { useMetaMask } from 'metamask-react';
import { Box, Text, useColorModeValue, Avatar, HStack } from '@chakra-ui/react';
import { getImagesByOwningUser, getImagesByAssignedUser } from "../contractMethods";
import ImageCard from "../components/ImageCard";
import { useLocation } from 'react-router-dom';


const User = () => {
  const { status, account, balance } = useMetaMask();

  const [ownImages, setOwnImages] = useState([]);
  const [assignedImages, setAssignedImages] = useState([]);

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const accountUser = pathSegments.pop();

  useEffect(() => {
    getImagesByOwningUser(accountUser).then((d) => setOwnImages(d))
    getImagesByAssignedUser(accountUser).then((d) => setAssignedImages(d))
  }, [accountUser]);

  return (

    <Box p={6} boxShadow="md" rounded="md"
      bgColor={useColorModeValue("white", "gray.900")}
    >
      <Avatar alt="Profile avatar" rounded="full" boxSize="150px" />
      <Text fontSize="2xl" fontWeight="bold" mt={4}>
        Account
      </Text>
      <Text fontSize="lg" color="gray.500">
        {accountUser}
      </Text>
      <Text fontSize="lg" color="green.500">
        {balance}
      </Text>
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
