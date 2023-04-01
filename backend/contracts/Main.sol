pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "../interfaces/IProofOfHumanity.sol";

contract MainContract {

    struct Comment {
        address user;
        string text;
    }

    struct Image {
        string url;
        address owner;
        string description;
        uint uploadDate;
        bool isVotationOpen;
        address[] assignedVoters;
        address[] positiveVotes;
        address[] negativeVotes;
        Comment[] comments;
    }

    struct User {
        address _address;
        uint wins;
        uint tokens;
    }

    enum Vote {POSITIVE, NEGATIVE}

    /* ---------------------------------- CONSTANTS ---------------------------------- */

    uint constant ASSIGNED_VOTERS = 10;

    uint constant MAX_VOTERS = 5;

    uint constant PUBLISH_COST = 1;

    uint constant VOTE_COST = 1;

    uint constant VERIFY_REWARD = 2;

    uint constant STARTING_TOKENS = 1000;

    /* ---------------------------------- VARIABLES ---------------------------------- */

    IProofOfHumanity public proofOfHumanity;

    address ownerAddress;

    address[] private usersAddresses;

    mapping(address => User) private users;

    string[] private imageUrls;

    mapping(string => Image) private images;


    /* ---------------------------------- GENERIC FUNCTIONS ---------------------------------- */

    function arrayContains(address[] memory array, address value) private pure returns (bool) {
        for (uint256 i = 0; i < array.length; i++)
            if (array[i] == value)
                return true;
        return false;
    }

    constructor(address _pohAddress) public {
        proofOfHumanity = IProofOfHumanity(_pohAddress);
        ownerAddress = msg.sender;
    }

    /* ---------------------------------- AUTHENTICATION ---------------------------------- */

    function _validateIdentity(address _user) private view returns (bool) {
        return proofOfHumanity.isRegistered(_user);
    }

    function registerUser() public {
        require(!arrayContains(usersAddresses, msg.sender), "User is already registered");
        
        require(_validateIdentity(msg.sender), "User is not registered on Proof of Humanity.");
        
        usersAddresses.push(msg.sender);

        users[msg.sender]._address = msg.sender;
        users[msg.sender].tokens = STARTING_TOKENS;
        users[msg.sender].wins = 0;
    }

    /* ---------------------------------- USER LISTING ---------------------------------- */

    function getAllUsers() public view returns (User[] memory) {
        User[] memory finalResult = new User[](usersAddresses.length);

        for (uint256 i = 0; i < usersAddresses.length; i++)
            finalResult[i] = users[usersAddresses[i]];
        
        return finalResult;
    }

    function getUserByAddress(address _address) public view returns (User memory) {
        return users[_address];
    }    

    /* ---------------------------------- IMAGE LISTING ---------------------------------- */

    function getAllImages() public view returns (Image[] memory) {
        Image[] memory finalResult = new Image[](imageUrls.length);

        for (uint256 i = 0; i < imageUrls.length; i++)
            finalResult[i] = images[imageUrls[i]];
        
        return finalResult;
    }

    function getImagesByOwningUser(address _address) public view returns (Image[] memory) {
        string[] memory result = new string[](imageUrls.length);

        uint count = 0;
        for (uint i = 0; i < imageUrls.length; i++)
            if (images[imageUrls[i]].owner == _address)
                result[count++] = imageUrls[i];

        Image[] memory finalResult = new Image[](count);
        for (uint256 i = 0; i < count; i++)
            finalResult[i] = images[result[i]];

        return finalResult;
    }

    function getImagesByAssignedUser(address _address) public view returns (Image[] memory) {
        string[] memory result = new string[](imageUrls.length);

        uint count = 0;
        for (uint i = 0; i < imageUrls.length; i++)
            if (arrayContains(images[imageUrls[i]].assignedVoters, _address))
                result[count++] = imageUrls[i];

        Image[] memory finalResult = new Image[](count);
        for (uint256 i = 0; i < count; i++)
            finalResult[i] = images[result[i]];

        return finalResult;
    }

    function getImageByUrl(string memory _url) public view returns (Image memory) {
        return images[_url];
    }

    /* ---------------------------------- IMAGE VOTING ---------------------------------- */

    function voteImage(string memory _url, Vote _vote) public {
        require(images[_url].assignedVoters.length != 0, "Image doesnt exist");

        require(arrayContains(images[_url].assignedVoters, msg.sender), "Voter not allowed");

        require(!arrayContains(images[_url].positiveVotes, msg.sender) && !arrayContains(images[_url].negativeVotes, msg.sender),
             "Already voted");

        require(images[_url].isVotationOpen, "Voting closed");

        require(users[msg.sender].tokens > VOTE_COST, "Not enough tokens");

        users[msg.sender].tokens -= VOTE_COST;
        
        if(_vote == Vote.POSITIVE)
            images[_url].positiveVotes.push(msg.sender);
        else
            images[_url].negativeVotes.push(msg.sender);

        if(images[_url].positiveVotes.length + images[_url].negativeVotes.length == MAX_VOTERS)
            _closeVotation(_url);
    }

    function _closeVotation(string memory _url) public {
        images[_url].isVotationOpen = false;

        bool imageIsTrue = images[_url].positiveVotes.length > images[_url].negativeVotes.length;

        for (uint i = 0; i < images[_url].positiveVotes.length; i++) {
            address voterAdd = images[_url].positiveVotes[i];
            if(imageIsTrue) {
                users[voterAdd].tokens += VERIFY_REWARD;
                users[voterAdd].wins += 1;
            }
        }

        for (uint i = 0; i < images[_url].negativeVotes.length; i++) {
            address voterAdd = images[_url].positiveVotes[i];
            if(!imageIsTrue) {
                users[voterAdd].tokens += VERIFY_REWARD;
                users[voterAdd].wins += 1;
            }
        }
    }

    /* ---------------------------------- IMAGE COMMENTING ---------------------------------- */

    function commentImage(string memory _url, string memory _comment) public {
        require(images[_url].assignedVoters.length != 0, "Image doesnt exist");

        require(images[_url].isVotationOpen, "Voting closed");
        
        images[_url].comments.push(Comment(msg.sender, _comment));
    }    

    /* ---------------------------------- IMAGE PUBLISHING ---------------------------------- */

    function _getRandomSubset(address[] memory array, uint n) private view returns (address[] memory) {
        address[] memory subset = new address[](n);
        uint rand = uint(keccak256(abi.encode(block.timestamp, block.difficulty))) % array.length;

        for (uint i = 0; i < n; i++)
            subset[i] = array[(i + rand) % array.length];

        return subset;
    }

    function publishImage(string memory _url, string memory _desc) public {
        require(users[msg.sender].tokens > PUBLISH_COST, "Not enough tokens");

        users[msg.sender].tokens -= PUBLISH_COST;

        imageUrls.push(_url);
        
        images[_url].url = _url;
        images[_url].owner = msg.sender;
        images[_url].description = _desc;
        images[_url].uploadDate = block.timestamp;
        images[_url].isVotationOpen = true;
        images[_url].assignedVoters = _getRandomSubset(usersAddresses, ASSIGNED_VOTERS);
    }

    /* ---------------------------------- TOKEN MANAGEMENT ---------------------------------- */

    function addTokens(address _userAddress, uint amount) public {
        require(msg.sender == ownerAddress, "Only owner can mint tokens");
        users[_userAddress].tokens += amount;
    }

    function transferTokens(address _destinyAddress, uint amount) public {
        require(users[msg.sender].tokens > amount, "Not enough tokens");
        users[msg.sender].tokens -= amount;
        users[_destinyAddress].tokens += amount;
    }

}
