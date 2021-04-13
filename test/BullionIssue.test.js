const { expect, assert } = require('chai')

const Bullion = artifacts.require('BullionIssue')


require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Bullion Issue', () => {

  let bullion 
  let targetUri
  let name = `DavidOnDemand`;
  let tokenSymbol = 'DOD';
  let bullionIssue


  before(async () => {
    bullion = await Bullion.deployed()
    targetUri = 'https://gateway.pinata.cloud/ipfs/QmRYj2GsLdcESWuJkHrUy5Vs2urwTwtzwGAUBME6vGEx9F'
    await bullion.createToken(name, tokenSymbol)
  })

  describe('deployment', async () => {

    it('should deploy successfully', async () => {
      expect(bullion.address).to.not.be.empty
      expect(bullion.address).to.not.equal(0x0)
      expect(bullion.address).to.not.be.null
      expect(bullion.address).to.not.be.undefined
    })


    it('should have a name', async () => {
      // await bullion.createToken(name, tokenSymbol)
      const tokenName = await bullion.getName()
      expect(tokenName).to.not.be.empty
      expect(tokenName).to.not.be.null
      expect(tokenName).to.not.be.undefined
      expect(tokenName).to.equal(name)
    })

    it('should have a symbol', async () => {
      // await bullion.createToken(name, tokenSymbol)
      const symbol = await bullion.getSymbol()
      expect(symbol).to.not.be.empty
      expect(symbol).to.not.be.null
      expect(symbol).to.not.be.undefined
      expect(symbol).to.equal(tokenSymbol)
    })

    it('should create a collectible', async () => {
      // await bullion.createToken(name, tokenSymbol)
      const createCollectible = await bullion.createCollectible(targetUri)
      expect(createCollectible).to.not.be.empty
      expect(createCollectible.receipt.transactionHash).to.not.be.empty
      expect(createCollectible.receipt.transactionHash).to.not.be.null
      expect(createCollectible.receipt.transactionHash).to.not.be.undefined
    })


  })
})