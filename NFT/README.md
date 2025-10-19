## — Hero NFT and Simple Listing (Sui Move)

A learning-oriented Sui Move module that models a simple NFT-like `Hero` object and a basic list/buy flow using a shared `ListHero` object. The code intentionally leaves a few TODOs to be completed while following along.

### What’s inside

- **Module**: `nft_module::hero`
- **Structs**:
  - **Hero**: key object with `name`, `image_url`, `power`.
  - **HeroMetadata**: immutable metadata object with unique `id` and creation `timestamp`.
  - **ListHero**: shared listing object that holds a `Hero`, its `price`, and the `seller` address.
- **Events**:
  - **HeroListed**: emitted when a hero is listed for sale with `id`, `price`, `seller`, and `timestamp`.
  - **HeroBought**: emitted when a hero is purchased with `id`, `price`, `buyer`, `seller`, and `timestamp`.
- **Entry functions**:
  - `create_hero(name: String, image_url: String, power: u64, ctx: &mut TxContext)` — mint a `Hero` to the sender and create/freeze metadata.
  - `list_hero(nft: Hero, price: u64, ctx: &mut TxContext)` — create and share a listing for a `Hero` at a fixed price, emits `HeroListed` event.
  - `buy_hero(list_hero: ListHero, coin: Coin<SUI>, ctx: &mut TxContext)` — buy the hero using SUI at exactly the asking price, emits `HeroBought` event.
  - `transfer_hero(hero: Hero, to: address)` — transfer a `Hero` to another address.

### Prerequisites

- Sui CLI installed and configured with an active address and network: see the Sui docs for installation and `sui client` setup.

### Build and test

From the repository root:

```bash
sui move build
sui move test
```

### Publish

From the repository root, publish just this package:

```bash
sui client publish
```

The command returns a output with the published `packageId`. Save it; you’ll need it for subsequent calls.

### Interact (Sui CLI examples)

Replace placeholders like `<PACKAGE_ID>`, `<HERO_ID>`, `<LIST_ID>`, and `<COIN_ID>` with real values from your environment.

1. Create a hero

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module hero \
  --function create_hero \
  --args "Rose" "https://picsum.photos/200" 9000 \
  --gas-budget 100000000
```

Inspect the transaction effects to find the newly created `Hero` object ID.

2. List a hero for sale

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module hero \
  --function list_hero \
  --args <HERO_ID> 1000000000 \
  --gas-budget 100000000
```

This should create and share a `ListHero` object. Note its object ID as `<LIST_ID>`.

3. Send SUI to your own address with pay-sui and choose the coin

Before running the command, identify:

- an input coin ID with `sui client gas` (pick the gas coin you’ll use), and
- your recipient address with `sui client active-address`.

```bash
sui client pay-sui \
  --input-coins <GAS_COIN_OBJECT_ID> \
  --recipients <YOUR_ADDRESS> \
  --amounts 100000000 \
  --gas-budget 5000000
```

4. Buy a listed hero

You need a coin to pay with. You can list your coins with:

```bash
sui client gas
```

```
╭────────────────────────────────────────────────────────────────────┬────────────────────┬──────────────────╮
│ gasCoinId                                                          │ mistBalance (MIST) │ suiBalance (SUI) │
├────────────────────────────────────────────────────────────────────┼────────────────────┼──────────────────┤
│ 0x1d96b2f56a542af03a39f00d2a783d25e7d28d277c8af00542c3b850d5634d3d │ 56649744256        │ 56.64            │
│ 0x6a57e1e441bb70f4fce8195a950021dc5076f1207786b4abf6b5c1af739c67b6 │ 100000000          │ 0.10             │
╰────────────────────────────────────────────────────────────────────┴────────────────────┴──────────────────╯
```

In this example, we are gonna use the 0.1 SUI coin with ID `0x6a57e1e4...c67b6` for payment.

Then call `buy_hero` with the shared listing and a `Coin<SUI>` object ID:

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module hero \
  --function buy_hero \
  --args <LIST_ID> <COIN_ID> \
  --gas-budget 100000000
```

5. Transfer a hero directly

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module hero \
  --function transfer_hero \
  --args <HERO_ID> <RECIPIENT_ADDRESS> \
  --gas-budget 50000000
```

### Implementation guide (mapping to TODOs)

Helpful Sui modules you’ll likely use: `sui::object`, `sui::transfer`, `sui::tx_context`, and `sui::coin`.

- **HeroMetadata**:

  - Add `id: UID` and a `timestamp: u64` (e.g., epoch time from `clock`).
  - Create it in `create_hero` and freeze it (so it becomes immutable for end users).

- **ListHero**:

  - Add `id: UID`, `nft: Hero`, `price: u64`, `seller: address`.
  - In `list_hero`, initialize with `object::new(ctx)`, set `seller` to `ctx.sender()`, emit the `HeroListed`event, and share the object.

- **buy_hero**:
  - Deconstruct the `list_hero` object.
  - Assert `coin::value(&coin) == price`.
  - Transfer the SUI `coin` to `seller` and the `Hero` to the buyer (sender).
  - Emit the `HeroBought` event
  - Properly remove/destroy the `ListHero` once the purchase completes.

### Troubleshooting

- If a call fails to find a shared object, make sure you use the listing’s shared object ID for `list_hero`/`buy_hero` and that the object was actually shared.
