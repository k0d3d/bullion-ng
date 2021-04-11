import { ethers } from "ethers";
import tokenContract from '../build/contracts/BullionCollectible.json';
import Vue from 'vue'


const startApp = async () => {
  return await ethereum.request({ method: "eth_chainId" });
};



function exists(s) {
  let chk = (s ? s.toString() : '');
  return chk && chk.trim().length > 0;
}

function clear() {
  window.location.reload();
}

const checkNetwork = async (provider, vueInstance) => {
  const self = vueInstance || this
  // first update the values that can change while connected
  let myContext = self.web3ctx;
  let accounts = await ethereum.request({ method: "eth_requestAccounts" });
  myContext.activeWallet = accounts[0];
  myContext.lastBlockNumber = await provider.getBlockNumber();
  myContext.currentBalance = await provider.getBalance(accounts[0]);

  const { chainId } = await provider.getNetwork();
  myContext.networkId = chainId;
  myContext.networkName = self.web3networks[chainId]
    ? self.web3networks[chainId].name
    : "unknown";
  myContext.etherscanUrl = self.web3networks[chainId]
    ? self.web3networks[chainId].etherscanUrl
    : "unknown";

  if (tokenContract.networks[chainId]) {
    // attempt to load contract address deployed on this network
    let newAddress = tokenContract.networks[chainId].address
      ? tokenContract.networks[chainId].address
      : "";

    console.log("Using contract at address '" + newAddress + "'");
    myContext.tokenAddress = newAddress;
  } else {
    console.log("No contract deployed on network " + chainId);
    myContext.tokenAddress = "";
  }
};


async function attemptMint() {
  const self = this
  if (!exists(this.myToken.abi) ||
      !exists(this.web3ctx.tokenAddress) ||
      !exists(this.myToken.recipientAddress)
      // !exists(this.myToken.ipfsImageUrl) ||
      // !exists(this.myToken.ipfsMetadataUrl)
      ) {
      console.log('Required input fields are missing!');
      return false;
  }

  try {
    self.myToken.blockNumber = 'waiting..'
    self.myToken.gasUsed = 'waiting..'

      // bring in user's metamask account address
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const myTokenInstance = new ethers.Contract(
        self.web3ctx.tokenAddress,
          self.myToken.abi,
          self.signer
      );

      console.log('Sending from Metamask account: ' + accounts[0] + ' to token address '
          + myTokenInstance.address);

      // see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
      self.myToken.tx = await myTokenInstance.createCollectible(self.myToken.ipfsMetadataUrl)
      // this.provider.sendTransaction(createNft)


      

      // get Transaction Receipt in console on click
      // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
      const txReceipt = await ethereum.request({
        method: "eth_requestAccounts",
        params: [
          self.myToken.tx.hash
        ]
      })
      self.myToken.txReceipt  = txReceipt

  } catch (e) {
      console.log('Error: ' + e);
  }
};


var App = new Vue({
  el: '#wpbody',
  data: () => ({
    provider: null,
    signer: null,
    networkId: '',
    web3networks : {
      1: {
        name: "main",
        etherscanUrl: "https://etherscan.io/tx/",
      },
      3: {
        name: "ropsten",
        etherscanUrl: "https://ropsten.etherscan.io/tx/",
      },
      4: {
        name: "rinkeby",
        etherscanUrl: "https://rinkeby.etherscan.io/tx/",
      },
      42: {
        name: "kovan",
        etherscanUrl: "https://kovan.etherscan.io/tx/",
      },
    },
    web3ctx: {
      networkId: "",
      networkName: "",
      etherscanUrl: "",
      activeWallet: "",
      lastBlockNumber: "",
      currentBalance: "",
      tokenAddress: "0x494b2CeE761FdfCd6f5bE1ABefB7A6112B251874",
      ipfsGateway: "https://ipfs.infura.io/ipfs/",
    },
    myToken : {
      address: '0x494b2CeE761FdfCd6f5bE1ABefB7A6112B251874',
      abi: tokenContract.abi,
      imageBuffer: '',
      ipfsImageHash: '',
      ipfsImageUrl: '',
      metadataBuffer: "",
      ipfsMetadataHash: '',
      ipfsMetadataUrl: 'https://gateway.pinata.cloud/ipfs/QmRYj2GsLdcESWuJkHrUy5Vs2urwTwtzwGAUBME6vGEx9F',
      recipientAddress: '0xF37589a8beE6F853d21120A2537050e82747dc7f',
      newMinterAddress: '',
      txHash: '',
      txReceipt: '',
      blockNumber: '',
      gasUsed: ''
    }
  }),
  methods: {
    attemptMint() {
      const thisattemptMint = attemptMint.bind(this)
      thisattemptMint()
    },
    exists,
    clear,
    handleChainChanged (_chainId) {
      if (this.networkId.length) {
        window.location.reload();
      } else {
        this.networkId = _chainId;
      }
    },
    checkNetwork(provider) {
      const self = this    
      return checkNetwork.apply(self, [provider, self])
    }
  },
  mounted () {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);

    this.signer = this.provider.getSigner();
    
    if (this.provider) {
      this.checkNetwork(this.provider)
        .then((e) => {
          return startApp()
        })
        .then((chainId) => {
          this.handleChainChanged(chainId);

          ethereum.on("chainChanged", this.handleChainChanged);
        })
        .catch((e) => console.log(e));
    }

  }
})