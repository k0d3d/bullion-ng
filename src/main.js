import { ethers } from "ethers";
import tokenContract from '../build/contracts/BullionCollectible.json';



document.addEventListener("DOMContentLoaded", function (event) {
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

  const { netId, chainId } = await provider.getNetwork();
  myContext.networkId = chainId;
  myContext.networkName = web3networks[netId]
    ? web3networks[netId].name
    : "unknown";
  myContext.etherscanUrl = web3networks[netId]
    ? web3networks[netId].etherscanUrl
    : "unknown";

  if (tokenContract.networks[netId]) {
    // attempt to load contract address deployed on this network
    let newAddress = tokenContract.networks[netId].address
      ? tokenContract.networks[netId].address
      : "";

    console.log("Using contract at address '" + newAddress + "'");
    myContext.tokenAddress = newAddress;
  } else {
    console.log("No contract deployed on network " + netId);
    myContext.tokenAddress = "";
  }
};
