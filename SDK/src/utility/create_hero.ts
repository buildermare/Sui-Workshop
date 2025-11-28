// Sui işlemleri kütüphanesinden Transaction sınıfını import ediyoruz
import { Transaction } from "@mysten/sui/transactions";

// Yeni hero oluşturma fonksiyonu - package ID, isim, resim URL'i ve güç seviyesi alır
export const createHero = (
  packageId: string,
  name: string,
  imageUrl: string,
  power: string
) => {
  // Yeni bir işlem objesi oluştur
  const tx = new Transaction();

  // Smart contract'taki 'create_hero' fonksiyonunu çağır
  tx.moveCall({
    // Çağrılacak hedef fonksiyon - package ID'den oluşturulur
    target: `${packageId}::hero::create_hero`,
    // Fonksiyon argümanları: hero ismi, resim URL'i ve güç seviyesi
    arguments: [
      tx.pure.string(name),
      tx.pure.string(imageUrl),
      tx.pure.u8(Number(power)),
    ],
  });

  // Oluşturulan işlemi geri döndür
  return tx;
};
