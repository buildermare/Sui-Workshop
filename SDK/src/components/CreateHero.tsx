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

export function CreateHero({ refreshKey, setRefreshKey }: RefreshProps) {
  const account = useCurrentAccount(); // Mevcut cüzdan hesabı
  const packageId = useNetworkVariable("packageId"); // Smart contract package ID
  const suiClient = useSuiClient(); // Sui client
  const { mutate: signAndExecute } = useSignAndExecuteTransaction(); // İşlem imzalama ve çalıştırma

  // Form state'leri
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [power, setPower] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateHero = async () => {
    if (
      !account ||
      !packageId ||
      !name.trim() ||
      !imageUrl.trim()
    )
      return;

    setIsCreating(true);

    // 0 ile 100 arasında random power değeri oluştur
    const randomPower = Math.floor(Math.random() * 101);
    setPower(randomPower);

    // Hero oluşturma işlemini hazırla
    const tx = createHero(packageId, name, imageUrl, randomPower.toString());
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

          // Form'u temizle ve listeyi yenile
          setName("");
          setImageUrl("");
          setRefreshKey(refreshKey + 1);
          setIsCreating(false);
        },
        onError: () => {
          setIsCreating(false);
        },
      },
    );
  };

  const isFormValid =
    name.trim() && imageUrl.trim();

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
        {name && imageUrl && (
          <Card style={{ padding: "16px", background: "var(--gray-a2)" }}>
            <Flex direction="column" gap="2">
              <Text size="3" weight="medium" color="gray">
                Preview:
              </Text>
              <Text size="4">
                {name}
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
