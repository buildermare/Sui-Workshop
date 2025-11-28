// Hero NFT'si için tip tanımlaması
export interface Hero {
  uid: {
    id: string; // Hero'nun benzersiz ID'si
  };
  name: string; // Hero ismi
  image_url: string; // Hero resminin URL'i
  power: string; // Hero'nun güç seviyesi
}

// Satıştaki hero için tip tanımlaması
export interface ListHero {
  uid: {
    id: string; // Listeleme nesnesinin ID'si
  };
  nft: {
    fields: Hero; // Hero NFT'sinin verileri
  };
  price: string; // Satış fiyatı
  seller: string; // Satıcının adresi
}

// Hero satışa çıkarıldığında oluşan olay için tip
export interface HeroListedEvent {
  id: string; // Hero ID'si
  price: string; // Fiyat
  seller: string; // Satıcı
  timestamp: string; // Zaman damgası
}

// Hero satın alındığında oluşan olay için tip
export interface HeroBoughtEvent {
  id: string; // Hero ID'si
  price: string; // Fiyat
  buyer: string; // Alıcı
  seller: string; // Satıcı
  timestamp: string; // Zaman damgası
}

// Hero metadata için tip tanımlaması
export interface HeroMetadata {
  uid: {
    id: string; // Metadata nesnesinin ID'si
  };
  timestamp: string; // Oluşturma zamanı
  rarity: number; // Nadirlik seviyesi (1-5)
}

// Rarity seviyelerine göre renk ve label mapping
export const RARITY_MAP = {
  1: { label: "Common", color: "gray" as const },
  2: { label: "Uncommon", color: "blue" as const },
  3: { label: "Rare", color: "purple" as const },
  4: { label: "Epic", color: "orange" as const },
  5: { label: "Legendary", color: "red" as const },
};

// Rarity'den label ve color al
export const getRarityInfo = (rarity: number) => {
  return RARITY_MAP[rarity as keyof typeof RARITY_MAP] || RARITY_MAP[1];
};
