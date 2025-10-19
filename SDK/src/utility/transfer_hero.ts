// Import the Transaction class from the SUI transactions library. This is needed to create a new transaction.
import { Transaction } from "@mysten/sui/transactions";

// This function is for transferring a hero to another address. It takes the package ID, hero's ID, and the recipient's address as input.
export const transferHero = (packageId: string, heroId: string, to: string) => {
  // Create a new transaction object.
  const tx = new Transaction();

  // Create a new move call to the 'transfer_hero' function in the smart contract.
  tx.moveCall({
    // The target function to call, constructed from the package ID.
    target: `${packageId}::hero::transfer_hero`,
    // The arguments for the function: the hero's ID and the recipient's address.
    arguments: [
      tx.object(heroId), 
      tx.pure.address(to)
    ],
  });
  
  // Return the created transaction.
  return tx;
};
