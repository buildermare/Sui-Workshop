## — Hero NFT DApp (React + Sui dApp Kit)

A learning-oriented React DApp that interacts with the `nft_module::hero` smart contract. This application provides a complete NFT marketplace experience where users can create, transfer, list, and buy Hero NFTs. The code intentionally leaves utility function implementations as TODOs to be completed while following along.

### What's inside

- **Frontend Framework**: React + TypeScript + Vite
- **Sui Integration**: @mysten/dapp-kit for wallet connection and blockchain interaction
- **UI Framework**: Radix UI for modern, accessible components
- **Smart Contract Integration**: Connects to `nft_module::hero` Move module
- **Features**:
  - **Wallet Connection**: Connect/disconnect Sui wallet with balance display
  - **Hero Creation**: Mint new Hero NFTs with name, image, and power
  - **Hero Management**: View owned heroes with transfer and listing capabilities
  - **NFT Marketplace**: Browse and purchase listed heroes from other users
  - **Event History**: Track all HeroListed and HeroBought events
  - **Real-time Updates**: Automatic UI refresh after each transaction

### Architecture

```
src/
├── components/           # React components
│   ├── WalletStatus.tsx    # Wallet connection & balance
│   ├── CreateHero.tsx      # Hero minting form
│   ├── OwnedObjects.tsx    # User's heroes management
│   ├── SharedObjects.tsx   # Marketplace listings
│   └── EventsHistory.tsx   # Transaction history
├── utility/             # Transaction builders (PTBs)
│   ├── create_hero.ts      # Hero creation PTB
│   ├── transfer_hero.ts    # Hero transfer PTB
│   ├── list_hero.ts        # Hero listing PTB
│   └── buy_hero.ts         # Hero purchase PTB
├── types/               # TypeScript interfaces
│   ├── hero.ts             # Hero & Event types
│   └── props.ts            # Shared prop interfaces
├── networkConfig.ts     # Network & package configuration
└── App.tsx             # Main application layout
```

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** package manager
- **Slush Wallet** (browser extension)
- **Package ID**: Obtain from your instructor for shared marketplace experience

### Setup Instructions

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Configure Package ID

**⚠️ IMPORTANT**: Get the `packageId` from your instructor and add it to `src/networkConfig.ts`:

```typescript
const { networkConfig } = createNetworkConfig({
  devnet: {
    url: getFullnodeUrl("devnet"),
    variables: {
      packageId: "0x[INSTRUCTOR_PROVIDED_PACKAGE_ID]", // 👈 Replace this
    },
  },
  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: {
      packageId: "0x[INSTRUCTOR_PROVIDED_PACKAGE_ID]", // 👈 Replace this
    },
  },
  ...
});
```

**Why instructor's Package ID?**
Using the same package ID ensures all students interact with the same smart contract deployment, enabling a shared marketplace where everyone can buy/sell heroes from each other.

#### 3. Complete Utility Functions (TODOs)

Navigate to `src/utility/` and complete the Programmatic Transaction Block (PTB) implementations:

**File: `src/utility/create_hero.ts`**

```typescript
export const createHero = (
  packageId: string,
  name: string,
  imageUrl: string,
  power: string
) => {
  const tx = new Transaction();

  // TODO: Add moveCall for nft_module::hero::create_hero
  // Hint: Use tx.pure.string() for strings and tx.pure.u64() for numbers

  return tx;
};
```

**File: `src/utility/transfer_hero.ts`**

```typescript
export const transferHero = (packageId: string, heroId: string, to: string) => {
  const tx = new Transaction();

  // TODO: Add moveCall for nft_module::hero::transfer_hero
  // Hint: Use tx.object() for object IDs and tx.pure.address() for addresses

  return tx;
};
```

**File: `src/utility/list_hero.ts`**

```typescript
export const listHero = (
  packageId: string,
  heroId: string,
  priceInSui: string
) => {
  const tx = new Transaction();

  // TODO: Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
  // TODO: Add moveCall for nft_module::hero::list_hero

  return tx;
};
```

**File: `src/utility/buy_hero.ts`**

```typescript
export const buyHero = (
  packageId: string,
  listHeroId: string,
  priceInSui: string
) => {
  const tx = new Transaction();

  // TODO: Convert SUI to MIST
  // TODO: Use tx.splitCoins() to create payment coin from gas
  // TODO: Add moveCall for nft_module::hero::buy_hero

  return tx;
};
```

### Development

#### Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Build for Production

```bash
npm run build
```

### Usage Guide

1. **Connect Wallet**: Click "Connect Wallet" to link your Sui wallet
2. **Create Heroes**: Fill the form to mint new Hero NFTs (name, image URL, power level)
3. **Manage Heroes**: View your owned heroes, transfer to others, or list for sale
4. **Browse Marketplace**: See all listed heroes from the class and purchase them
5. **Track Activity**: Monitor all listing and purchase events in real-time

### Smart Contract Functions

The DApp interacts with these `nft_module::hero` functions:

- **`create_hero(name, image_url, power)`** — Mint a new Hero NFT
- **`transfer_hero(hero, to)`** — Transfer hero to another address
- **`list_hero(hero, price)`** — List hero for sale in marketplace
- **`buy_hero(list_hero, coin)`** — Purchase a listed hero

### Implementation Guide (PTB Mapping)

#### Transaction Structure

```typescript
import { Transaction } from "@mysten/sui/transactions";

const tx = new Transaction();
tx.moveCall({
  target: `${packageId}::hero::function_name`,
  arguments: [
    /* your arguments */
  ],
});
```

#### Argument Types

- **Strings**: `tx.pure.string(value)`
- **Numbers**: `tx.pure.u64(value)`
- **Addresses**: `tx.pure.address(value)`
- **Objects**: `tx.object(objectId)`
- **Coins**: `tx.splitCoins(tx.gas, [amount])`

#### SUI ↔ MIST Conversion

```typescript
// SUI to MIST (for blockchain)
const mistAmount = Number(suiAmount) * 1_000_000_000;

// MIST to SUI (for display)
const suiAmount = Number(mistAmount) / 1_000_000_000;
```

### Troubleshooting

- **"Package not found"**: Verify package ID is correctly set in `networkConfig.ts`
- **Transaction fails**: Check wallet has sufficient SUI for gas fees
- **Heroes not loading**: Ensure wallet is connected and on correct network
- **Marketplace empty**: Wait for other users to list heroes, or list your own
- **Buy button disabled**: Ensure exact price match and sufficient balance
- **Linter warnings about unused parameters**: This is normal! The warnings will disappear as you complete the TODO functions in `src/utility/` files
- **DApp not working**: Make sure all TODO implementations in utility functions are completed

### Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Radix UI** - Component library
- **@mysten/dapp-kit** - Sui wallet integration
- **@mysten/sui** - Sui SDK for transactions
- **@tanstack/react-query** - Data fetching & caching

### Learning Objectives

By completing this module, you will learn:

1. **Sui dApp Development**: Connect React apps to Sui blockchain
2. **Transaction Building**: Create PTBs (Programmatic Transaction Blocks)
3. **Wallet Integration**: Handle wallet connection and user authentication
4. **Real-time Data**: Query and display blockchain data dynamically
5. **Event Handling**: Listen to and display smart contract events
6. **State Management**: Manage complex UI state with automatic updates
