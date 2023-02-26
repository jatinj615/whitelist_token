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
  npx hardhat run ./scripts/deploy.ts --network <NETWORK_NAME>
  ```

Note: `./scripts/useToken.tsx` script can be directly used in React Frontend to interact with the smart contract.