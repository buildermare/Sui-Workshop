import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Card, Grid, Button, TextField, Badge, Tabs } from "@radix-ui/themes";
import { useState } from "react";
import { useNetworkVariable } from "../networkConfig";
import { Hero } from "../types/hero";
import { transferHero } from "../utility/transfer_hero";
import { listHero } from "../utility/list_hero";
import { RefreshProps } from "../types/props";

export function OwnedObjects({ refreshKey, setRefreshKey }: RefreshProps) {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");
  const suiClient = useSuiClient();
  const [transferAddress, setTransferAddress] = useState<{ [key: string]: string }>({});
  const [listPrice, setListPrice] = useState<{ [key: string]: string }>({});
  const [isTransferring, setIsTransferring] = useState<{ [key: string]: boolean }>({});
  const [isListing, setIsListing] = useState<{ [key: string]: boolean }>({});
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
      filter: {
        StructType: `${packageId}::hero::Hero`
      },
      options: {
        showContent: true,
        showType: true
      }
    },
    {
      enabled: !!account && !!packageId,
      queryKey: ["getOwnedObjects", account?.address, packageId, refreshKey],
    }
  );

  const copyToClipboard = (text: string, heroId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [heroId]: true }));
    
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [heroId]: false }));
    }, 2000);
  };

  const handleTransfer = (heroId: string, address: string) => {
    if (!address.trim() || !packageId) return;
    
    setIsTransferring(prev => ({ ...prev, [heroId]: true }));
    
    const tx = transferHero(packageId, heroId, address);
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({
            digest,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });
          
          setTransferAddress(prev => ({ ...prev, [heroId]: "" }));
          setRefreshKey(refreshKey + 1);
          setIsTransferring(prev => ({ ...prev, [heroId]: false }));
        },
        onError: () => {
          setIsTransferring(prev => ({ ...prev, [heroId]: false }));
        }
      }
    );
  };

  const handleList = (heroId: string, price: string) => {
    if (!price.trim() || !packageId) return;
    
    setIsListing(prev => ({ ...prev, [heroId]: true }));
    
    const tx = listHero(packageId, heroId, price);
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({
            digest,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });
          
          setListPrice(prev => ({ ...prev, [heroId]: "" }));
          setRefreshKey(refreshKey + 1);
          setIsListing(prev => ({ ...prev, [heroId]: false }));
        },
        onError: () => {
          setIsListing(prev => ({ ...prev, [heroId]: false }));
        }
      }
    );
  };

  if (!account) {
    return (
      <Card>
        <Text>Please connect your wallet to see your heroes</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Text color="red">Error: {error.message}</Text>
      </Card>
    );
  }

  if (isPending || !data) {
    return (
      <Card>
        <Text>Loading your heroes...</Text>
      </Card>
    );
  }

  const heroes = data.data.filter(obj => obj.data?.content && 'fields' in obj.data.content);

  return (
    <Flex direction="column" gap="4">
      <Heading size="6">Your Heroes ({heroes.length})</Heading>
      
      {heroes.length === 0 ? (
        <Card>
          <Text>No heroes found in your wallet</Text>
        </Card>
      ) : (
        <Grid columns="3" gap="4">
          {heroes.map((obj) => {
            const hero = obj.data?.content as any;
            const heroId = obj.data?.objectId!;
            const fields = hero.fields as Hero;

            return (
              <Card key={heroId} style={{ padding: "16px" }}>
                <Flex direction="column" gap="3">
                  {/* Hero Image */}
                  <img 
                    src={fields.image_url} 
                    alt={fields.name}
                    style={{ 
                      width: "100%", 
                      height: "200px", 
                      objectFit: "cover", 
                      borderRadius: "8px" 
                    }}
                  />
                  
                  {/* Hero Info */}
                  <Flex direction="column" gap="2">
                    <Text size="5" weight="bold">{fields.name}</Text>
                    <Badge color="blue" size="2">Power: {fields.power}</Badge>
                    
                    <Flex align="center" gap="2">
                      <Text size="3" color="gray" style={{ 
                        fontFamily: "monospace"
                      }}>
                        {heroId.slice(0, 6)}...{heroId.slice(-6)}
                      </Text>
                      <Button 
                        size="1" 
                        variant="ghost"
                        onClick={() => copyToClipboard(heroId, heroId)}
                        color={copiedStates[heroId] ? "green" : undefined}
                      >
                        {copiedStates[heroId] ? "Copied!" : "Copy"}
                      </Button>
                    </Flex>
                  </Flex>

                  {/* Action Tabs */}
                  <Tabs.Root defaultValue="transfer">
                    <Tabs.List size="2">
                      <Tabs.Trigger value="transfer">Transfer</Tabs.Trigger>
                      <Tabs.Trigger value="list">List for Sale</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="transfer">
                      <Flex direction="column" gap="2" mt="3">
                        <TextField.Root
                          placeholder="Recipient address"
                          value={transferAddress[heroId] || ""}
                          onChange={(e) => setTransferAddress(prev => ({
                            ...prev,
                            [heroId]: e.target.value
                          }))}
                        />
                        <Button 
                          onClick={() => handleTransfer(heroId, transferAddress[heroId])}
                          disabled={!transferAddress[heroId]?.trim() || isTransferring[heroId]}
                          loading={isTransferring[heroId]}
                          color="blue"
                        >
                          {isTransferring[heroId] ? "Transferring..." : "Transfer Hero"}
                        </Button>
                      </Flex>
                    </Tabs.Content>

                    <Tabs.Content value="list">
                      <Flex direction="column" gap="2" mt="3">
                        <TextField.Root
                          placeholder="Price in SUI"
                          type="number"
                          value={listPrice[heroId] || ""}
                          onChange={(e) => setListPrice(prev => ({
                            ...prev,
                            [heroId]: e.target.value
                          }))}
                        />
                        <Button 
                          onClick={() => handleList(heroId, listPrice[heroId])}
                          disabled={!listPrice[heroId]?.trim() || isListing[heroId]}
                          loading={isListing[heroId]}
                          color="green"
                        >
                          {isListing[heroId] ? "Listing..." : "List for Sale"}
                        </Button>
                      </Flex>
                    </Tabs.Content>
                  </Tabs.Root>
                </Flex>
              </Card>
            );
          })}
        </Grid>
      )}
    </Flex>
  );
}
