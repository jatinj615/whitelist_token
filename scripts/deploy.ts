import { ethers } from "hardhat";
import * as readline from "readline-sync";
import { verifyContract } from "./utils";

async function main() {
  const [owner] = await ethers.getSigners();
  const tokenName = String(readline.question("Token Name: "));
  const tokenSymbol = String(readline.question("Token Symbol: "));
  const whitelistedAccounts = String(readline.question("Whitelisted accounts ','(comma) separated: ")).split(",");
  const exchangeRate = ethers.BigNumber.from(readline.question("Exchange rate in decimals: "));

  const tokenFactory = await ethers.getContractFactory("Token");
  const token = await tokenFactory.deploy(tokenName, tokenSymbol, exchangeRate, whitelistedAccounts);
  await token.deployed();

  await verifyContract(token.address, [tokenName, tokenSymbol, exchangeRate, whitelistedAccounts]);

  console.log("Token Deployed at the address: ", token.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
