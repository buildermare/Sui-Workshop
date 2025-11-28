// Sui işlemleri kütüphanesinden Transaction sınıfını import ediyoruz
import { Transaction } from "@mysten/sui/transactions";

// Hero'yu satıştan çıkarma fonksiyonu - package ID ve listelenmiş hero ID'si alır
export const delistHero = (
  packageId: string,
  listHeroId: string
) => {
  // Yeni bir işlem objesi oluştur
  const tx = new Transaction();

  // Smart contract'taki 'delist_hero' fonksiyonunu çağır
  tx.moveCall({
    // Çağrılacak hedef fonksiyon - package ID'den oluşturulur
    target: `${packageId}::hero::delist_hero`,
    // Fonksiyon argümanı: listelenmiş hero ID'si (mutable owned object)
    arguments: [tx.object(listHeroId)],
  });

  // Oluşturulan işlemi geri döndür
  return tx;
};
