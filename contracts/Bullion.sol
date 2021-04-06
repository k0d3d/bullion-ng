pragma solidity ^0.5.0;

import "./ERC721Tradable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Creature
 * Creature - a contract for my non-fungible creatures.
 */
contract BullionCollectible is ERC721Tradable {
    string contractLink;

    constructor(address _proxyRegistryAddress)
        public
        ERC721Tradable(
            "BullionCollectibleDigitalArt",
            "BDART",
            _proxyRegistryAddress
        )
    {}

    function setContractUri(string memory tokenUri) public {
        contractLink = tokenUri;
    }

    function contractURI() public view returns (string memory) {
        return contractLink;
    }

    function createCollectible(string memory tokenURI)
        public
    {
        // uint256 newItemId = tokenCounter;
        // _safeMint(msg.sender, newItemId);
        // setContractUri(tokenURI);
        uint256 newItemId = mintTo(msg.sender);
        _setTokenURI(newItemId, tokenURI);
    }
}
