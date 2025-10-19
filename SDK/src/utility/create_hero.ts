// Import the Transaction class from the SUI transactions library. This is needed to create a new transaction.
import { Transaction } from "@mysten/sui/transactions";

// This function is for creating a new hero. It takes the package ID, name, image URL, and power as input.
export const createHero = (packageId: string, name: string, imageUrl: string, power: string) => {
  // Create a new transaction object.
  const tx = new Transaction();
  
  // Create a new move call to the 'create_hero' function in the smart contract.
  tx.moveCall({
    // The target function to call, constructed from the package ID.
    target: `${packageId}::hero::create_hero`,
    // The arguments for the function: the hero's name, image URL, and power.
    arguments: [
      tx.pure.string(name), 
      tx.pure.string(imageUrl), 
      tx.pure.u64(Number(power))
    ],
  });
  
  // Return the created transaction.
  return tx;
};