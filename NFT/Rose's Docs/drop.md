**drop (Yok Etme/Bırakma Yeteneği)**

Bu, bir struct'ın işin bitince **çöpe atılıp atılamayacağını** söyler.

* **Kullan-at kahve bardağı:** Bunun `drop` yeteneği vardır. İşin bitince umursamadan çöpe atabilirsin. Kaybolması önemli değildir.
* **Külçe Altın:** Bunun `drop` yeteneği **yoktur**. Altını yanlışlıkla bir yere düşürürsen yok olmaz. Onu ya birine vermek ya da kasaya koymak zorundasın. Onu öylece "bırakıp gidemezsin".

Move dilinde, değerli varlıkların (NFT'ler gibi) yanlışlıkla kodda kaybolmasını önlemek için onlara `drop` yeteneği **verilmez**. Eğer bir `Hero` NFT'yi bir fonksiyonda oluşturur ama kimseye vermezsen, program hata verir ve seni uyarır: "Bu değerli şeyi ne yapacağını söylemedin, öylece yok olmasına izin veremem!"
