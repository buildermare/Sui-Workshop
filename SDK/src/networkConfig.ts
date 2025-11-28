// Sui client'ten node URL'lerini almak için
import { getFullnodeUrl } from "@mysten/sui/client";
// dApp kit'ten ağ konfigürasyonu oluşturmak için
import { createNetworkConfig } from "@mysten/dapp-kit";

// Farklı ağlar (devnet, testnet, mainnet) için konfigürasyon oluştur
const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"), // Geliştirme ağı URL'i
      variables: {
        packageId:
          "0x93d7d3a832f46e6e8f65fb3f68ba7a3d5adf87d7b1fc502dbbf9150444143a11", // TODO: Eğitmenden package ID al
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"), // Test ağı URL'i
      variables: {
        packageId:
          "0x93d7d3a832f46e6e8f65fb3f68ba7a3d5adf87d7b1fc502dbbf9150444143a11", // TODO: Eğitmenden package ID al
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"), // Ana ağ URL'i
      variables: {
        packageId:
          "0x93d7d3a832f46e6e8f65fb3f68ba7a3d5adf87d7b1fc502dbbf9150444143a11", // TODO: Eğitmenden package ID al
      },
    },
  });

// Hook'ları ve konfigürasyonu export et
export { useNetworkVariable, useNetworkVariables, networkConfig };
