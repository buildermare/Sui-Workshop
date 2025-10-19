// Import the Transaction class from the SUI transactions library. This is needed to create a new transaction.
import { Transaction } from "@mysten/sui/transactions";

// This function is for buying a hero. It takes the package ID, the hero's listing ID, and the price in SUI as input.
export const buyHero = (packageId: string, listHeroId: string, priceInSui: string) => {
  // Create a new transaction object.
  const tx = new Transaction();

  // Convert the price from SUI to MIST (the smallest unit of SUI). 1 SUI = 1,000,000,000 MIST.
  const priceInMist = Number(priceInSui) * 1_000_000_000;
  // Split the gas coin to get the exact amount needed for the payment.
  const [paymentCoin] = tx.splitCoins(tx.gas, [priceInMist]);
  
  // Create a new move call to the 'buy_hero' function in the smart contract.
  tx.moveCall({
    // The target function to call, constructed from the package ID.
    target: `${packageId}::hero::buy_hero`,
    // The arguments for the function: the hero's listing ID and the payment coin.
    arguments: [
      tx.object(listHeroId), 
      paymentCoin
    ],
  });
  
  // Return the created transaction.
  return tx;
};