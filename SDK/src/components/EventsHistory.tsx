// Sui dApp kit'ten çoklu sorgulama hook'u
import { useSuiClientQueries } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Card, Badge, Grid } from "@radix-ui/themes";
import { useNetworkVariable } from "../networkConfig";

interface EventsHistoryProps {
  refreshKey: number;
}

export default function EventsHistory({ refreshKey }: EventsHistoryProps) {
  const packageId = useNetworkVariable("packageId");

  // HeroListed, HeroBought ve HeroDelisted olaylarını aynı anda sorgula
  const eventQueries = useSuiClientQueries({
    queries: [
      {
        method: "queryEvents",
        params: {
          query: {
            MoveEventType: `${packageId}::hero::HeroListed`, // Satışa çıkarma olayları
          },
          limit: 20,
          order: "descending",
        },
        queryKey: ["queryEvents", packageId, "HeroListed", refreshKey],
        enabled: !!packageId,
      },
      {
        method: "queryEvents",
        params: {
          query: {
            MoveEventType: `${packageId}::hero::HeroBought`, // Satın alma olayları
          },
          limit: 20,
          order: "descending",
        },
        queryKey: ["queryEvents", packageId, "HeroBought", refreshKey],
        enabled: !!packageId,
      },
      {
        method: "queryEvents",
        params: {
          query: {
            MoveEventType: `${packageId}::hero::HeroDelisted`, // Satıştan çıkarma olayları
          },
          limit: 20,
          order: "descending",
        },
        queryKey: ["queryEvents", packageId, "HeroDelisted", refreshKey],
        enabled: !!packageId,
      },
    ],
  });

  const [listedEventsQuery, boughtEventsQuery, delistedEventsQuery] = eventQueries;
  const listedEvents = listedEventsQuery.data;
  const boughtEvents = boughtEventsQuery.data;
  const delistedEvents = delistedEventsQuery.data;
  const isListedPending = listedEventsQuery.isPending;
  const isBoughtPending = boughtEventsQuery.isPending;
  const isDelistedPending = delistedEventsQuery.isPending;

  const formatTimestamp = (timestamp: string) => {
    return new Date(Number(timestamp)).toLocaleString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatPrice = (price: string) => {
    return (Number(price) / 1_000_000_000).toFixed(2);
  };

  if (isListedPending || isBoughtPending || isDelistedPending) {
    return (
      <Card>
        <Text>Loading events history...</Text>
      </Card>
    );
  }

  const allEvents = [
    ...(listedEvents?.data || []).map((event) => ({
      ...event,
      type: "listed" as const,
    })),
    ...(boughtEvents?.data || []).map((event) => ({
      ...event,
      type: "bought" as const,
    })),
    ...(delistedEvents?.data || []).map((event) => ({
      ...event,
      type: "delisted" as const,
    })),
  ].sort((a, b) => Number(b.timestampMs) - Number(a.timestampMs));

  return (
    <Flex direction="column" gap="4">
      <Heading size="6">Recent Events ({allEvents.length})</Heading>

      {allEvents.length === 0 ? (
        <Card>
          <Text>No events found</Text>
        </Card>
      ) : (
        <Grid columns="1" gap="3">
          {allEvents.map((event, index) => {
            const eventData = event.parsedJson as any;

            return (
              <Card
                key={`${event.id.txDigest}-${index}`}
                style={{ padding: "16px" }}
              >
                <Flex direction="column" gap="2">
                  <Flex align="center" gap="3">
                    <Badge
                      color={
                        event.type === "listed"
                          ? "blue"
                          : event.type === "bought"
                            ? "green"
                            : "red"
                      }
                      size="2"
                    >
                      {event.type === "listed"
                        ? "Hero Listed"
                        : event.type === "bought"
                          ? "Hero Bought"
                          : "Hero Delisted"}
                    </Badge>
                    <Text size="3" color="gray">
                      {formatTimestamp(event.timestampMs!)}
                    </Text>
                  </Flex>

                  <Flex align="center" gap="4" wrap="wrap">
                    {event.type !== "delisted" && (
                      <Text size="3">
                        <strong>Price:</strong> {formatPrice(eventData.price)} SUI
                      </Text>
                    )}

                    {event.type === "listed" ? (
                      <Text size="3">
                        <strong>Seller:</strong>{" "}
                        {formatAddress(eventData.seller)}
                      </Text>
                    ) : event.type === "bought" ? (
                      <Flex gap="4">
                        <Text size="3">
                          <strong>Buyer:</strong>{" "}
                          {formatAddress(eventData.buyer)}
                        </Text>
                        <Text size="3">
                          <strong>Seller:</strong>{" "}
                          {formatAddress(eventData.seller)}
                        </Text>
                      </Flex>
                    ) : (
                      <Text size="3">
                        <strong>Seller:</strong>{" "}
                        {formatAddress(eventData.seller)}
                      </Text>
                    )}

                    <Text
                      size="3"
                      color="gray"
                      style={{ fontFamily: "monospace" }}
                    >
                      ID: {eventData.id.slice(0, 8)}...
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            );
          })}
        </Grid>
      )}
    </Flex>
  );
}
