import { React, useState } from 'react';

import { ethers } from "ethers";

import { Button, Box, Flex, Image, Spacer, Grid } from "@chakra-ui/react";

import { handleNetworkConnection } from "../helpers/Helpers";

import { useDispatch, useSelector } from 'react-redux';

import EmailIcon from "../assets/social-media-icons/email_32x32.png";
import TwitterIcon from "../assets/social-media-icons/twitter_32x32.png";

import { Link } from "react-router-dom";
import { setAccounts } from '../features/accountsSlice';

export default function NavBar() {

    const _accounts = useSelector(state => state.accounts);
    const dispatch = useDispatch();

    const [isConnected, setIsConnected] = useState(false);
    const [accounts, setAccount] = useState(null);

    async function connectAccount() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            let res = await handleNetworkConnection(provider);
            if (res) {
                window.ethereum.request({
                    method: "eth_requestAccounts",
                })
                .then( (userAccounts) => {
                    dispatch(setAccounts(userAccounts))
                    setAccount(userAccounts);
                    setIsConnected(true);
                });                
            }
        }
    }

    return (
        <Flex justify="space-between" align="center" padding="30px">

            <Flex width="40%" padding="0 45px">
                <a href="www.facebook.com">
                    <Image src={EmailIcon} boxSize="42px" margin="0 15px"/>
                </a>
                <a href="www.facebook.com">
                    <Image src={TwitterIcon} boxSize="42px" margin="0 15px"/>
                </a>
            </Flex>

            <Flex
                justify="space-around"
                align="center"
                width="30%"
                padding="30px 30px 30px 30px"
            >
                <Box margin="0 15px">
                    <Link to={``}>Mint</Link>
                </Box>
                <Spacer/>
                <Box margin="0 15px">
                    <Link to={`about`}>About</Link>
                </Box>
                <Spacer/>
                <Box margin="0 15px">
                    <Link to={`team`}>Team</Link>
                </Box>
                <Spacer/>

                {isConnected ? (
                <Box margin="0 15px" >{accounts[0].slice(0, 8)}...</Box>
                ) : (
                    <Button
                        backgroundColor="#D6517D"
                        borderRadius="5px"
                        boxShadow="0 2px 2px 1px #0F0F0F"
                        color="white"
                        cursor="pointer"
                        fontFamily="inherit"
                        padding="15px"
                        margin="0 15px"  
                        onClick={connectAccount}>Connect
                    </Button>
                )}
            </Flex>
        </Flex>
    );
}