import { Token__factory } from "../typechain"
import { Token } from "../typechain-types";
import { Signer } from 'ethers';
import { ethers } from 'hardhat';

const useToken = () => {
    const getTokenContract = (signer: Signer, tokenAddress: string) => {
        try {
            const TokenFactory = new Token__factory(signer);
            const token: Token = TokenFactory.attach(tokenAddress);
            return token;
        } catch (err) {
            console.log(err)
        }
    }

    const blacklistAccount = async (
        account:string, 
        owner: Signer, 
        tokenAddress: string
    ) => {
        try {
            const tokenContract = getTokenContract(owner, tokenAddress);
            await tokenContract?.connect(owner).blacklistAccount(account);
        } catch (err) {
            console.log(err)
        }
    }

    const whitelistAccount = async (
        account: string,
        owner: Signer,
        tokenAddress: string
    ) => {
        try {
            const tokenContract = getTokenContract(owner, tokenAddress);
            await tokenContract?.connect(owner).whitelistAccount(account);
        } catch (err) {
            console.log(err)
        }
    }

    const transferToken = async (
        signer: Signer,
        receiver: string,
        tokenAddress: string,
        amount: number
    ) => {
        try {
            const tokenContract = getTokenContract(signer, tokenAddress);
            await tokenContract?.connect(signer).transfer(receiver, ethers.utils.parseEther(amount.toString()));
        } catch (err) {
            console.log(err)
        }
    }

    const purchaseTokens = async (
        signer: Signer,
        amount: number,
        tokenAddress: string
    ) => {
        try {
            const tokenContract = getTokenContract(signer, tokenAddress);
            const exchangeRate = await tokenContract?.exchangeRate();
            const formatAmount = ethers.utils.parseEther(amount.toString())
            const price = ethers.utils.parseEther(amount.toString()).div(ethers.BigNumber.from(exchangeRate));
            await tokenContract?.connect(signer).mint(formatAmount, {value: price});
        } catch (err) {
            console.log(err)
        }
    }
}