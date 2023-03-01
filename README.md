# BlackList-WhiteList Token

Deployed token address: <a href="https://goerli.etherscan.io/address/0x6a1bE7a8e9D85e9aC7c2F427143848d50789B1aa">0x6a1bE7a8e9D85e9aC7c2F427143848d50789B1aa</a>

## Setup
- Install the dependencies.
  ```
  npm install
  ```
- Create `.env` file and setup environment variables required. For reference follow `.env.example`.
  ```
  touch .env
  ```
  ```
  <!-- .env file format -->
  ALCHEMY_API_KEY=<YOUR_KEY>
  MNEMONIC=<YOUR_MNEMONIC>
  ETHERSCAN_API_KEY=<YOUR_KEY>
  ```
- Compile the SmartContracts.
  ```
  npx hardhat compile
  ```
- Run the tests script under `./test`.
  ```
  npx hardhat test
  ```
- Deploy and verify the Smart Contract.
  ```
  npx hardhat run ./scripts/deploy.ts --network goerli
  ```
- Test the Deployed Smart Contract using `scripts/useToken.ts`. Change the global variable `tokenAddress` with the deployed token address. To run the script -
  ```
  npx hardhat run scripts/useToken.ts --network goerli
  ```

Note: `./scripts/useToken.tsx` script can be directly used in React Frontend to interact with the smart contract.

## Onchain Whitelisting

1. Architecture for Storing whitelist on chain (not optimized will consume a lot of gas while changing whitelist and blacklist accounts)
    <image src="./onchain.jpg">


2. Architecture for Storing Whitelist offchain and using merkle root onchain. (any time admin makes changes to whitelist/blacklist addresses they just need to update merkle root on chain, which is gas efficient)
    <image src="./offchainWithMerkleProof.jpg">