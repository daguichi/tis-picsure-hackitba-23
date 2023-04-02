import Web3 from 'web3';
import contractABI from './MainContract.json';

const web3 = new Web3(window.ethereum);
const contractAddress = '0xAE055c3d16Fd9e135793458286FcA8f20417C924';
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

export const getAllUsers = async () => {
  return await contract.methods.getAllUsers().call();
}

export const  registerUser = async () => {
  try {
    const accounts = await window.ethereum.enable();
    const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
    const result = await contract.methods.registerUser().send({ from: accounts[0] });
    console.log(result);
    return result
  } catch (error) {
    console.error(error);
  }
}

export const getUserByAddress = async (address) => {
  return await contract.methods.getUserByAddress(address).call();
}

export const getAllImages = async () => {
  return await contract.methods.getAllImages().call();
}

export const getImageByUrl = async (url) => {
  return await contract.methods.getImageByUrl(url).call();
}

export const getImagesByOwningUser = async (address) => {
  return await contract.methods.getImagesByOwningUser(address).call();
}

export const getImagesByAssignedUser = async (address) => {
  return await contract.methods.getImagesByAssignedUser(address).call();
}

export const getUserAssignations = async (address) => {
  return await contract.methods.getUserAssignations().call();
}

export const voteImage = async (url, vote) => {
  const accounts = await window.ethereum.enable();
  const account = accounts[0];

  return await contract.methods.voteImage(url, vote).send({ from: account });
}

export const commentImage = async (url, comment) => {
  const accounts = await window.ethereum.enable();
  const account = accounts[1];

  await contract.methods.commentImage(url, comment).send({ from: account });
}

export const publishImage = async (url, desc) => {
  const accounts = await window.ethereum.enable();
  const account = accounts[0];
  console.log('sending from ', account)
  return await contract.methods.publishImage(url, desc).send({ from: account });
}
