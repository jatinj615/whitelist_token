# BlackList-WhiteList Token

## Setup
- Install the dependencies.
  ```
  npm install
  ```
- Create `.env` file and setup environment variables required. For reference look at `.env.example`.
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