Hayal et ki akıllı kontrat, bir kuru temizlemeci dükkanı ve sen müşteri.

**Senin yapman:** Dükkanın kapısından girip "Montumu temizlat" diyorsun.

**Dükkanın (kontratın) yapması:**
- Montunu alıyor
- Temizliyor
- Hazır ediyor

**FAKAT!** Dükkanın montunu kime verecek? Ne zaman teslim edeceğini biliyor mu? Hangi mont senin?

İşte ctx tam burda devreye giriyor!

**ctx olan bir dosya gibi:**
- "Montunu kime vereceğim?" → ctx.sender() → "Ah, Rose'a vereceğim, çünkü Rose geldi"
- "Ne zaman?" → ctx.epoch_timestamp_ms() → "28 Kasım, saat 15:30'de"
- "Hangi mont?" → object::new(ctx) → "ID:12345 numaralı mont"

**Kısaca:** ctx = Blockchain'in sana verdiği "Kim olduğunuzu, ne zaman istediğinizi, hangi şeyi istediğinizi bize söyleyen bilgi kartı"

Sen bunu vermedin, Sui blockchain seni tanıdığı için otomatik olarak veriyor.
