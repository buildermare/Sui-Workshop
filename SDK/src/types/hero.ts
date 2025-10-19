export interface Hero {
  uid: {
    id: string;
  };
  name: string;
  image_url: string;
  power: string;
}

export interface ListHero {
  uid: {
    id: string;
  };
  nft: {
    fields: Hero;
  };
  price: string;
  seller: string;
}

export interface HeroListedEvent {
  id: string;
  price: string;
  seller: string;
  timestamp: string;
}

export interface HeroBoughtEvent {
  id: string;
  price: string;
  buyer: string;
  seller: string;
  timestamp: string;
}
