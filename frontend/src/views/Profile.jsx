import { useState, useEffect } from 'react';
import { useMetaMask } from 'metamask-react';
import { Box, Text, useColorModeValue, Avatar, HStack, VStack, WrapItem, Wrap, Divider, Button, Progress } from '@chakra-ui/react';
import { getImagesByOwningUser, getImagesByAssignedUser, getUserByAddress, registerUser, getAllUsers } from "../contractMethods";
import ImageCard from "../components/ImageCard";
import { getProfilePicture } from '../utils';


const ProfileView = () => {
  const { status, account, balance } = useMetaMask();

  const [userData, setUserData] = useState([]);
  const [ownImages, setOwnImages] = useState([]);
  const [assignedImages, setAssignedImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    getUserByAddress(account).then((d) => setUserData(d))
    getImagesByOwningUser(account).then((d) => setOwnImages(d))
    getImagesByAssignedUser(account).then((d) => setAssignedImages(d))
  }, [account]);

  const handleRegister = async () => {
    const result = await registerUser();
    console.log(result)
  };

  const isRegistered = async () => {
    const registeredMembers = await getAllUsers();
    return registeredMembers.some(member => member._address.toLowerCase() === account.toLowerCase());
  }


  useEffect(() => {
    isRegistered().then((d) => setRegistered(d))
  }, [account]);

  return (
    <Box p={6} boxShadow="md" rounded="md"
      bgColor={useColorModeValue("white", "gray.900")}
    >

      <HStack display={'flex'} justifyItems={'space-between'}>
        {
          registered ? <Text>Ya estás registrado</Text> : <Button onClick={handleRegister}>Registrarme</Button>
        }
      </HStack>
      <Divider my={8} />
      <HStack mt={4}>
        <Avatar src={getProfilePicture(account)} alt="Profile avatar" rounded="full" boxSize="150px" />
        <VStack ml={16} alignItems="flex-start">
          <HStack>
            <Text fontSize="2xl">Cuenta:</Text>
            <Text fontSize="lg" color="gray.500">{account}</Text>
          </HStack>
          <HStack>
            <Text fontSize="2xl">Tokens:</Text>
            <Text fontSize="lg" color="gray.500">{userData.tokens}{'      '}</Text>
            <Button ml={8} colorScheme="blue" size="sm" onClick={() => { }}>Buy</Button>
          </HStack>

        </VStack>


      </HStack>
      <Divider my={8} />
      <Text fontSize="3xl" fontWeight="bold" my={8}>
        Reputación del {userData.wins}%
      </Text>
      <Progress colorScheme='green' size='lg' value={userData.wins} mt={8} />

      <Divider my={8} />
      <Text fontSize="3xl" fontWeight="bold" my={8}>
        Tus imágenes subidas a votación
      </Text>
      <Wrap spacing={4} justifyContent="center" align="center">
        {
          ownImages.length === 0 ? <Text>Sin imágenes</Text> :
            ownImages.map((image) => (
              <WrapItem key={image.url}>
                <ImageCard
                  key={image.url}
                  description={image.description}
                  url={image.url}
                />
              </WrapItem>
            ))}
      </Wrap>
      <Divider my={8} />
      <Text fontSize="3xl" fontWeight="bold" my={8}>
        Imágenes asignadas a votar
      </Text>
      <Wrap spacing={4} justifyContent="center" align="center">
        {
          assignedImages.length === 0 ? <Text>Sin imágenes</Text> :
            assignedImages.map((image) => (
              <WrapItem key={image.url}>
                <ImageCard
                  key={image.url}
                  description={image.description}
                  url={image.url}
                />
              </WrapItem>
            ))}
      </Wrap>

    </Box>
  );
};

export default ProfileView;
