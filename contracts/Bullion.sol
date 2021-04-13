pragma solidity ^0.5.8;

import "./ERC721Tradable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

/**
 * @title BullionCollectible
 * 
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

contract BullionItem is ERC721Tradable {
    address public proxyRegistryAddress;
    BullionIssue public issue ;

    constructor(address _proxyRegistryAddress, string memory name, string memory tokenSymbol)
        public
        ERC721Tradable(
            name,
            tokenSymbol,
            _proxyRegistryAddress
        )
    {
        proxyRegistryAddress = _proxyRegistryAddress;
        issue = BullionIssue(proxyRegistryAddress);
    }

    function createCollectible(string memory _tokenURI) public onlyOwner {
        uint256 newItemId = mintTo(tx.origin);
        _setTokenURI(newItemId, _tokenURI);
    }
}

contract BullionIssue is Ownable{
    address private proxyRegistryAddress;
    BullionItem public item;

    constructor(address _proxyRegistryAddress) public {
        proxyRegistryAddress = _proxyRegistryAddress;
    }

    function createToken (string memory _name, string memory _tokenSymbol) public onlyOwner {
        item = new BullionItem(address(this), _name, _tokenSymbol);
    }

    function getSymbol () public view returns(string memory) {
        return item.symbol();
    }

    function getName () public view returns(string memory) {
        return item.name();
    }

    function createCollectible (string memory _tokenUri) public onlyOwner{
        item.createCollectible(_tokenUri);
    }

}
