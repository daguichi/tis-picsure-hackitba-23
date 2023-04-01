pragma solidity ^0.6.0;

import "../../interfaces/IProofOfHumanity.sol";

contract ProofOfHumanityMock is IProofOfHumanity {

    // address[] validatedAddresses = [];

    function arrayContains(address[] memory array, address value) private pure returns (bool) {
        for (uint256 i = 0; i < array.length; i++)
            if (array[i] == value)
                return true;
        return false;
    }

    function isRegistered(address _address) external view override returns (bool) {
        // return arrayContains(validatedAddresses, _address);
        return true;
    }

}