**store (Saklama Yeteneği)**

Bu, bir struct'ın **başka bir struct'ın içine konulabilmesini** sağlar.

**Analoji:** `store` yeteneği, bir eşyanın **çantaya sığıp sığamayacağını** söyler.
* Bir `Kılıç` düşün. Kılıcın `store` yeteneği varsa, onu `Hero`'nun envanterine (çantasına) koyabilirsin.
* Ama `Hero`'nun kendisi (tapu gibi olan) başka bir `Hero`'nun çantasına konulamaz. O, doğrudan sahibine aittir.

Genellikle `key` yeteneğine sahip ana varlıklar (NFT'ler, Coin'ler) `store` yeteneğine de sahip olur ki cüzdanlarda veya hesaplarda saklanabilsinler. Ama bir struct'ı başka bir struct'ın içinde bir alan olarak kullanmak istiyorsan (`Hero`'nun `Kılıç`'ı olması gibi), o içerdeki struct'ın mutlaka `store` yeteneği olmalıdır.
