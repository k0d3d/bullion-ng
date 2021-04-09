import { ethers } from "ethers";
import tokenContract from '../build/contracts/BullionCollectible.json';
import Vue from 'vue'



document.addEventListener("DOMContentLoaded", function () {
  //do work
  console.log("running every day ");
  const buttonMint = document.querySelector("#bullion-admin-mint .mint-btn");

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  buttonMint.addEventListener("click", (e) => {
    e.preventDefault();
    if (provider) {
      checkNetwork(provider)
        .then((e) => {
          startApp();
        })
        .catch((e) => console.log(e));
    }
  });
});

const startApp = async () => {
  const chainId = await ethereum.request({ method: "eth_chainId" });
  handleChainChanged(chainId);

  ethereum.on("chainChanged", handleChainChanged);
};

const web3networks = {
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
};

let state = {
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
};


let myToken = {
  address: '0x494b2CeE761FdfCd6f5bE1ABefB7A6112B251874',
  abi: tokenContract.abi,
  imageBuffer: '',
  ipfsImageHash: '',
  ipfsImageUrl: '',
  metadataBuffer: "",
  ipfsMetadataHash: '',
  ipfsMetadataUrl: '',
  recipientAddress: '',
  newMinterAddress: '',
  txHash: '',
  txReceipt: '',
  blockNumber: '',
  gasUsed: ''
}

let networkId = "";

function handleChainChanged(_chainId) {
  if (networkId.length) {
    window.location.reload();
  } else {
    networkId = _chainId;
  }
}

const checkNetwork = async (provider) => {
  // first update the values that can change while connected
  let myContext = state.web3ctx;
  let accounts = await ethereum.request({ method: "eth_requestAccounts" });
  myContext.activeWallet = accounts[0];
  myContext.lastBlockNumber = await provider.getBlockNumber();
  myContext.currentBalance = await provider.getBalance(accounts[0]);

  const { name, chainId } = await provider.getNetwork();
  myContext.networkId = chainId;
  myContext.networkName = web3networks[chainId]
    ? web3networks[chainId].name
    : "unknown";
  myContext.etherscanUrl = web3networks[chainId]
    ? web3networks[chainId].etherscanUrl
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


const mintToken = async () => {

  if (!App.exists(this.state.myToken.abi) ||
      !App.exists(this.state.web3ctx.tokenAddress) ||
      !App.exists(this.state.myToken.recipientAddress) ||
      !App.exists(this.state.myToken.ipfsImageUrl) ||
      !App.exists(this.state.myToken.ipfsMetadataUrl)) {
      console.log('Required input fields are missing!');
      return false;
  }

  try {
      this.setState({
          myToken: {
              ...this.state.myToken,
              blockNumber: 'waiting..',
              gasUsed: 'waiting...'
          }
      });

      // bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();
      const myTokenInstance = new web3.eth.Contract(
          this.state.myToken.abi,
          this.state.web3ctx.tokenAddress
      );

      console.log('Sending from Metamask account: ' + accounts[0] + ' to token address '
          + myTokenInstance.options.address);

      // see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
      await myTokenInstance.methods.mint(this.state.myToken.recipientAddress, this.state.myToken.ipfsMetadataUrl).send({
          from: accounts[0]
      }, (error, txHash) => {
          console.log('txHash: ' + txHash + ', error: ' + error);

          this.setState({
              myToken: {
                  ...this.state.myToken,
                  txHash: txHash
              }
          });
      });

      // get Transaction Receipt in console on click
      // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
      await web3.eth.getTransactionReceipt(this.state.myToken.txHash, (err, txReceipt) => {
          if (txReceipt) {
              this.setState({
                  myToken: {
                      ...this.state.myToken,
                      txReceipt: txReceipt
                  }
              });
          }
      });

  } catch (e) {
      console.log('Error: ' + e);
  }
};


var app = new Vue({
  el: '#wpbody',
  data: {
    message: 'Hello Vue!'
  }
})