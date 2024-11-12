// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ProofOfWork is ERC721 {
    constructor() ERC721("ProofOfWork", "POW") {}

    // Modifier to allow only approved minters
    modifier onlyApprovedMinters() {
        require(
            msg.sender == approvedMinter1 ||
                msg.sender == approvedMinter2 ||
                msg.sender == approvedMinter3,
            "Not an approved minter"
        );
        _;
    }

    // Approved minters
    address private approvedMinter1 =
        0xfE3B28ed2F6F67BbBA957e4af61b5B0eE65d0831;
    address private approvedMinter2 =
        0xDb61E9F123606359D2BE7C310631eFD7e9AfEe3F;
    address private approvedMinter3 =
        0xdD870fA1b7C4700F2BD7f44238821C26f7392148;

    address[] public registeredAddresses; // Array to store registered addresses
    mapping(address => bool) private isRegistered; // Mapping to check if an address is already registered
    uint256 private TokenId = 0; // Token ID counter
    enum careerEventOptions {
        Hired,
        Promoted,
        Terminated
    }

    struct Status {
        uint256 TokenId;
        string text;
        careerEventOptions careerEvent;
        uint256 timestamp;
    }

    mapping(uint256 => Status) public JobData; // Mapping from token ID to employment status
    mapping(uint256 => address) private tokenToOwner; // Map tokenId to owner for access control

    // Modifier to allow only the owner or approved minters to access job data
    modifier onlyOwnerOrApproved(uint256 tokenId) {
        require(
            msg.sender == tokenToOwner[tokenId] ||
                msg.sender == approvedMinter1 ||
                msg.sender == approvedMinter2 ||
                msg.sender == approvedMinter3,
            "Not authorized to view job data"
        );
        _;
    }

    // Function to mint NFT for a registered user
    function mintNFT(
        address recipient,
        string memory text,
        careerEventOptions careerEvent
    ) public onlyApprovedMinters {
        require(isRegistered[recipient], "Recipient is not registered");

        _safeMint(recipient, TokenId); // Mint the token

        JobData[TokenId] = Status({ // Set the employment status of the token
            TokenId: TokenId,
            text: text,
            careerEvent: careerEvent,
            timestamp: block.timestamp
        });

        tokenToOwner[TokenId] = recipient; // Map token to the recipient for access control

        TokenId++;
    }

    // Function to get the employment status of a token (restricted access)
    function getJobData(
        uint256 tokenId
    ) public view onlyOwnerOrApproved(tokenId) returns (Status memory) {
        require(tokenId < TokenId, "Token does not exist");
        return JobData[tokenId];
    }

    // Function for users to register
    function register() public {
        require(!isRegistered[msg.sender], "Address already registered"); // Check if the user is already registered
        registeredAddresses.push(msg.sender); // Add the user's address to the array
        isRegistered[msg.sender] = true;
    }

    // Function to check if an address is registered
    function checkRegistration(address _user) public view returns (bool) {
        return isRegistered[_user];
    }

    // Override _beforeTokenTransfer to disable transfers without marking as override
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal pure {
        require(
            from == address(0) || to == address(0),
            "Transfers are disabled"
        ); // Allow minting (from == 0) but not transfers
    }
}
