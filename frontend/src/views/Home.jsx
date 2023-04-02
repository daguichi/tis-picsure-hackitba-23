import { Button, Divider, Heading, HStack, Text, VStack, Wrap } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ImageCard from "../components/ImageCard";
import SearchBar from "../components/SearchBar";
import { useMetaMask } from "metamask-react";
import { getAllImages, getAllUsers, registerUser } from "../contractMethods";
import MetamaskStatus from "../MetamaskStatus";


function ConnectedView() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getAllImages().then((d) => setImages(d))
  }, []);

  return (
    <>
      <Divider my={4} />
      <Heading>Latest images 📷</Heading>
      {/* <SearchBar /> */}
      {
        images.length === 0
          ? <Text>No images found</Text>
          : <Wrap spacing={4} justifyContent="center">
            {images.map(image => (
              <ImageCard key={image.url} description={image.description} url={image.url} />
            ))}
          </Wrap>

      }

    </>
  );
}



const Home = () => {
  const { status } = useMetaMask();
  const [users, setUsers] = useState([]);
  const { account } = useMetaMask();
  const [registered, setRegistered] = useState(false);

  const handleGetAllUsers = async () => {
    const result = await getAllUsers();
    console.log(result)
    setUsers(result);
  };

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
    <VStack justify="center" spacing={10}>
      <MetamaskStatus />
      {/* <Button onClick={handleGetAllUsers}>Get All users</Button> */}
      {
        registered ? <Text>You are already registered!</Text> : <Button onClick={handleRegister}>Register</Button>
      }
      <ul>
        {users.map(user => (
          <li key={user}>{user}</li>
        ))}
      </ul>
      {
        status === "connected" ? <ConnectedView /> : <></>
      }
    </VStack>
  );
};

export default Home;
