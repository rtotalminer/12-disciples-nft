import { ethers } from "ethers";
import NFT from "../configs/NFT.json";

const network = ethers.providers.getNetwork("goerli");

const NFTAddress = "0x94b8d59b9d1d5C82fD7893d159BB89E92a0bD736";
const appNetworkID = network.chainId;

export async function handleNetworkConnection() {
    console.log(appNetworkID)
    const networkId = await window.ethereum.request({
        method: "net_version",
    });
    if (networkId != appNetworkID) {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{
                chainId: "0x" + appNetworkID
            }],
        });
    }
    if (networkId == appNetworkID) {
        return true;
    } 
}

export async function getWalletMintable(isConnected) {
    if (window.ethereum && isConnected) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        if (handleNetworkConnection(provider)) {
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                NFTAddress, NFT.abi, signer
            );
            try {
                const res = await contract.maxPerWallet();
                if (res) {
                    const walletAvailableMinting = parseInt(res._hex, 16);
                    return walletAvailableMinting;
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}

export async function getMintingCost(isConnected) {
    if (window.ethereum && isConnected) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        if (handleNetworkConnection(provider)) {
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                NFTAddress, NFT.abi, signer
            );
            try {
                const res = await contract.mintCost();
                if (res) {
                    const wei = parseInt(res._hex, 16).toString();
                    const minitingCost = ethers.utils.formatEther(wei);
                    return minitingCost;
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}

async function connectAccount() {
    let out = null;
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const res = await handleNetworkConnection(provider);
        if (res) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            out = accounts;
        }
    }
    return out;
}