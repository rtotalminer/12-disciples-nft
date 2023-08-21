import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { Button, Box, Flex, Input, Text, Spinner } from "@chakra-ui/react";
import {
    handleNetworkConnection,
    getWalletMintable,
    getMintingCost,
} from "../helpers/Helpers";

import { useSelector } from 'react-redux';

import NFT from "../configs/NFT.json";
//import config from "../config.json"

const NFTAddress = "0x94b8d59b9d1d5C82fD7893d159BB89E92a0bD736";

export default function Mint() { 

    const _accounts = useSelector(state => state.accounts);

    var [successMinting, setSuccessMinting] = useState(false);
    var [spinner, setSpinner] = useState(false);
    var [errorStore, setErrorStore] = useState(null);
    var [minitingCost, setMinitingCost] = useState(null);
    var [walletMintable, setWalletMintable] = useState(null);
    var [mintAmount, setMintAmount] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
          let isConnected = _accounts.accounts[0] != null ? true : false;
          const mintAmountData = await getWalletMintable(isConnected);
          const mintCostData = await getMintingCost(isConnected);
          setWalletMintable(mintAmountData);
          setMinitingCost(mintCostData);
        }
        fetchData().catch(console.error);
      })

    async function handleMint() {
        let isConnected = _accounts.accounts[0] != null ? true : false;
        if (window.ethereum && isConnected) {
            setSpinner(true);
            setSuccessMinting(false);
            setErrorStore(null);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            if (handleNetworkConnection()) {
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    NFTAddress, NFT.abi, signer
                );
                try {
                    const mintTotal = (minitingCost*mintAmount).toString()
                    const options = {value: ethers.utils.parseEther(mintTotal)}
                    const res = await contract.mint(BigNumber.from(mintAmount), options);
                    if (res) {
                        setSuccessMinting(true);
                        setErrorStore(null);
                        setSpinner(false);
                    }
                }
                catch (err) {
                    const errCode = err.code;
                    if (errCode === -32603) {
                        const errMsg = err["error"].message.split(":")[1];
                        setErrorStore(errMsg);
                    }
                    else {
                        setErrorStore("Error Minting.");
                    }
                    setSpinner(false);
                }
            }
        }
    }

    const handleDecrement = () => {
        if (mintAmount <= 1) return;
        setMintAmount(mintAmount - 1);
    }

    const handleIncrement = () => {
        if (mintAmount >= walletMintable) return;
        setMintAmount(mintAmount + 1);
    }

    // This function is a work around an annoying error
    const onChange = () => {
        return;
    }
    
    return (
        <Flex justify="center" align="center" height="100vh" paddingBottom="200px">
            <Box width="700px">
                <div>
                    <Text fontSize="48px" textShadow="0 5px #000000">
                        The 12 Disciples
                    </Text>
                    <Text
                        fontSize="24px"
                        letterSpacing="-5.5%"
                        textShadow="0 2px 2px #000000"
                    >
                        Jesus's disciples have returned as NFTs so they can not only shill Christianity, but cryptocurrency. There are only 12 Jesus's to be minted, will you be the lucky one?
                    </Text>
                </div>
                {_accounts.accounts[0] != null ? (
                    <div>
                        <Flex align="center" justify="center">
                            <Button
                                backgroundColor="#D6517D"
                                borderRadius="5px"
                                boxShadow="0 2px 2px 1px #0F0F0F"
                                color="white"
                                cursor="pointer"
                                fontFamily="inherit"
                                padding="15px"
                                marginTop="10px"  
                                onClick={handleDecrement}
                            >
                                -
                            </Button>
                            <Input
                                readOnly
                                type="number"
                                onChange={onChange}
                                value={mintAmount}
                                width="100px"
                                height="40px"
                                textAlign="center"
                                paddingLeft="19px"
                                marginTop="10px"
                                backgroundColor="#FFFFFF"
                                textColor="#000000"
                            />
                            <Button
                                backgroundColor="#D6517D"
                                borderRadius="5px"
                                boxShadow="0 2px 2px 1px #0F0F0F"
                                color="white"
                                cursor="pointer"
                                fontFamily="inherit"
                                padding="15px"
                                marginTop="10px" 
                                onClick={handleIncrement}
                            >
                                +
                            </Button>
                        </Flex>
                        <Button
                                backgroundColor="#D6517D"
                                borderRadius="5px"
                                boxShadow="0 2px 2px 1px #0F0F0F"
                                color="white"
                                cursor="pointer"
                                fontFamily="inherit"
                                padding="15px"
                                marginTop="10px" 
                                onClick={handleMint}
                            >
                                Mint
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Text
                        marginTop="70px"
                        color="#D6517D"
                        fontSize="24px"
                        letterSpacing="-5.5%"
                        textShadow="0 3px #000000"
                    >
                        You aren't connected!
                    </Text>
                    </div>
                    
                    
                )}


                {successMinting ? (
                    <Text
                    marginTop="30px"
                    color="green"
                    fontSize="24px"
                    letterSpacing="-5.5%"
                    textShadow="0 3px #000000"
                >
                    Successfully Minted!
                </Text> ) : ( 
                    errorStore ? (
                        <Text
                        marginTop="30px"
                        color="red"
                        fontSize="24px"
                        letterSpacing="-5.5%"
                        textShadow="0 3px #000000"
                    >
                        {errorStore}
                    </Text> ) :
                    ( 
                        spinner ? (
                            <Flex justify="center" align="center" marginTop="30px">
                                <Spinner size="lg" color="red"/>
                            </Flex>
                        ) :
                        (null)
                    )
                 )}
            </Box>
        </Flex>
    );
}