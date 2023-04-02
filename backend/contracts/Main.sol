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
        string description;
        address owner;
        uint uploadDate;
        bool isVotationOpen;
        address[] assignedVoters;
        address[] positiveVotes;
        address[] negativeVotes;
        Comment[] comments;
    }

    struct User {
        address _address;
        string name;
        string profilePicUrl;
        uint validatorReputation;
        uint creatorReputation;
        uint tokens;
    }

    enum Vote {POSITIVE, NEGATIVE}

    /* ---------------------------------- CONSTANTS ---------------------------------- */

    uint constant ASSIGNED_VOTERS = 10;

    uint constant MAX_VOTERS = 5;

    uint constant PUBLISH_COST = 1;

    uint constant VOTE_COST = 1;

    uint constant VERIFY_REWARD = 2;

    uint constant STARTING_TOKENS = 10;

    /* ---------------------------------- VARIABLES ---------------------------------- */

    IProofOfHumanity public proofOfHumanity;

    address ownerAddress;

    address[] private usersAddresses;

    mapping(address => User) private users;

    string[] private imageUrls;

    mapping(string => Image) private images;


    /* ---------------------------------- GENERIC FUNCTIONS ---------------------------------- */

    function _arrayContains(address[] memory array, address value) private pure returns (bool) {
        for (uint256 i = 0; i < array.length; i++)
            if (array[i] == value)
                return true;
        return false;
    }

    function _getRandomNumber(uint256 min, uint256 max) public view returns (uint256) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)));
        return min + (random % (max - min + 1));
    }

    function _getRandomSubset(address[] memory array, uint n) private view returns (address[] memory) {
        address[] memory subset = new address[](n);
        uint rand = uint(keccak256(abi.encode(block.timestamp, block.difficulty))) % array.length;

        for (uint i = 0; i < n; i++)
            subset[i] = array[(i + rand) % array.length];

        return subset;
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
        require(!_arrayContains(usersAddresses, msg.sender), "User is already registered");
        
        require(_validateIdentity(msg.sender), "User is not registered on Proof of Humanity.");
        
        usersAddresses.push(msg.sender);

        users[msg.sender]._address = msg.sender;
        users[msg.sender].tokens = STARTING_TOKENS;
        users[msg.sender].name = proofOfHumanity.getName(msg.sender);
        users[msg.sender].profilePicUrl = '';
        users[msg.sender].validatorReputation = 0;
        users[msg.sender].creatorReputation = 0;
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
            if (_arrayContains(images[imageUrls[i]].assignedVoters, _address))
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

        require(_arrayContains(images[_url].assignedVoters, msg.sender), "Voter not allowed");

        require(!_arrayContains(images[_url].positiveVotes, msg.sender) && !_arrayContains(images[_url].negativeVotes, msg.sender),
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
                users[voterAdd].validatorReputation += 1;
            }
        }

        for (uint i = 0; i < images[_url].negativeVotes.length; i++) {
            address voterAdd = images[_url].positiveVotes[i];
            if(!imageIsTrue) {
                users[voterAdd].tokens += VERIFY_REWARD;
                users[voterAdd].validatorReputation += 1;
            }
        }

        users[images[_url].owner].creatorReputation += 1;
    }

    /* ---------------------------------- IMAGE COMMENTING ---------------------------------- */

    function commentImage(string memory _url, string memory _comment) public {
        require(images[_url].assignedVoters.length != 0, "Image doesnt exist");

        require(images[_url].isVotationOpen, "Voting closed");
        
        images[_url].comments.push(Comment(msg.sender, _comment));
    }    

    /* ---------------------------------- IMAGE PUBLISHING ---------------------------------- */

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

    /* ---------------------------------- DEMO FUNCTIONS ---------------------------------- */

    function fillDummyUsers() public {
        require(msg.sender == ownerAddress, "Not allowed");

        usersAddresses = [0x335c33Cfd1bB79B09946EF25EB99Cb0f9BA8980c,0x81Ffa73300Aa2c025d576711363b7466DFecd942,0xa8b505C0C47f44FA9B520F8B9eC68D843cBD9fB0,0x9c7A2Af7a9CBcB642D9F10F38DB9dc0C306F5fdB,0xE741FB345D935D47B876555b2f19280345C58b77,0xB8a69D9292e22194824225784d8521e3e0929d84,0xb4934B4Fd74d3877DFfe8e3dBb2b6f659EEBa323,0x1a26F4C6693a01c14e93A26220544D0e17dB5B2A,0x534505EdCa429fF8244DfD20bf6c4Aae61B3dC00,0x702b2975b3b42c82A4d3aa1E2040Ce05E6751F73];
        string[10] memory names = ["Matias Apablaza", "Leonardo D'Agostino", "Agustina Macchiavello", "Mika Dadi", "John Wall", "Mike Grace", "Steve Ake", "Lynda Flame", "Hillary Clinton", "Donald Trump"];

        for(uint i=0; i<usersAddresses.length; i++)
            users[usersAddresses[i]] = User(usersAddresses[i], names[i], '', _getRandomNumber(70, 100), _getRandomNumber(70, 100), _getRandomNumber(5, 20));
    }

    function clearDummyUsers() public {
        require(msg.sender == ownerAddress, "Not allowed");
        
        for(uint i=0; i<usersAddresses.length; i++)
            delete users[usersAddresses[i]];
        delete usersAddresses;
    }

    function fillDummyImages() public {
        require(msg.sender == ownerAddress, "Not allowed");

        imageUrls = ["https://pbs.twimg.com/media/FsTtewkXwAEHWv_?format=jpg&name=medium","https://pbs.twimg.com/media/FsAMqG4XsAMci0C?format=jpg&name=medium","https://pbs.twimg.com/media/FsKUKrCaIAAHCNX?format=png&name=medium","https://pbs.twimg.com/media/FspVVk6WYAEvWiW?format=jpg&name=medium","https://pbs.twimg.com/media/Fski3FFX0AgUgMz?format=jpg&name=medium","https://pbs.twimg.com/media/FsUkQwuaQAAyoJW?format=jpg&name=medium","https://pbs.twimg.com/media/FsoFrFRWAAEZCzU?format=jpg&name=medium"];
        string[7] memory descriptions = ["Nuevo estilo del Papa?","Will Smith bofeteó a Chris Rock?","Elon Musk esta saliendo con Maria?","Mujer asiática","Mitad hombre mitad animal? Es posible?","Trump de compras en China?","Trump preso?"];

        for(uint i=0; i<imageUrls.length; i++) {
            images[imageUrls[i]].url = imageUrls[i];
            images[imageUrls[i]].description = descriptions[i];
            images[imageUrls[i]].owner = usersAddresses[i % 2];
            images[imageUrls[i]].uploadDate = block.timestamp;
            images[imageUrls[i]].isVotationOpen = i % 2 == 0;
            images[imageUrls[i]].assignedVoters = [usersAddresses[0], usersAddresses[1], usersAddresses[2], usersAddresses[3], usersAddresses[4]];
            images[imageUrls[i]].positiveVotes = _getRandomSubset(images[imageUrls[i]].assignedVoters, 5-i%5);
            images[imageUrls[i]].negativeVotes = _getRandomSubset(images[imageUrls[i]].assignedVoters, i%5);
        }

        images['https://pbs.twimg.com/media/FsoFrFRWAAEZCzU?format=jpg&name=medium'].comments.push(Comment(usersAddresses[0], 'Imposible, lo vi el otro dia en Fox News diciendo que se iba de viaje'));
        images['https://pbs.twimg.com/media/FsoFrFRWAAEZCzU?format=jpg&name=medium'].comments.push(Comment(usersAddresses[1], 'No me sorprenderia, a mi me parecio ver un operativo policial muy grande en Nueva York'));
    }

    function clearDummyImages() public {
        require(msg.sender == ownerAddress, "Not allowed");

        for(uint i=0; i<imageUrls.length; i++)
            delete images[imageUrls[i]];
        delete imageUrls;
    }

}
