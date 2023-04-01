import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ImageCard from "../components/ImageCard";
import SearchBar from "../components/SearchBar";
import Web3 from 'web3';
import { useMetaMask } from "metamask-react";

// function ConnectButton({ onConnect, connected }) {
//   async function connectMetamask() {
//     if (window.ethereum) { // Check if Metamask is installed
//       try {
//         await window.ethereum.request({ method: "eth_requestAccounts" }); // Request connection
//         const web3 = new Web3(window.ethereum);
//         const accounts = await web3.eth.getAccounts(); // Get connected account
//         console.log(accounts)
//         console.log("Connected to Metamask account:", accounts[0]);
//         // Do something with the connected account

//         // Update state to indicate successful connection
//         onConnect(true);
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       console.log("Metamask not installed");
//     }
//   }

//   return (
//     <Button colorScheme="teal" onClick={connectMetamask} visibility={connected ? "hidden" : "visible"}>
//       Connect Metamask
//     </Button>
//   );
// }

function ConnectedView() {
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

const MetamaskStatus = () => {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  if (status === "initializing") return <div>Synchronisation with MetaMask ongoing...</div>

  if (status === "unavailable") return <div>MetaMask not available :(</div>

  if (status === "notConnected") return <button onClick={connect}>Connect to MetaMask</button>

  if (status === "connecting") return <div>Connecting...</div>

  if (status === "connected") return <div>Connected account {account} on chain ID {chainId}</div>

}

function AddGanacheNetwork() {
  const { addChain } = useMetaMask();
  const gnosisChainNetworkParams = {
    chainId: "0x64",
    chainName: "Gnosis Chain",
    rpcUrls: ["https://rpc.gnosischain.com/"],
    nativeCurrency: {
      name: "xDAI",
      symbol: "xDAI",
      decimals: 18,
    },
    blockExplorerUrls: ["https://blockscout.com/xdai/mainnet/"]
  };
  // Request to add Gnosis chain and then switch to it
  return (
    <button onClick={() => addChain(gnosisChainNetworkParams)}>Add Gnosis chain</button>
  )
}

const Home = () => {
  const {status} = useMetaMask();


  return (
    <VStack justify="center" spacing={10}>
      <MetamaskStatus />
      <AddGanacheNetwork />
      {
        status === "connected" ? <ConnectedView /> : <></>
      }
    </VStack>
  );
};

export default Home;
