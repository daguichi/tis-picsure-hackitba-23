pragma solidity ^0.6.0;

import "../../interfaces/IProofOfHumanity.sol";

contract ProofOfHumanityMock is IProofOfHumanity {

    function isRegistered(address _address) external view override returns (bool) {
        return true;
    }

    function getName(address _address) external view override returns (string memory) {
        return 'Vitalik Butherin';
    }

}