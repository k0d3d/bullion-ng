pragma solidity ^0.5.0;

import "./ERC721Tradable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Creature
 * Creature - a contract for my non-fungible creatures.
 */
contract BullionCollectible is ERC721Tradable {
    string private contractLink;

    constructor(address _proxyRegistryAddress)
        public
        ERC721Tradable(
            "BullionCollectibleDigitalArt",
            "BDART",
            _proxyRegistryAddress
        )
    {}

    function setContractUri(string memory tokenUri) public  {
        contractLink = tokenUri;
    }

    function contractURI() public view returns (string memory) {
        return contractLink;
    }

    function createCollectible(string memory tokenURI) public onlyOwner {
        // uint256 newItemId = tokenCounter;
        // _safeMint(msg.sender, newItemId);
        // setContractUri(tokenURI);
        uint256 newItemId = mintTo(tx.origin);
        _setTokenURI(newItemId, tokenURI);
    }
}

contract BullionIssue is ERC721Tradable {
    constructor(address _proxyRegistryAddress, string memory name, string memory tokenSymbol)
        public
        ERC721Tradable(
            name,
            tokenSymbol,
            _proxyRegistryAddress
        )
    {}
}

contract BullionItem is Ownable{
    address private proxyRegistryAddress;
    string private tokenName;
    string private tokenSymbol;
    BullionIssue private issue;

    constructor(address _proxyRegistryAddress) public {
        proxyRegistryAddress = _proxyRegistryAddress;
    }

    function createToken (string memory _name, string memory _tokenSymbol) public onlyOwner returns(BullionIssue) {
        tokenName = _name;
        tokenSymbol = _tokenSymbol;
        issue = new BullionIssue(proxyRegistryAddress, tokenName, tokenSymbol);
        return issue; 
    }

    function getSymbol () public view returns(string memory) {
        require(bytes(tokenSymbol).length > 0);
        return issue.symbol();
    }

    function getName () public view returns(string memory) {
        require(bytes(tokenName).length > 0);
        return issue.name();
    }



    function createCollectible(string memory _tokenUri) public onlyOwner {
        
    }
}
