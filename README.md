# Cartesi-Calculator  

## Overview  

This project is a simple implementation of a calculator utilizing [Cartesi Rollups](https://docs.cartesi.io/cartesi-rollups/1.5/).  

The purpose of this project is to demonstrate how to integrate Cartesi with a frontend application, allowing off-chain computation while maintaining blockchain verifiability.  

---

### Features  
- **Cartesi Rollups Integration**: Processes calculations off-chain using [Cartesi Rollups](https://docs.cartesi.io/cartesi-rollups/1.5/) while ensuring verifiability.  
- **Basic Integer Arithmetic**: Supports only integer calculations for simplicity.  
- **Next.js Frontend**: A responsive interface for inputting arithmetic expressions and displaying results.  
- **RainbowKit Wallet Connection**: Easily connect Web3 wallets via [RainbowKit](https://www.rainbowkit.com/) for seamless blockchain interactions.  

---

### Prerequisites 
- [Docker RISC-V support](https://docs.cartesi.io/cartesi-rollups/1.5/quickstart/)
- [@cartesi/cli](https://docs.cartesi.io/cartesi-rollups/1.5/quickstart/)
- [@wagmi/cli](https://wagmi.sh/cli/why)
- [@cartesi/rollups](https://www.npmjs.com/package/@cartesi/rollups)
- [@sunodo/wagmi-plugin-hardhat-deploy](https://www.npmjs.com/package/@sunodo/wagmi-plugin-hardhat-deploy)

### Build

```
cd calculator
cartesi build
```

```
cd frontend
npm i
npm run build
```

### Run

```
cd calculator
cartesi run
```

```
cd frontend
npm run dev
```
---

