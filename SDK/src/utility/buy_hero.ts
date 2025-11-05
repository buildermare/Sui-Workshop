// Sui işlemleri kütüphanesinden Transaction sınıfını import ediyoruz
import { Transaction } from "@mysten/sui/transactions";

// Hero satın alma fonksiyonu - package ID, hero'nun satış ID'si ve SUI cinsinden fiyat alır
export const buyHero = (
  packageId: string,
  listHeroId: string,
  priceInSui: string,
) => {
  // Yeni bir işlem objesi oluştur
  const tx = new Transaction();

  // Fiyatı SUI'den MIST'e çevir (SUI'nin en küçük birimi). 1 SUI = 1,000,000,000 MIST
  const priceInMist = Number(priceInSui) * 1_000_000_000;
  // Ödeme için gereken tam miktarı almak üzere gas coin'i böl
  const [paymentCoin] = tx.splitCoins(tx.gas, [priceInMist]);

  // Smart contract'taki 'buy_hero' fonksiyonunu çağır
  tx.moveCall({
    // Çağrılacak hedef fonksiyon - package ID'den oluşturulur
    target: `${packageId}::hero::buy_hero`,
    // Fonksiyon argümanları: hero'nun satış ID'si ve ödeme coin'i
    arguments: [tx.object(listHeroId), paymentCoin],
  });

  // Oluşturulan işlemi geri döndür
  return tx;
};
