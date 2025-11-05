// Sui işlemleri kütüphanesinden Transaction sınıfını import ediyoruz
import { Transaction } from "@mysten/sui/transactions";

// Hero'yu satışa çıkarma fonksiyonu - package ID, hero ID'si ve SUI cinsinden fiyat alır
export const listHero = (
  packageId: string,
  heroId: string,
  priceInSui: string,
) => {
  // Yeni bir işlem objesi oluştur
  const tx = new Transaction();

  // Fiyatı SUI'den MIST'e çevir (SUI'nin en küçük birimi). 1 SUI = 1,000,000,000 MIST
  const priceInMist = Number(priceInSui) * 1_000_000_000;

  // Smart contract'taki 'list_hero' fonksiyonunu çağır
  tx.moveCall({
    // Çağrılacak hedef fonksiyon - package ID'den oluşturulur
    target: `${packageId}::hero::list_hero`,
    // Fonksiyon argümanları: hero ID'si ve MIST cinsinden fiyat
    arguments: [tx.object(heroId), tx.pure.u64(priceInMist)],
  });

  // Oluşturulan işlemi geri döndür
  return tx;
};
