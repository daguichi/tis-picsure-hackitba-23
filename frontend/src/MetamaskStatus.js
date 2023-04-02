import { Button, Text } from "@chakra-ui/react";
import { useMetaMask } from "metamask-react";

const MetamaskStatus = () => {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  if (status === "initializing") return <Text>Synchronisation with MetaMask ongoing...</Text>

  if (status === "unavailable") return <Text>MetaMask not available :(</Text>

  if (status === "notConnected") return <Button onClick={connect}>Connect to MetaMask</Button>

  if (status === "connecting") return <Text>Connecting...</Text>

  if (status === "connected") return <Text>Connected account <b>{account}</b> on chain ID <b>{chainId}</b></Text>

}

export default MetamaskStatus;