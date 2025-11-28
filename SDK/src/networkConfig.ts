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
          "0x49069d84806a85873189623de106e1f0532253ad48e47dfbf2035cf2e39d6053", // TODO: Eğitmenden package ID al
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"), // Test ağı URL'i
      variables: {
        packageId:
          "0x49069d84806a85873189623de106e1f0532253ad48e47dfbf2035cf2e39d6053", // TODO: Eğitmenden package ID al
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"), // Ana ağ URL'i
      variables: {
        packageId:
          "0x49069d84806a85873189623de106e1f0532253ad48e47dfbf2035cf2e39d6053", // TODO: Eğitmenden package ID al
      },
    },
  });

// Hook'ları ve konfigürasyonu export et
export { useNetworkVariable, useNetworkVariables, networkConfig };
