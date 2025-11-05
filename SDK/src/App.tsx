// Sui dApp Kit'ten ConnectButton bileşenini import ediyoruz - bu cüzdan bağlantı butonu için kullanılır
import { ConnectButton } from "@mysten/dapp-kit";
// Radix UI kütüphanesinden gerekli UI bileşenlerini import ediyoruz
import { Box, Container, Flex, Heading, Separator } from "@radix-ui/themes";
// React'ten useState hook'ini import ediyoruz - bu bileşen durum yönetimi için kullanılır
import { useState } from "react";
// Cüzdan durumunu gösteren bileşeni import ediyoruz
import { WalletStatus } from "./components/WalletStatus";
// Hero oluşturma bileşenini import ediyoruz
import { CreateHero } from "./components/CreateHero";
// Sahip olunan nesneleri gösteren bileşeni import ediyoruz
import { OwnedObjects } from "./components/OwnedObjects";
// Paylaşılan nesneleri (marketplace) gösteren bileşeni import ediyoruz
import SharedObjects from "./components/SharedObjects";
// Olay geçmişini gösteren bileşeni import ediyoruz
import EventsHistory from "./components/EventsHistory";

function App() {
  // refreshKey state'i - bileşenleri yenilemek için kullanılır
  // Örneğin bir işlem yapıldıktan sonra verileri güncellemek için bu state değiştirilir
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <>
      {/* Header - Sayfanın üst kısmı */}
      <Flex
        position="sticky" // Sayfa kaydırıldığında header'ın üstte kalmasını sağlar
        px="4" // Yatay padding
        py="3" // Dikey padding
        justify="between" // İçerikleri aralık olarak dağıt
        align="center" // Dikey olarak ortala
        style={{
          borderBottom: "1px solid var(--gray-a2)", // Alt çizgi
          background: "var(--color-background)", // Arka plan rengi
          zIndex: 10, // Diğer elementlerin üzerinde kalmasını sağlar
        }}
      >
        <Box>
          <Heading size="6">Hero NFT Marketplace</Heading>
        </Box>

        <Box>
          {/* Cüzdan bağlantı butonu - Sui dApp Kit tarafından sağlanır */}
          <ConnectButton />
        </Box>
      </Flex>

      {/* Ana İçerik Alanı */}
      <Container size="4" style={{ padding: "24px" }}>
        <Flex direction="column" gap="8">
          {/* Cüzdan Durumu Bölümü */}
          <Box>
            {/* Kullanıcının cüzdan bilgilerini ve bakiyesini gösterir */}
            <WalletStatus />
          </Box>

          <Separator size="4" />

          {/* Hero Oluşturma Bölümü */}
          <Box>
            {/* Yeni bir Hero NFT'si oluşturmak için kullanılan form */}
            <CreateHero refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
          </Box>

          <Separator size="4" />

          {/* Sahip Olunan Hero'lar Bölümü */}
          <Box>
            {/* Kullanıcının sahip olduğu tüm Hero NFT'lerini listeler */}
            <OwnedObjects
              refreshKey={refreshKey}
              setRefreshKey={setRefreshKey}
            />
          </Box>

          <Separator size="4" />

          {/* Marketplace (Pazar Yeri) Bölümü */}
          <Box>
            {/* Satılık olan Hero'ları gösteren pazar yeri */}
            <SharedObjects
              refreshKey={refreshKey}
              setRefreshKey={setRefreshKey}
            />
          </Box>

          <Separator size="4" />

          {/* Olay Geçmişi Bölümü */}
          <Box>
            {/* Yapılan işlemlerin (satın alma, satma vb.) geçmişini gösterir */}
            <EventsHistory refreshKey={refreshKey} />
          </Box>
        </Flex>
      </Container>
    </>
  );
}

export default App;
