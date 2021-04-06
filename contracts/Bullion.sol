pragma solidity 0.6.8;

import "./ERC721Tradable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Creature
 * Creature - a contract for my non-fungible creatures.
 */

contract CollectibleBase is ERC721Tradable {
    string baseURI;

    constructor(
        string memory _name,
        string memory _symbol,
        address _proxyRegistryAddress
    ) ERC721Tradable(_name, _symbol, _proxyRegistryAddress) {}

    function mint(address account, uint256 tokenId) external {
        _mint(account, tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) external {
        _setTokenURI(tokenId, tokenURI);
    }

    function setBaseURI(string memory baseURI_) external {
        baseURI = baseURI_;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}

contract BullionCollectible is CollectibleBase {

    constructor(address _proxyRegistryAddress)
        CollectibleBase(
            "BullionCollectibleDigitalArt",
            "BDART",
            _proxyRegistryAddress
        )
    {
        
    }


    function createCollectible(string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = _getNextTokenId();

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _incrementTokenId();
        return newItemId;
    }
}
