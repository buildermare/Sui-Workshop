import React from "react";
import ReactDOM from "react-dom/client";
// Sui dApp Kit stillerini import et
import "@mysten/dapp-kit/dist/index.css";
// Radix UI stillerini import et
import "@radix-ui/themes/styles.css";

// Sui dApp kit provider'ları - cüzdan ve client yönetimi için
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
// React Query - veri sorgulama ve cacheleme için
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Radix UI Theme component'i
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { networkConfig } from "./networkConfig.ts";

// React Query client'ı oluştur
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        {/* Sui client provider - ağ konfigürasyonu ile */}
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          {/* Cüzdan provider - otomatik bağlanma özelliği ile */}
          <WalletProvider autoConnect>
            <App />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);
