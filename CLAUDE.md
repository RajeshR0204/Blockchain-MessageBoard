# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Message Board DApp

## Tech Stack
- **Smart Contracts:** Solidity (^0.8.19)
- **Development Framework:** Truffle
- **Blockchain Emulator:** Ganache (Local RPC: http://127.0.0.1:7545)
- **Frontend:** React.js
- **Web3 Library:** ethers.js (^6.9.0)
- **Testing:** Mocha + Chai

## Project Structure
```
message-board/
├── contracts/
│   └── MessageBoard.sol        # Solidity contract
├── migrations/
│   └── 2_deploy_contracts.js   # Deployment script
├── test/
│   └── message_board_test.js   # Mocha test cases
├── truffle-config.js           # Network configuration
├── package.json                # Root dependencies
└── client/                     # React application
    ├── package.json
    ├── public/
    └── src/
        ├── App.js              # Frontend logic
        └── MessageBoard.json   # Contract ABI
```

## Development Workflow

### 1. Setup
```bash
cd message-board
npm install
```

### 2. Start Ganache
- Open Ganache GUI or run `ganache-cli`
- Ensure it's running on http://127.0.0.1:7545
- **Important:** Tests require Ganache to be running first

### 3. Compile, Test, Deploy
```bash
npx truffle compile
npx truffle test
npx truffle migrate --network development
```

### 4. Frontend Setup
```bash
cd client
npm install
npm start
```

### 5. Post-Deployment
- Copy contract address from migration output to `client/src/App.js` (CONTRACT_ADDRESS)
- Copy ABI from `build/contracts/MessageBoard.json` to `client/src/MessageBoard.json`

## Coding Standards
- Solidity 0.8.x for built-in overflow checks
- Use `calldata` for function parameters to save gas
- camelCase for variables/functions, PascalCase for contracts
