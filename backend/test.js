import Web3 from 'web3';
import contractABI from './contractABI.json';

const web3 = new Web3(window.ethereum);
const contractAddress = '0x546425F93D5652a8fc747E5CC61DDa04258cfbb0';
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function callSmartContractFunction() {
  const accounts = await window.ethereum.enable();
  const account = accounts[0];

  const result = await contract.methods.getAllUsers().call({ from: account });

  console.log(result);
}

async function sendTransactionToSmartContract() {
  const accounts = await window.ethereum.enable();
  const account = accounts[0];

  // send a transaction to the smart contract
  const result = await contract.methods.myFunction(param1, param2).send({ from: account });

  console.log(result);
}

callSmartContractFunction()