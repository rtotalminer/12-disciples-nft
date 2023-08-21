const hre = require("hardhat");
const dotenv = require("dotenv").config();

async function main() {
  const name = "MyNFT";
  const symb = "NFT";
  const baseUri = "ipfs://QmTRSq9tj3pbxa8eCgF9S9PdCpG6NxjmvgA3ydm9rAS9FA";
  const linkAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  const wrapperAddress = "0x708701a1DfF4f478de54383E49a627eD4852C816";

  const NFT = await hre.ethers.getContractFactory("The12Disciples");
  const nft = await NFT.deploy(name, symb, baseUri, linkAddress, wrapperAddress);

  await nft.deployed();
  console.log("NFT deployed to: ", nft.address);

  await new Promise(r => setTimeout(r, 1000*60));

  await hre.run("verify:verify", {
    address: nft.address,
    constructorArguments: [
      name,
      symb,
      baseUri,
      linkAddress,
      wrapperAddress
    ],
  });

  console.log("Contract Verified")

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
