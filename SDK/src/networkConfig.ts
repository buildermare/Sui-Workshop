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
          "0xd75056c08268e5551f54500e54c61a76588127037f928fdfc042567c3a8e596b", // TODO: Eğitmenden package ID al
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"), // Test ağı URL'i
      variables: {
        packageId:
          "0xd75056c08268e5551f54500e54c61a76588127037f928fdfc042567c3a8e596b", // TODO: Eğitmenden package ID al
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"), // Ana ağ URL'i
      variables: {
        packageId: "0x[INSTRUCTOR_PROVIDED_PACKAGE_ID]", // TODO: Eğitmenden package ID al
      },
    },
  });

// Hook'ları ve konfigürasyonu export et
export { useNetworkVariable, useNetworkVariables, networkConfig };
