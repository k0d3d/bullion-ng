const { expect, assert } = require('chai')

const Bullion = artifacts.require('BullionCollectible')


require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Bullion NFT', () => {

  let bullion 
  let targetUri


  before(async () => {
    bullion = await Bullion.deployed()
    targetUri = 'https://gateway.pinata.cloud/ipfs/QmRYj2GsLdcESWuJkHrUy5Vs2urwTwtzwGAUBME6vGEx9F'
  })

  describe('deployment', async () => {

    it('should deploy successfully', async () => {
      expect(bullion.address).to.not.be.empty
      expect(bullion.address).to.not.equal(0x0)
      expect(bullion.address).to.not.be.null
      expect(bullion.address).to.not.be.undefined
    })

    it('should have a name', async () => {
      const name = await bullion.name()
      expect(name).to.not.be.empty
      expect(name).to.not.be.null
      expect(name).to.not.be.undefined
      expect(name).to.equal('BullionCollectibleDigitalArt')
    })

    it('should have a symbol', async () => {
      const symbol = await bullion.symbol()
      expect(symbol).to.not.be.empty
      expect(symbol).to.not.be.null
      expect(symbol).to.not.be.undefined
      expect(symbol).to.equal('BDART')
    })

    it('should get contract uri after setting', async () => {
      await bullion.setContractUri(targetUri)
      const uri = await bullion.contractURI()
      expect(uri).to.not.be.empty
      expect(uri).to.equal(targetUri)
    })


    it('should create a collectible', async () => {
      const createCollectible = await bullion.createCollectible(targetUri)
      // console.log(createCollectible)
      expect(createCollectible).to.not.be.empty
      expect(createCollectible.receipt.transactionHash).to.not.be.empty
      expect(createCollectible.receipt.transactionHash).to.not.be.null
      expect(createCollectible.receipt.transactionHash).to.not.be.undefined
      // expect(createCollectible.getLastTokenUri()).to.not.be.undefined
    })
  })
})