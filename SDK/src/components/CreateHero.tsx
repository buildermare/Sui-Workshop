// Sui dApp kit hook'ları - cüzdan ve işlem yönetimi için
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Flex, Heading, Text, Card, Button, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useNetworkVariable } from "../networkConfig";
import { createHero } from "../utility/create_hero";
import { RefreshProps } from "../types/props";
/* import { EnokiClient } from "@enoki-labs/enoki-clients"; // Bu hata verdi */
/* import { toB64 } from "@mysten/sui.js/utils"; // Bu yine hata verdi bende */
/* Sanırım paketler güncel değil yapay zekayla bunları buldum */
import { EnokiClient } from "@mysten/enoki";
import { toB64 } from "@mysten/sui/utils";

export function CreateHero({ refreshKey, setRefreshKey }: RefreshProps) {
  const account = useCurrentAccount(); // Mevcut cüzdan hesabı
  const packageId = useNetworkVariable("packageId"); // Smart contract package ID
  const suiClient = useSuiClient(); // Sui client
  const { mutate: signAndExecute } = useSignAndExecuteTransaction(); // İşlem imzalama ve çalıştırma

  // Form state'leri
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [power, setPower] = useState("");
  const [isCreating, setIsCreating] = useState(false);
/*
  const enoki = new EnokiClient({
    apiKey: process.env.REACT_APP_ENOKI_API_KEY, // Burası bende hata verdi nedense ts bilmiyom fazla gpt den yardım aldım
  });
*/

  const enoki = new EnokiClient({
    apiKey: import.meta.env.VITE_ENOKI_API_KEY,
  });

  const handleCreateHero = async () => {
    if (
      !account ||
      !packageId ||
      !name.trim() ||
      !imageUrl.trim() ||
      !power.trim()
    )
      return;

    setIsCreating(true);

    // Hero oluşturma işlemini hazırla
    const tx = createHero(packageId, name, imageUrl, power); /* Örnekteki işlemi yapıyor zaten */
    const txBytes = await tx.build({ client: suiClient , onlyTransactionKind: true /* Bu olmadığı zaman enoki hata veriyordu */}); 

    try {
      const sponsoredTx = await enoki.createSponsoredTransaction({
        network: "testnet",
        transactionKindBytes: toB64(txBytes),
        sender: account.address, /* parametreden geliyor */
        allowedMoveCallTargets: [
          `${packageId}::hero::create_hero`, /* packageId boştu parametreden doldurduk */
        ],
      });
  
      // Sponsorlu işlemi çalıştır
      const result = signAndExecute(
        { transaction: sponsoredTx.bytes /* güncel kütüphanede sponsoredTx bir obje datasına .bytes ile ulaşıyoruz sanırım */ },
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
  
            // Form'u temizle ve listeyi yenile
            setName("");
            setImageUrl("");
            setPower("");
            setRefreshKey(refreshKey + 1);
            console.log("NFT başarıyla oluşturuldu! Digest:", digest);
            setIsCreating(false);
          },
          onError: () => {
            setIsCreating(false);
          },
        },
      );
  
      return result;
  
    } catch (error) {
      console.error("Gas sponsorluğu başarısız:", error);
      setIsCreating(false); /* Bunu da eklememiz lazım sanırım ? */
    }

  };

  const isFormValid =
    name.trim() && imageUrl.trim() && power.trim() && Number(power) > 0;

  if (!account) {
    return (
      <Card>
        <Text>Please connect your wallet to create heroes</Text>
      </Card>
    );
  }

  return (
    <Card style={{ padding: "20px" }}>
      <Flex direction="column" gap="4">
        <Heading size="6">Create New Hero</Heading>

        <Flex direction="column" gap="3">
          <Flex direction="column" gap="2">
            <Text size="3" weight="medium">
              Hero Name
            </Text>
            <TextField.Root
              placeholder="Enter hero name (e.g., Fire Dragon)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Flex>

          <Flex direction="column" gap="2">
            <Text size="3" weight="medium">
              Image URL
            </Text>
            <TextField.Root
              placeholder="Enter image URL (e.g., https://example.com/hero.jpg)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </Flex>

          <Flex direction="column" gap="2">
            <Text size="3" weight="medium">
              Power Level
            </Text>
            <TextField.Root
              placeholder="Enter power level (e.g., 100)"
              type="number"
              min="1"
              value={power}
              onChange={(e) => setPower(e.target.value)}
            />
          </Flex>

          <Button
            onClick={handleCreateHero}
            disabled={!isFormValid || isCreating}
            size="3"
            loading={isCreating}
            style={{ marginTop: "8px" }}
          >
            {isCreating ? "Creating Hero..." : "Create Hero"}
          </Button>
        </Flex>

        {/* Preview */}
        {name && imageUrl && power && (
          <Card style={{ padding: "16px", background: "var(--gray-a2)" }}>
            <Flex direction="column" gap="2">
              <Text size="3" weight="medium" color="gray">
                Preview:
              </Text>
              <Text size="4">
                {name} (Power: {power})
              </Text>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={name}
                  style={{
                    width: "120px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </Flex>
          </Card>
        )}
      </Flex>
    </Card>
  );
}
