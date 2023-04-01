import { Button, HStack, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ImageCard from "../components/ImageCard";
import SearchBar from "../components/SearchBar";
import Web3 from 'web3';

function ConnectButton({ onConnect, connected }) {
  async function connectMetamask() {
    if (window.ethereum) { // Check if Metamask is installed
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" }); // Request connection
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts(); // Get connected account
        console.log("Connected to Metamask account:", accounts[0]);
        // Do something with the connected account

        // Update state to indicate successful connection
        onConnect(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Metamask not installed");
    }
  }

  return (
    <Button colorScheme="teal" onClick={connectMetamask} visibility={connected ? "hidden" : "visible"}>
      Connect Metamask
    </Button>
  );
}

function ConnectedView({ visible }) {
  if (!visible) return null;

  return (
    <>
      <SearchBar />
      <HStack spacing={4} justifyContent="center">
        <ImageCard />
        <ImageCard />
        <ImageCard />
        <ImageCard />
      </HStack>
    </>
  );
}

const Home = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const isMetamaskConnected = localStorage.getItem("isMetamaskConnected");
    if (isMetamaskConnected === "true") {
      setConnected(true);
    }
  }, []);

  function handleConnect(status) {
    setConnected(status);
    localStorage.setItem("isMetamaskConnected", status);
  }

  return (
    <VStack justify="center" spacing={10}>
      <ConnectButton onConnect={handleConnect} connected={connected} />
      <ConnectedView visible={connected} />
    </VStack>
  );
};

export default Home;
