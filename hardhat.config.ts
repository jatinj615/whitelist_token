import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import '@nomiclabs/hardhat-ethers'
import "@nomiclabs/hardhat-etherscan";
import '@typechain/hardhat'
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { NetworkUserConfig } from "hardhat/types";
import { ethers } from "ethers";

dotenvConfig({ path: resolve(__dirname, "./.env") });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// Ensure that we have all the environment variables we need.
let mnemonic: string;
if (!process.env.MNEMONIC) {
  throw new Error("Please set your MNEMONIC in a .env file");
} else {
  mnemonic = process.env.MNEMONIC;
}

let alchemyApiKey: string;
if (!process.env.ALCHEMY_API_KEY) {
  throw new Error("Please set your ALCHEMY_API_KEY in a .env file");
} else {
  alchemyApiKey = process.env.ALCHEMY_API_KEY;
}

let etherScanApiKey: string;
if (!process.env.ETHERSCAN_API_KEY) {
  throw new Error("Please set your ETHERSCAN_API_KEY in a .env file");
} else {
  etherScanApiKey = process.env.ETHERSCAN_API_KEY;
}

const chainIds = {
  goerli: 5,
  hardhat: 31337,
  mainnet: 1,
};

function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
  const url: string = "https://eth-" + network + ".alchemyapi.io/v2/" + alchemyApiKey;
  return {
    accounts: {
      count: 10,
      initialIndex: 0,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    gasPrice: ethers.utils.parseUnits('25', 'gwei').toNumber(),
    chainId: chainIds[network],
    url,
  };
}


function createSolidityVersion(version: string) {
  return {
    version: version,
    settings: {
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  };
}

export default {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
    hardhat: {
      accounts: {
        mnemonic,
      },
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/" + alchemyApiKey,
        blockNumber: 15588885,
      },
      chainId: chainIds.hardhat,
      live: false,
      saveDeployments: true,
      tags: ["test", "local"],
    },
    mainnet: createTestnetConfig("mainnet"),
    goerli: createTestnetConfig("goerli"),
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
    feeCollector: {
      default: 1, // here this will by default take the second account as feeCollector (so in the test this will be a different account than the deployer)
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      createSolidityVersion("0.8.0"),
      createSolidityVersion("0.8.10"),
      createSolidityVersion("0.8.17")
    ]
    
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 2000000
  },
  etherscan: {
    apiKey: etherScanApiKey
  }
};