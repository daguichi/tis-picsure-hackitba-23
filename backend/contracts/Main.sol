pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

interface IProofOfHumanity {
    function isRegistered(address _address) external view returns (bool);
}

contract MyContract {

    struct Comment {
        address user;
        string text;
    }

    struct Image {
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
        uint reputation;
        uint tokens;
    }

    enum Vote {POSITIVE, NEGATIVE}

    /* ---------------------------------- CONSTANTS ---------------------------------- */

    address public proofOfHumanityAddress = 0xC5E9dDebb09Cd64DfaCab4011A0D5cEDaf7c9BDb;
    IProofOfHumanity public proofOfHumanity = IProofOfHumanity(proofOfHumanityAddress);

    uint constant ASSIGNED_VOTERS = 10;

    uint constant MAX_VOTERS = 5;

    uint constant PUBLISH_COST = 1;

    uint constant VOTE_COST = 1;

    uint constant VERIFY_REWARD = 2;

    uint constant STARTING_TOKENS = 5;

    /* ---------------------------------- VARIABLES ---------------------------------- */

    address contractAddress;

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

    /* ---------------------------------- AUTHENTICATION ---------------------------------- */

    function _validateIdentity(address _user) private pure returns (bool) {
        return true;
        // return proofOfHumanity.isRegistered(msg.sender)
    }

    function registerUser() public {
        require(!arrayContains(usersAddresses, msg.sender), "User is already registered");
        
        require(_validateIdentity(msg.sender), "User is not registered on Proof of Humanity.");
        
        usersAddresses.push(msg.sender);

        users[msg.sender].tokens = STARTING_TOKENS;
    }

    /* ---------------------------------- LISTING ---------------------------------- */

    function getAllImages() public view returns (string[] memory) {
        return imageUrls;
    }

    function getImageByUrl(string memory _url) public view returns (Image memory) {
        return images[_url];
    }

    /* ---------------------------------- VOTING ---------------------------------- */

    function getMyAssignations() public view returns (string[] memory) {
        string[] memory result = new string[](imageUrls.length);

        uint count = 0;
        for (uint i = 0; i < imageUrls.length; i++)
            if (arrayContains(images[imageUrls[i]].assignedVoters, msg.sender))
                result[count++] = imageUrls[i];

        string[] memory finalResult = new string[](count);
        for (uint256 i = 0; i < count; i++)
            finalResult[i] = result[i];

        return finalResult;
    }

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
            closeVotation(_url);
    }

    function closeVotation(string memory _url) public {
        require(images[_url].owner == msg.sender || images[_url].owner == address(this), "Not image owner");

        images[_url].isVotationOpen = false;

        bool imageIsTrue = images[_url].positiveVotes.length > images[_url].negativeVotes.length;

        for (uint i = 0; i < images[_url].positiveVotes.length; i++) {
            address voterAdd = images[_url].positiveVotes[i];
            users[voterAdd].tokens += imageIsTrue ? VERIFY_REWARD : 0;
        }

        for (uint i = 0; i < images[_url].negativeVotes.length; i++) {
            address voterAdd = images[_url].positiveVotes[i];
            users[voterAdd].tokens += !imageIsTrue ? VERIFY_REWARD : 0;
        }
    }

    /* ---------------------------------- COMMENTING ---------------------------------- */

    function commentImage(string memory _url, string memory _comment) public {
        require(images[_url].assignedVoters.length != 0, "Image doesnt exist");

        require(images[_url].isVotationOpen, "Voting closed");
        
        images[_url].comments.push(Comment(msg.sender, _comment));
    }    

    /* ---------------------------------- PUBLISHING ---------------------------------- */

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
        
        images[_url].owner = msg.sender;
        images[_url].description = _desc;
        images[_url].uploadDate = block.timestamp;
        images[_url].isVotationOpen = true;
        images[_url].assignedVoters = _getRandomSubset(usersAddresses, ASSIGNED_VOTERS);
    }

}
