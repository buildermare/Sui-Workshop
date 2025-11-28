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
          "0x13220bb077dbbf895506a8fb424db3c9e85c2911a64de899fc32d57e1177437c", // TODO: Eğitmenden package ID al
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"), // Test ağı URL'i
      variables: {
        packageId:
          "0x13220bb077dbbf895506a8fb424db3c9e85c2911a64de899fc32d57e1177437c", // TODO: Eğitmenden package ID al
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"), // Ana ağ URL'i
      variables: {
        packageId:
          "0x13220bb077dbbf895506a8fb424db3c9e85c2911a64de899fc32d57e1177437c", // TODO: Eğitmenden package ID al
      },
    },
  });

// Hook'ları ve konfigürasyonu export et
export { useNetworkVariable, useNetworkVariables, networkConfig };
