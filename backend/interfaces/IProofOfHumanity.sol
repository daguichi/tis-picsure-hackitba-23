pragma solidity ^0.6.0;

interface IProofOfHumanity {

    function isRegistered(address _address) external view returns (bool);

}