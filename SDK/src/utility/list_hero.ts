// Import the Transaction class from the SUI transactions library. This is needed to create a new transaction.
import { Transaction } from "@mysten/sui/transactions";

// This function is for listing a hero for sale. It takes the package ID, hero's ID, and the price in SUI as input.
export const listHero = (packageId: string, heroId: string, priceInSui: string) => {
  // Create a new transaction object.
  const tx = new Transaction();

  // Convert the price from SUI to MIST (the smallest unit of SUI). 1 SUI = 1,000,000,000 MIST.
  const priceInMist = Number(priceInSui) * 1_000_000_000;

  // Create a new move call to the 'list_hero' function in the smart contract.
  tx.moveCall({
    // The target function to call, constructed from the package ID.
    target: `${packageId}::hero::list_hero`,
    // The arguments for the function: the hero's ID and the price in MIST.
    arguments: [
      tx.object(heroId), 
      tx.pure.u64(priceInMist)
    ],
  });
  
  // Return the created transaction.
  return tx;
};