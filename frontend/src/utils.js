import Web3 from 'web3';
export const getProfilePicture = (account) => {
  const hash = Web3.utils.toHex(account);
  return `https://robohash.org/${hash}.png?set=robohash`;
}

