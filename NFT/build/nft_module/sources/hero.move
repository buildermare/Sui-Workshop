// Defines a module named nft_module and its name is hero.
module nft_module::hero; 
    // Imports the necessary modules.
    // ========= IMPORTS =========
    // Imports the std::string module to use the String data type.
    use std::string::String;
    // Imports the sui::coin module to use functions related to Coin and SUI.
    use sui::coin::{Self, Coin};
    // Imports the SUI type, which represents the SUI currency.
    use sui::sui::SUI;
    // Imports the sui::event module to emit events.
    use sui::event;
    
    // Defines the data structures.
    // ========= STRUCTS =========
    // Defines a public struct named Hero. This struct represents a hero.
    public struct Hero has key, store {
        // Holds the unique identifier (ID) of the hero.
        id: UID,
        // Holds the name of the hero.
        name: String,
        // Holds the image URL of the hero.
        image_url: String,
        // Holds the power of the hero.
        power: u64,
    }

    // Defines a public struct named ListHero. This struct represents a hero listed for sale.
    public struct ListHero has key, store {
        // Holds the unique identifier (ID) of the listed hero.
        id: UID,
        // Holds the Hero object for sale.
        nft: Hero,
        // Holds the sale price of the hero.
        price: u64,
        // Holds the address of the seller.
        seller: address,
    }

    // Defines a public struct named HeroMetadata. This struct holds metadata for a hero.
    public struct HeroMetadata has key, store {
        // Holds the unique identifier (ID) of the metadata.
        id: UID,
        // Holds the creation timestamp.
        timestamp: u64,
    }

    // Defines the events.
    // ========= EVENTS =========

    // Defines a public event struct named HeroListed. This event is emitted when a hero is listed.
    public struct HeroListed has copy, drop {
        // Holds the identifier (ID) of the listed hero.
        id: ID,
        // Holds the sale price of the hero.
        price: u64,
        // Holds the address of the seller.
        seller: address,
        // Holds the listing timestamp.
        timestamp: u64,
    }

    // Defines a public event struct named HeroBought. This event is emitted when a hero is purchased.
    public struct HeroBought has copy, drop {
        // Holds the identifier (ID) of the purchased hero.
        id: ID,
        // Holds the sale price of the hero.
        price: u64,
        // Holds the address of the buyer.
        buyer: address,
        // Holds the address of the seller.
        seller: address,
        // Holds the purchase timestamp.
        timestamp: u64,
    }

    // Defines the functions.
    // ========= FUNCTIONS =========

    // Suppresses the self-transfer lint warning.
    #[allow(lint(self_transfer))] // Bu fonksiyonda bir varlığın sahibine geri transfer edilmesi mümkün ve bu bir hata değil.
    // Defines a public entry function named create_hero. This function creates a new hero.
    public entry fun create_hero(name: String, image_url: String, power: u64,  ctx: &mut TxContext) {
        // Creates a new Hero object.
        let hero = Hero {
            // Creates a new unique identifier (ID).
            id: object::new(ctx),
            // Sets the name of the hero.
            name,
            // Sets the image URL of the hero.
            image_url,
            // Sets the power of the hero.
            power
        };

        // Creates a new HeroMetadata object.
        let hero_metadata = HeroMetadata {
            // Creates a new unique identifier (ID).
            id: object::new(ctx),
            // Sets the timestamp of the transaction.
            timestamp: ctx.epoch_timestamp_ms(),
        };

        // Transfers the created Hero object to the sender's address.
        transfer::public_transfer(hero, ctx.sender());

        // Freezes the HeroMetadata object (makes it immutable).
        transfer::freeze_object(hero_metadata);
    }



    // Defines a public entry function named list_hero. This function lists a hero for sale.
    public entry fun list_hero(nft: Hero, price: u64, ctx: &mut TxContext) {
        // Creates a new ListHero object.
        let list_hero = ListHero {
            // Creates a new unique identifier (ID).
            id: object::new(ctx),
            // Sets the Hero object for sale.
            nft,
            // Sets the sale price.
            price,
            // Sets the seller's address.
            seller: ctx.sender(),
        };

        // Emits the HeroListed event.
        event::emit(HeroListed {
            // Sets the identifier (ID) of the listed hero.
            id: object::id(&list_hero),
            // Sets the sale price.
            price,
            // Sets the seller's address.
            seller: ctx.sender(),
            // Sets the timestamp of the transaction.
            timestamp: ctx.epoch_timestamp_ms(),
        });

        // Makes the ListHero object a shared object.
        transfer::share_object(list_hero);
    }

    // Defines a public entry function named buy_hero. This function purchases a hero.
    public entry fun buy_hero(list_hero: ListHero, coin: Coin<SUI>, ctx: &mut TxContext) {
        // Destructures the ListHero object into its fields.
        let ListHero { id, nft, price, seller } = list_hero;

        // Checks if the paid amount is equal to the sale price.
        assert!(coin::value(&coin) == price, 0);

        // Transfers the coin to the seller's address.
        transfer::public_transfer(coin, seller);

        // Transfers the NFT (Hero object) to the buyer's (sender's) address.
        transfer::public_transfer(nft, ctx.sender());

        // Emits the HeroBought event.
        event::emit(HeroBought {
            // Sets the identifier (ID) of the purchased hero.
            id: id.to_inner(),
            // Sets the sale price.
            price,
            // Sets the buyer's address.
            buyer: ctx.sender(),
            // Sets the seller's address.
            seller,
            // Sets the timestamp of the transaction.
            timestamp: ctx.epoch_timestamp_ms(),
        });

        // Deletes the identifier (ID) of the ListHero object.
        id.delete();
    }

    // Defines a public entry function named transfer_hero. This function transfers a hero to another address.
    public entry fun transfer_hero(hero: Hero, to: address) {
        // Transfers the Hero object to the specified address.
        transfer::public_transfer(hero, to);
    }

    // Defines the getter functions.
    // ========= GETTER FUNCTIONS =========
    
    // A function that can only be used in tests.
    #[test_only]
    // Defines a public function named hero_name. This function returns the name of a hero.
    public fun hero_name(hero: &Hero): String {
        // Returns the name of the hero.
        hero.name
    }

    // A function that can only be used in tests.
    #[test_only]
    // Defines a public function named hero_image_url. This function returns the image URL of a hero.
    public fun hero_image_url(hero: &Hero): String {
        // Returns the image URL of the hero.
        hero.image_url
    }

    // A function that can only be used in tests.
    #[test_only]
    // Defines a public function named hero_power. This function returns the power of a hero.
    public fun hero_power(hero: &Hero): u64 {
        // Returns the power of the hero.
        hero.power
    }

    // A function that can only be used in tests.
    #[test_only]
    // Defines a public function named hero_id. This function returns the identifier (ID) of a hero.
    public fun hero_id(hero: &Hero): ID {
        // Returns the identifier (ID) of the hero.
        object::id(hero)
    }