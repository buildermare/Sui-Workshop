import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Card, Grid, Button, Badge } from "@radix-ui/themes";
import { useState } from "react";
import { useNetworkVariable } from "../networkConfig";
import { ListHero } from "../types/hero";
// Import the buyHero utility function to handle the purchase transaction.
import { buyHero } from "../utility/buy_hero";
import { RefreshProps } from "../types/props";

export default function SharedObjects({ refreshKey, setRefreshKey }: RefreshProps) {
  // Get the current user's account information.
  const account = useCurrentAccount();
  // Get the packageId from the network configuration.
  const packageId = useNetworkVariable("packageId");
  // Get the SUI client for interacting with the blockchain.
  const suiClient = useSuiClient();
  const [isBuying, setIsBuying] = useState<{ [key: string]: boolean }>({});
  // Hook to sign and execute transactions.
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // Query for 'HeroListed' events to find all listed heroes.
  const { data: listedEvents, isPending: eventsLoading } = useSuiClientQuery(
    "queryEvents",
    {
      query: {
        // Filter for the specific event type from our smart contract.
        MoveEventType: `${packageId}::hero::HeroListed`
      },
      limit: 50, // Get the latest 50 events.
      order: "descending" // Order them from newest to oldest.
    },
    {
      // Only run this query if the packageId is available.
      enabled: !!packageId,
      // The query will re-run if these keys change.
      queryKey: ["queryEvents", packageId, "HeroListed", refreshKey],
    }
  );

  // Get the details of the listed hero objects using their IDs from the events.
  const { data, isPending, error } = useSuiClientQuery(
    "multiGetObjects",
    {
      // Get the object IDs from the event data.
      ids: listedEvents?.data?.map(event => (event.parsedJson as any).id) || [],
      options: {
        showContent: true, // We want to see the content of the objects.
        showType: true // And their types.
      }
    },
    {
      // Only run this query if packageId and listedEvents data are available.
      enabled: !!packageId && !!listedEvents?.data?.length,
      // The query will re-run if these keys change.
      queryKey: ["multiGetObjects", listedEvents?.data?.map(event => (event.parsedJson as any).id), refreshKey],
    }
  );

  // This function handles the logic for buying a hero.
  const handleBuy = (listHeroId: string, price: string) => {
    // Don't do anything if there's no account or packageId.
    if (!account || !packageId) return;
    
    setIsBuying(prev => ({ ...prev, [listHeroId]: true }));
    
    // Create the transaction to buy the hero using the utility function.
    const tx = buyHero(packageId, listHeroId, price);
    // Sign and execute the transaction.
    signAndExecute(
      { transaction: tx },
      {
        // This will be called when the transaction is successful.
        onSuccess: async ({ digest }) => {
          // Wait for the transaction to be finalized on the blockchain.
          await suiClient.waitForTransaction({
            digest,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });
          
          // Refresh the list of heroes.
          setRefreshKey(refreshKey + 1);
          setIsBuying(prev => ({ ...prev, [listHeroId]: false }));
        },
        // This will be called if there's an error.
        onError: () => {
          setIsBuying(prev => ({ ...prev, [listHeroId]: false }));
        }
      }
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

  const listedHeroes = data.filter(obj => obj.data?.content && 'fields' in obj.data.content);

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
                      borderRadius: "8px" 
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {/* Hero Info */}
                  <Flex direction="column" gap="2">
                    <Flex align="center" gap="2">
                      <Text size="5" weight="bold">{heroFields.name}</Text>
                      {fields.seller === account?.address && (
                        <Badge color="orange" size="1">
                          Your Listing
                        </Badge>
                      )}
                    </Flex>
                    <Badge color="blue" size="2">Power: {heroFields.power}</Badge>
                    <Badge color="green" size="2">Price: {priceInSui.toFixed(2)} SUI</Badge>
                    
                    <Text size="3" color="gray">
                      Seller: {fields.seller.slice(0, 6)}...{fields.seller.slice(-4)}
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
                        : `Buy for ${priceInSui.toFixed(2)} SUI`
                    }
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