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
        <Text size="4" weight="bold">Cüzdan Durumu</Text>
        <Text>Adres: {account.address}</Text>
        <Text>
          {/* Sui'de bakiye 1_000_000_000 ile bölünür çünkü Sui 9 decimal basamak kullanır */}
          Bakiye: {balance ? Number(balance.totalBalance) / 1_000_000_000 : "Yükleniyor..."} SUI
        </Text>
      </Flex>
    </Card>
  );
  }

  return (
    <Card>
      <Flex direction="column" gap="2">
        <Text size="4" weight="bold">
          Wallet Status
        </Text>
        <Text>Address: {account.address}</Text>
        <Text>
          Balance:{" "}
          {balance
            ? Number(balance.totalBalance) / 1_000_000_000
            : "Loading..."}{" "}
          SUI
        </Text>
      </Flex>
    </Card>
  );
}
