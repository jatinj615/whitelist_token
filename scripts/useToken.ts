import { ethers } from "hardhat";
import * as readline from "readline-sync";
import { Token__factory } from "../typechain"

const tokenAddress = "0x6a1bE7a8e9D85e9aC7c2F427143848d50789B1aa";


async function whitelistAccount() {
    const address = readline.question("Address to whitelist: ");
    const [signer] = await ethers.getSigners()
    const TokenFactory = new Token__factory(signer);
    const token = TokenFactory.attach(tokenAddress);
    try {
        const tx = await token.connect(signer).whitelistAccount(address);
        console.log("Transaction hash for the transaction: ", tx.hash);
    } catch (err) {
        console.log(err);
    }
    
}

async function blacklistAccount() {
    const address = readline.question("Address to blacklist: ");
    const [signer] = await ethers.getSigners()
    const TokenFactory = new Token__factory(signer);
    const token = TokenFactory.attach(tokenAddress);
    try {
        const tx = await token.connect(signer).blacklistAccount(address);
        console.log("Transaction hash for the transaction: ", tx.hash);
    } catch (err) {
        console.log(err);
    }
}

async function purchaseToken() {
    const amount = ethers.utils.parseEther(readline.question("amount to mint: "));
    const [signer] = await ethers.getSigners()
    const TokenFactory = new Token__factory(signer);
    const token = TokenFactory.attach(tokenAddress);
    try {
        const exchangeRate = await token.exchangeRate();
        const price = amount.div(exchangeRate);
        const tx = await token.connect(signer).mint(amount, {value: price});
        console.log("Transaction hash for the transaction: ", tx.hash);
    } catch (err) {
        console.log(err);
    }
}

async function transfer() {
    const address = readline.question("Address of the recipient: ");
    const amount = ethers.utils.parseEther(readline.question("Amount to Transfer: "));
    const [signer] = await ethers.getSigners()
    const TokenFactory = new Token__factory(signer);
    const token = TokenFactory.attach(tokenAddress);
    try {
        const tx = await token.connect(signer).transfer(address, amount);
        console.log("Transaction hash for the transaction: ", tx.hash);
    } catch (err) {
        console.log(err);
    }
}


async function main() {
    console.log("select a functionality to perform: \n1. Whitelist Account (only owner)\n2. Blacklist Account (only owner)\n3. Buy Tokens with Eth\n4. Transfer Token\n");
    const feature = Number(readline.question("Input the option (1, 2, 3, 4): "));
    switch (feature) {
        case 1:
            await whitelistAccount();
            break;
        case 2:
            await blacklistAccount();
            break;
        case 3:
            await purchaseToken();
            break;
        case 4:
            await transfer();
        default:
            console.log("Please select valid option");
            break;
    }
}




main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });