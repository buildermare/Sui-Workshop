# Enoki ile Gas Sponsorluğu

## Soruna Cevap

Blockchain'de her işlem (transaction) için ağ kullanım ücreti var - buna **gas fee** deniyor. Kullanıcı işlem yaparken, kendi cüzdanındaki SUI tokeni ile bu ücreti öder.

**Ama siz şunları söylüyorsunuz:**
> "Yeni kullanıcılar geldiğinde onların SUI'si yok, gas fee ödemeleri için. Biz ödeyelim!"

İşte **Enoki** buraya devreye giriyor. Enoki, sizin yerinize gas fee'yi ödüyor.

---

## Enoki Nasıl Çalışır? (Adım Adım)

### 1️⃣ Normal İşlem (Enoki Olmadan)

```
Kullanıcı → İşlemi yapar → Gas fee ödeme → Blockchain kabul eder
                                   ↓
                           Cüzdandan SUI çıkar
```

### 2️⃣ Enoki ile İşlem (Sponsorlu)

```
Kullanıcı → İşlemi hazırlar → Enoki'ye gönderir → Enoki gas fee ödüyor
                                                        ↓
                                              Blockchain kabul eder
```

**Fark ne?** Kullanıcının SUI'si azalmıyor. Siz (project) ödüyorsunuz.

---

## Teknik Olarak Ne Olur?

Şöyle düşün:

Kullanıcı işlemi yaparken:
1. İşlemi "hazırlar" (ama çalıştırmaz)
2. "Hazır işlem"i Enoki'ye gösterir
3. Enoki kontrol eder: "Bu işlem güvenli mi? Sadece NFT oluşturuyor mu?"
4. Eğer tamam ise, gas fee'yi Enoki öder
5. İşlem blockchain'de yürütülür

---

## Gerçek Dünya Örneği

Bir restorana gittin:
- **Normal**: Sen kasaya git, para ver, yemek iste
- **Enoki ile**: Patron kasaya gidiyor, senin adına para veriyor

Yemek senin oluyor, ama para patron'un cüzdanından çıkıyor.

---

## Kod Açıklaması (Adım Adım)

### Adım 1: Enoki'yi Kur

```typescript
// Enoki müşterisini oluşturduk
import { EnokiClient } from "@mysten/enoki";


const enoki = new EnokiClient({
  apiKey: "SENIN_ENOKI_API_KEY" // Enoki'den alacağın anahtar
});
```

### Adım 2: İşlemi Hazırla

```typescript
// NFT oluşturmak istiyoruz
const tx = new Transaction();

tx.moveCall({
  target: "0xYOUR_PACKAGE::hero::create_hero", // Hangi fonksiyon
  arguments: [
    tx.pure.string("Aragorn"),      // Hero adı
    tx.pure.string("image_url"),    // Resim linki
    tx.pure.u64(100),               // Power
  ],
});
```

> **Not**: Bu noktada hiçbir şey blockchain'de olmadı. Sadece hazırladık.

### Adım 3: İşlemi Enoki'ye Gönder

```typescript
// İşlemi Enoki'ye gönderiyoruz
const sponsoredTx = await enoki.createSponsoredTransaction({
  network: "testnet",                    // Hangi ağda çalışacak
  transactionKindBytes: toB64(txBytes),  // Hazırladığımız işlem
  sender: userAddress,                   // Kimden yapılacak (kullanıcı)
  allowedMoveCallTargets: [              // Hangi fonksiyonlara izin ver
    "0xYOUR_PACKAGE::hero::create_hero"
  ],
});
```

**Enoki burada kontrol eder:**
- ✅ Bu işlem gerçekten NFT oluşturuyor mu?
- ✅ Başka hiçbir şey yapmaya çalışmıyor mu?
- ✅ Aman, kullanıcıyı dolandırmaya çalışmıyor mu?

### Adım 4: İşlemi Çalıştır

```typescript
// Sponsorlu işlemi imzala ve çalıştır
signAndExecute({
  transaction: sponsoredTx
});
```

> **Şimdi blockchain'de oldu!**

---

## Gerçek Kod Örneği (Tamamı)

```typescript
import { EnokiClient } from "@mysten/enoki";
import { Transaction } from "@mysten/sui.js/transactions";
import { toB64 } from "@mysten/sui/utils";

// 1. Enoki'yi başlat
const enoki = new EnokiClient({
  apiKey: process.env.REACT_APP_ENOKI_API_KEY,
});

// 2. NFT oluşturma fonksiyonu
async function createHeroWithSponsorship(
  userName: string,
  imageUrl: string,
  power: number,
  userAddress: string
) {
  // İşlemi hazırla
  const tx = new Transaction();

  tx.moveCall({
    target: "0xYOUR_PACKAGE::hero::create_hero",
    arguments: [
      tx.pure.string(userName),
      tx.pure.string(imageUrl),
      tx.pure.u64(power),
    ],
  });

  // İşlemi byte'a çevir
  const txBytes = await tx.build({ client });

  // Enoki'ye gönder ve sponsorluğu al
  try {
    const sponsoredTx = await enoki.createSponsoredTransaction({
      network: "testnet",
      transactionKindBytes: toB64(txBytes),
      sender: userAddress,
      allowedMoveCallTargets: [
        "0xYOUR_PACKAGE::hero::create_hero"
      ],
    });

    // Sponsorlu işlemi çalıştır
    const result = await signAndExecute({
      transaction: sponsoredTx,
    });

    console.log("NFT başarıyla oluşturuldu!", result);
    return result;

  } catch (error) {
    console.error("Gas sponsorluğu başarısız:", error);
  }
}
```

---

## Enoki API Key'ini Nasıl Alırız?

1. [Enoki'nin sitesine git](https://portal.enoki.mystenlabs.com/)
2. **"Sign up" yap** (wallet bağla)
3. **Dashboard'a gir**
4. **"Create API Key" butonuna bas**
5. **Key'i kopyala ve `.env` dosyasına koy:**

```env
REACT_APP_ENOKI_API_KEY=enoki_test_abc123xyz...
```

---

## Önemli Kurallar

### ✅ YAPILACAKLAR

```typescript
allowedMoveCallTargets: [
  "0xYOUR_PACKAGE::hero::create_hero",  // Güvenli
  "0xYOUR_PACKAGE::hero::list_hero",    // Güvenli
]
```

### ❌ YAPILMAYACAKLAR

```typescript
allowedMoveCallTargets: [
  "0x2::coin::transfer",  // Vayyy! Kullanıcının parasını çalabiliriz
  "*"                      // Vayyy! Her şeyi yapabiliriz
]
```

**Enoki sadece güvenli hedefler için sponsor olur. Teşebbüs et başka hedefleri sponsor ettirmeye, Enoki reddeder.**

---

## Özet Tablosu

| Konu | Cevap |
|------|-------|
| **Enoki ne?** | Gas fee ödeyen bir hizmet |
| **Neden kullanırız?** | Kullanıcılar gas ücreti ödemeyecek |
| **Kimden para çıkıyor?** | Sizden (project) |
| **Tıkandığında?** | Enoki'nin gas budget'ı bitmişse. Daha para yükle |
| **Güvenli mi?** | Evet, sadece izinli fonksiyonlar çalışır |
