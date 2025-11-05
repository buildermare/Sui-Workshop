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
