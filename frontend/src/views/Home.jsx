import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ImageCard from "../components/ImageCard";
import SearchBar from "../components/SearchBar";
import Web3 from 'web3';
import { useMetaMask } from "metamask-react";
import contractABI from '../MainContract.json'
import { getAllUsers, registerUser } from "../contractMethods";
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
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function getImages() {
      const images = await getImages();
      setImages(images);
    }
    getImages();
  }, []);

  return (
    <>
      <SearchBar />
      {
        images.length === 0 ? <Text>No images found</Text> :
          <HStack spacing={4} justifyContent="center">
            {images.map(image => (
              // key={image.id} image={image}
              <ImageCard  />
            ))}
          </HStack>

      }
      
    </>
  );
}

// async function getAllUsers() {
//   // const web3 = new Web3(window.ethereum);
//   // const contractAddress = '0x546425F93D5652a8fc747E5CC61DDa04258cfbb0';
//   // const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

//   // const accounts = await window.ethereum.enable();
//   // const account = accounts[0];
//   // console.log(account)
//   // // call a function on the smart contract
//   // const result = await contract.methods.getAllUsers().call({ from: account });
//   // console.log(result)
//   // return result;


// }



async function sendTransactionToSmartContract() {
  // const web3 = new Web3(window.ethereum);
  // const contractAddress = '0x546425F93D5652a8fc747E5CC61DDa04258cfbb0';
  // const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

  // const accounts = await window.ethereum.enable();
  // const account = accounts[0];
  // // send a transaction to the smart contract
  // const result = await contract.methods.myFunction().send({ from: account });

  // console.log(result);
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
  const { status } = useMetaMask();
  const [users, setUsers] = useState([]);

  const handleGetAllUsers = async () => {
    const result = await getAllUsers();
    console.log(result)
    setUsers(result);
  };

  const handleRegister = async () => {
    const result = await registerUser();
    console.log(result)
  };


  return (
    <VStack justify="center" spacing={10}>
      <MetamaskStatus />
      <Button onClick={handleGetAllUsers}>Get All users</Button>
      <Button onClick={handleRegister}>Register</Button>
      <ul>
        {users.map(user => (
          <li key={user}>{user}</li>
        ))}
      </ul>
      {/* <AddGanacheNetwork /> */}
      {
        status === "connected" ? <ConnectedView /> : <></>
      }
    </VStack>
  );
};

export default Home;
