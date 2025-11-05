// Sui işlemleri kütüphanesinden Transaction sınıfını import ediyoruz
import { Transaction } from "@mysten/sui/transactions";

// Hero transfer fonksiyonu - package ID, hero ID'si ve alıcı adresi alır
export const transferHero = (packageId: string, heroId: string, to: string) => {
  // Yeni bir işlem objesi oluştur
  const tx = new Transaction();

  // Smart contract'taki 'transfer_hero' fonksiyonunu çağır
  tx.moveCall({
    // Çağrılacak hedef fonksiyon - package ID'den oluşturulur
    target: `${packageId}::hero::transfer_hero`,
    // Fonksiyon argümanları: hero ID'si ve alıcının adresi
    arguments: [tx.object(heroId), tx.pure.address(to)],
  });

  // Oluşturulan işlemi geri döndür
  return tx;
};
