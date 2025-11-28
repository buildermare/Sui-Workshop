// Sui dApp kit hook'ları - cüzdan, sorgulama ve işlem yönetimi için
import {
  useCurrentAccount,
  useSuiClientQuery,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import {
  Flex,
  Heading,
  Text,
  Card,
  Grid,
  Button,
  Badge,
} from "@radix-ui/themes";
import { useState } from "react";
import { useNetworkVariable } from "../networkConfig";
import { ListHero } from "../types/hero";
// Hero satın alma işlemi için utility fonksiyonu
import { buyHero } from "../utility/buy_hero";
import { RefreshProps } from "../types/props";

export default function SharedObjects({
  refreshKey,
  setRefreshKey,
}: RefreshProps) {
  const account = useCurrentAccount(); // Mevcut cüzdan hesabı
  const packageId = useNetworkVariable("packageId"); // Smart contract package ID
  const suiClient = useSuiClient(); // Sui client
  const [isBuying, setIsBuying] = useState<{ [key: string]: boolean }>({}); // Her hero için satın alma durumu
  const { mutate: signAndExecute } = useSignAndExecuteTransaction(); // İşlem imzalama ve çalıştırma

  // Satışa çıkarılan hero'ları bulmak için 'HeroListed' olaylarını sorgula
  const { data: listedEvents, isPending: eventsLoading } = useSuiClientQuery(
    "queryEvents",
    {
      query: {
        // Sadece smart contract'tan gelen HeroListed olaylarını filtrele
        MoveEventType: `${packageId}::hero::HeroListed`,
      },
      limit: 50, // Son 50 olayı al
      order: "descending", // Yeniden eskiye doğru sırala
    },
    {
      // Sadece packageId varsa bu sorguyu çalıştır
      enabled: !!packageId,
      // Bu anahtarlar değişirse sorgu yeniden çalışır
      queryKey: ["queryEvents", packageId, "HeroListed", refreshKey],
    },
  );

  // Olaylardan gelen ID'leri kullanarak satıştaki hero nesnelerinin detaylarını al
  const { data, isPending, error } = useSuiClientQuery(
    "multiGetObjects",
    {
      // Olay verilerinden nesne ID'lerini al
      ids:
        listedEvents?.data?.map((event) => (event.parsedJson as any).id) || [],
      options: {
        showContent: true, // Nesne içeriğini göster
        showType: true, // Nesne tiplerini göster
      },
    },
    {
      // Sadece packageId ve listedEvents verisi varsa bu sorguyu çalıştır
      enabled: !!packageId && !!listedEvents?.data?.length,
      // Bu anahtarlar değişirse sorgu yeniden çalışır
      queryKey: [
        "multiGetObjects",
        listedEvents?.data?.map((event) => (event.parsedJson as any).id),
        refreshKey,
      ],
    },
  );

  // Hero satın alma işlemini yöneten fonksiyon
  const handleBuy = (listHeroId: string, price: string) => {
    if (!account || !packageId) return;

    setIsBuying((prev) => ({ ...prev, [listHeroId]: true }));

    // Hero satın alma işlemini oluştur
    const tx = buyHero(packageId, listHeroId, price);
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          // İşlemin blockchain'de onaylanmasını bekle
          await suiClient.waitForTransaction({
            digest,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });

          // Hero listesini yenile
          setRefreshKey(refreshKey + 1);
          setIsBuying((prev) => ({ ...prev, [listHeroId]: false }));
        },
        onError: () => {
          setIsBuying((prev) => ({ ...prev, [listHeroId]: false }));
        },
      },
    );
  };

  if (error) {
    return (
      <Card>
        <Text color="red">Error loading listed heroes: {error.message}</Text>
      </Card>
    );
  }

  if (eventsLoading) {
    return (
      <Card>
        <Text>Loading marketplace...</Text>
      </Card>
    );
  }

  if (!listedEvents?.data?.length) {
    return (
      <Flex direction="column" gap="4">
        <Heading size="5">Hero Marketplace (0)</Heading>
        <Card>
          <Text>No heroes are currently listed for sale</Text>
        </Card>
      </Flex>
    );
  }

  if (isPending || !data) {
    return (
      <Card>
        <Text>Loading marketplace...</Text>
      </Card>
    );
  }

  const listedHeroes = data.filter(
    (obj) => obj.data?.content && "fields" in obj.data.content,
  );

  return (
    <Flex direction="column" gap="4">
      <Heading size="6">Hero Marketplace ({listedHeroes.length})</Heading>

      {listedHeroes.length === 0 ? (
        <Card>
          <Text>No heroes are currently listed for sale</Text>
        </Card>
      ) : (
        <Grid columns="3" gap="4">
          {listedHeroes.map((obj) => {
            const listHero = obj.data?.content as any;
            const listHeroId = obj.data?.objectId!;
            const fields = listHero.fields as ListHero;
            const heroFields = fields.nft.fields;
            const priceInSui = Number(fields.price) / 1_000_000_000;

            return (
              <Card key={listHeroId} style={{ padding: "16px" }}>
                <Flex direction="column" gap="3">
                  {/* Hero Image */}
                  <img
                    src={heroFields.image_url}
                    alt={heroFields.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  {/* Hero Info */}
                  <Flex direction="column" gap="2">
                    <Flex align="center" gap="2">
                      <Text size="5" weight="bold">
                        {heroFields.name}
                      </Text>
                      {fields.seller === account?.address && (
                        <Badge color="orange" size="1">
                          Your Listing
                        </Badge>
                      )}
                    </Flex>
                    <Badge color="blue" size="2">
                      Power: {heroFields.power}
                    </Badge>
                    <Badge color="green" size="2">
                      Price: {priceInSui.toFixed(2)} SUI
                    </Badge>

                    <Text size="3" color="gray">
                      Seller: {fields.seller.slice(0, 6)}...
                      {fields.seller.slice(-4)}
                    </Text>
                  </Flex>

                  {/* Buy Button - Anyone can buy including owner */}
                  <Button
                    onClick={() => handleBuy(listHeroId, priceInSui.toString())}
                    disabled={!account || isBuying[listHeroId]}
                    loading={isBuying[listHeroId]}
                    color="green"
                  >
                    {!account
                      ? "Connect Wallet to Buy"
                      : isBuying[listHeroId]
                        ? "Buying..."
                        : `Buy for ${priceInSui.toFixed(2)} SUI`}
                  </Button>
                </Flex>
              </Card>
            );
          })}
        </Grid>
      )}
    </Flex>
  );
}



