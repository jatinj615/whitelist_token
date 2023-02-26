import { ethers } from "hardhat";
import { expect } from "chai";
import { Token } from "../typechain-types";
import { Signer, utils } from 'ethers';

describe("Deploy Token Contract and Test functionalities", () => {
    let tokenContract: Token;
    let accounts: Signer[];
    let owner: Signer;
    let exchangeRate: number;
    let whitelistedAccounts: string[] = [];
    let blacklistedAccounts: string[] = [];

    before(async() => {
        accounts = await ethers.getSigners();
        owner = accounts[0];
        // take 5 accounts for network
        for (let i = 1; i <= 5; i++) {
            whitelistedAccounts.push(await accounts[i].getAddress());
        }

        exchangeRate = 1000;
        // deploy token Contract
        const Token = await ethers.getContractFactory("Token");
        tokenContract = await Token.deploy("Test", "TEST", exchangeRate, whitelistedAccounts)
        tokenContract.deployed();
    });

    it("Should fail for unauthorized user mint", async() => {
        const amount = ethers.utils.parseEther("1000");
        const price = ethers.utils.parseEther('1');
        await expect(tokenContract.connect(accounts[6]).mint(amount, {value: price}))
        .to.be.revertedWith("Error: Not Whitelisted");
    });

    it("Should fail for whitelisted account  without enough liquidity to purchase", async() => {
        const amount = ethers.utils.parseEther("1000");
        const price = amount.div(ethers.BigNumber.from(exchangeRate)).sub(ethers.BigNumber.from(1));
        await expect(tokenContract.connect(accounts[4]).mint(amount, {value: price}))
        .to.be.revertedWith("Error: Not enough liquidity provided");
    });

    it("Should let whitelisted user mint tokens with enough liquidity", async() => {
        const amount = ethers.utils.parseEther("1000");
        const price = amount.div(ethers.BigNumber.from(exchangeRate));
        await tokenContract.connect(accounts[2]).mint(amount, {value: price});
        expect(await tokenContract.balanceOf(accounts[2].getAddress())).to.be.equal(amount);
    });

    it("Should transfer tokens between whitelist accounts", async() => {
        const amount = ethers.utils.parseEther("10");
        // transfer from account 2 -> 3, 4, 5
        await tokenContract.connect(accounts[2]).transfer(await accounts[3].getAddress(), amount);
        await tokenContract.connect(accounts[2]).transfer(await accounts[4].getAddress(), amount);
        await tokenContract.connect(accounts[2]).transfer(await accounts[5].getAddress(), amount);
    });

    it("Should revert for blacklisting with non Admin account", async() => {
        await expect(tokenContract.connect(accounts[1]).blacklistAccount(await accounts[3].getAddress()))
        .to.be.revertedWith(/AccessControl: account .* is missing role .*/);
    });

    it("Should blacklist account and peer nodes with admin account", async() => {
        // blacklist account 3
        await tokenContract.connect(owner).blacklistAccount(accounts[3].getAddress());
    });

    it("Should revert on transfer/receive with blacklisted account", async() => {
        const amount = ethers.utils.parseEther("10");
        // account 2 (blacklisted due to direct interaction with account 3) trying to transfer whitelisted account
        await expect(tokenContract.connect(accounts[2]).transfer(await accounts[4].getAddress(), amount))
        .to.be.revertedWith(`TransferNotAllowed`);

        // account 1(whitelisted account) trying to transfer to account 3(blacklisted)
        await expect(tokenContract.connect(accounts[1]).transfer(accounts[3].getAddress(), amount))
        .to.be.revertedWith(`TransferNotAllowed`);
    });

    it("Should let indirectly interacted peers to transfer", async() => {
        const amount = ethers.utils.parseEther("5");
        await tokenContract.connect(accounts[4]).transfer(accounts[5].getAddress(), amount);
    });

    it("Should revert on trying to whitelist with non admin", async() => {
        await expect(tokenContract.connect(accounts[1]).whitelistAccount(accounts[3].getAddress()))
        .to.be.revertedWith(/AccessControl: account .* is missing role .*/);
    });

    it("Should re-whitelist the blacklisted account and its peers", async() => {
        await tokenContract.connect(owner).whitelistAccount(accounts[3].getAddress());
    });

    it("Should let re-whitelisted account and it's peers to transfer/receive", async() => {
        const amount = ethers.utils.parseEther("5");
        // transfer token to re-whitelisted address
        await tokenContract.connect(accounts[5]).transfer(accounts[3].getAddress(), amount);
        // transfer tokens from re-whitelisted peer
        await tokenContract.connect(accounts[2]).transfer(accounts[4].getAddress(), amount);
    });


});