// Gerekli hook'ları ve bileşenleri kütüphanelerden import ediyoruz
// useCurrentAccount: Mevcut cüzdan hesabını almak için
// useSuiClientQuery: Sui blockchain'den veri sorgulamak için
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
// Radix UI kütüphanesinden gerekli UI bileşenlerini import ediyoruz
import { Flex, Text, Card } from "@radix-ui/themes";

export function WalletStatus() {
  // Mevcut kullanıcının hesap bilgisini alıyoruz
  const account = useCurrentAccount();

  // Mevcut hesabın bakiyesini sorguluyoruz
  const { data: balance } = useSuiClientQuery(
    "getBalance", // Sui blockchain'de bakiye sorgulama fonksiyonu
    {
      // Bakiyesi sorgulanacak hesabın sahibi
      owner: account?.address as string,
    },
    {
      // Sadece hesap bağlıysa bu sorguyu çalıştır
      enabled: !!account,
    },
  );

  // Eğer hesap bağlı değilse, cüzdan bağlama mesajı göster
  if (!account) {
    return (
      <Card>
        <Text>Devam etmek için lütfen cüzdanınızı bağlayın</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Flex direction="column" gap="2">
        <Text size="4" weight="bold">
          Cüzdan Durumu
        </Text>
        <Text>Adres: {account.address}</Text>
        <Text>
          {/* Sui'de bakiye 1_000_000_000 ile bölünür çünkü Sui 9 decimal basamak kullanır (mist)*/}
          Bakiye:{" "}
          {balance
            ? Number(balance.totalBalance) / 1_000_000_000
            : "Yükleniyor..."}{" "}
          SUI
        </Text>
      </Flex>
    </Card>
  );
}
