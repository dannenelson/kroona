# Brief 48 – Dummydata: nya produktbilder och en katalog som stämmer med dem

**Fas:** 0. **Mål (ett):** Byt ut alla Unsplash-/Picsum-bilder mot de 22 lokala produktbilderna och bygg om den demo-katalog som visas i appen så att namn, kategori, märke, erbjudanden och samlingar stämmer med bilderna. Kör efter brief 47 (logotyper) och 43. Datan är dummy: syftet är känsla, inte korrekthet. Inventera först `data/`, `lib/catalog.ts`, `lib/cardProduct.ts`, `types/`, och alla ställen som läser `imageUrl`.

## Nuläge (verifierat av Claude)
- `data/products.ts` (6 produkter, Unsplash), `data/catalogTopup.ts` (10) och `data/newProducts.ts` (40, Picsum) bildar katalogen. Erbjudanden i `data/offers.ts`, återförsäljare i `data/retailers.ts` (ca 20 varumärken plus påhittade butiker och andrahandstjänster), samlingar i `data/collections.ts` (COLLECTIONS, RETAILER_COLLECTIONS, PEOPLE_COLLECTIONS), områden i `data/areas.ts`.
- Unsplash-URL:er finns även i komponenterna `HeroRow`, `ContinueDialogRow`, `ContinueRow`, `MixRow` (reservmixar) och `CardShowcase`.
- `ProductCategory` är bara `'kläder' | 'möbler'`. `FurnitureType` saknar teknik.
- De sex första produkterna är sparade i `SavedProductsContext`/AsyncStorage på Daniels enhet. Med en ny katalog försvinner gamla id:n.

## Beslut (Daniel godkänt)
- **Alternativ A:** katalogen byggs om till **20 produkter, en per bild**. Allt som saknar bild tas bort ur katalogen.
- **Teknik** läggs som ny `FurnitureType` ('teknik') under Möbler. **Hudvårdsbilderna används inte.**
- Bildernas innehåll är verifierat (Claude har sett dem). Namn och märken är dummy, markera dem som `DUMMYDATA`.

## Del 1: bilderna
Flytta (vanlig mv, filerna är inte spårade av git; lägg till med git add) från `assets/Temp/produkter/` till `assets/dummy/products/` med dessa namn:

| Gammal fil (.jpeg) | Nytt namn | Produkt (förslag) | Kategori / typ |
|---|---|---|---|
| photo-1434389677669-e08b4cac3105 | poncho-knit | Fringe Knit Poncho | kläder, dam |
| photo-1484704849700-f032a568e944 | headphones-retro | Retro Headphones | möbler, teknik |
| photo-1491553895911-0055eca6402d | sneaker-black-studio | Black Studio Sneaker | kläder |
| photo-1540932239986-30128078f3c5 | lamps-brass | Brass Pendant Set | möbler, belysning |
| photo-1542291026-7eec264c27ff | sneaker-red-runner | Red Runner Sneaker | kläder |
| photo-1543508282-6319a3e2621f | sneaker-black-low | Black Low Sneaker | kläder |
| photo-1543512214-318c7553f230 | speaker-smart | Smart Speaker | möbler, teknik |
| photo-1553062407-98eeb64c6a62 | backpack-navy | Navy Daypack | kläder |
| photo-1583394838336-acd977736f90 | headphones-black | Over-ear Headphones | möbler, teknik |
| photo-1584036553516-bf83210aa16c | sunglasses | Classic Sunglasses | kläder |
| photo-1598532163257-ae3c6b2524b6 | tote-woven-leather | Woven Leather Tote | kläder |
| photo-1600185365483-26d7a4cc7519 | sneaker-orange | Orange Air Sneaker | kläder |
| photo-1605733160314-4fc7dac4bb16 | boots-suede | Suede Ankle Boots | kläder |
| photo-1617364852223-75f57e78dc96 | chair-lounge-dark | Bentwood Lounge Chair | möbler, stol |
| photo-1622560480605-d83c853bc5c3 | backpack-leather | Leather Backpack | kläder |
| photo-1712926382189-dacbc6b89a01 | chair-rattan | Rattan Lounge Chair | möbler, stol |
| photo-1777513538143-8525eb3943f6 | table-oak-coffee | Oak Coffee Table | möbler, bord |
| premium_photo-1664392147011-2a720f214e01 | bag-saddle | Saddle Shoulder Bag | kläder |
| premium_photo-1675186049366-64a655f8f537 | blazer-red | Double-breasted Blazer | kläder, dam |
| premium_photo-1678074057896-eee996d4a23e | chair-armchair-white | White Armchair | möbler, stol |
| photo-1615397349754-cfa2066a298e, photo-1763503834047-ac85c4105c0b | (hudvård) | används inte | flytta till `assets/dummy/products/_unused/` |

- **Bildkälla i koden:** Metro kräver statiska `require`. Gör en `data/productImages.ts` med en `require` per fil och bygg `imageUrl`-strängarna med `Image.resolveAssetSource(require(...)).uri`, så att `imageUrl` förblir en sträng och inga komponenter behöver ändras. Fungerar inte det i dev eller exporten, välj närmaste lösning som rör så få komponenter som möjligt och beskriv den.
- `aspectRatio` sätts från bildens verkliga mått (bredd / höjd). Fyra bilder är liggande 3:2 (retro-hörlurar, röd löparsko, orange sko, träbord): produktkorten beskär med `cover`, kontrollera att motivet fortfarande syns.
- Produktdetaljens `images`: utelämna eller använd samma bild; verifiera Produktdetalj och lightbox med en enda bild.
- Bilderna är 500 px breda: tillräckligt för 150–200 px kort, något mjukt på stora stående kort (280 bred). Flagga i rapporten, åtgärda inte.

## Del 2: katalog, återförsäljare, erbjudanden
1. **Katalogen** blir de 20 produkterna ovan, id:n '1'–'20'. Tilldela märken: kläder får befintliga märkesnamn plus de nya (se nedan); hem- och tekniknamnen är påhittade (`DUMMYDATA`). Fördela `style` så att varje befintligt tema har minst 5 produkter: **Skandinavisk** (poncho, lamporna, stolarna, bordet, Daypack m.fl.) och **Urban**. Sätt rimliga `sustainabilityScore` (3,2–4,8, minst 6 produkter ≥ 4,3).
2. **Ta bort** `newProducts.ts`, `catalogTopup.ts` och de gamla produkterna ur katalogen. Rensa gamla produkter ur `offers.ts`.
3. **Nya återförsäljare** (dummy, samma fält som övriga, `initial` satt): **H&M** (`brand-hm`), **Lindex** (`brand-lindex`), **Nordic Nest** (`store-nordic-nest`, typ `store`) och **Royal Design** (`store-royal-design`, typ `store`). Aktivera sedan `RETAILER_LOGOS`-raderna från brief 47 som är markerade TODO 48.
4. **Gallra återförsäljare:** varje återförsäljare som syns i appen ska ha minst en produkt. Ta bort de som inte får någon. Siktet är ca 8–10 totalt: några varumärken (Filippa K, H&M, Lindex och två–tre av de befintliga), Nordic Nest och Royal Design för hem, och två andrahandstjänster.
5. **Erbjudanden:** varje produkt minst ett nytt erbjudande. Minst sex produkter får också ett begagnat (en med auktion), och tre–fyra produkter har två–tre erbjudanden från olika återförsäljare så att jämförelsen visar något. Pris i kronor, rimliga för typen.

## Del 3: samlingar och områden
- Lägg `'teknik'` i `FurnitureType` (uppdatera alla `switch`, `Record` och etikettkartor som täcker typen) och i Hemmakontor-området.
- **Kroonas samlingar** (kurator `kroona`, filter `{ type: 'products', ids }`), med logotyp från brief 47: **Smarta hem** (smarta-hem: högtalare, lampor, teknik), **Gaming Deluxe** (gaming-deluxe: hörlurar, högtalare, en stol), **Handla hållbart** (handla-hallbart: produkter med högst `sustainabilityScore`, minst 6), **Second Hand** (second-hand: kläder som har begagnat erbjudande) och **Second Life** (second-life: hemprodukter med begagnat erbjudande). Minst 4 produkter i varje. **Skandinavisk stil** (id '2') behåller sin logotyp (scandinavisk-design). "Urban stil" finns kvar utan logotyp.
- Uppdatera `COLLECTION_LOGOS` (brief 47) med dessa id:n. Det område "Begagnad mode" som brief 47 nämner finns inte i `areas.ts`; ersätt raden med samlingen Second Hand.
- Varumärkeskollektioner (`RETAILER_COLLECTIONS`) och personernas samlingar (`PEOPLE_COLLECTIONS`) byggs om med de nya produkt-id:na: behåll bara kollektioner som får minst 2 produkter. Samlingarnas `imageUrl` tas från en av produkternas bilder.
- Områdena (`areas.ts`) ska fortfarande ge innehåll; justera filtren om något område blir tomt, eller ta bort det.
- Reservdata: `MixRow`s statiska mixar, `HeroRow`, `ContinueDialogRow`, `ContinueRow` och `CardShowcase` byter sina Unsplash-bilder mot de nya lokala bilderna.
- Sök till slut igenom projektet: **inga `unsplash.com` eller `picsum.photos` ska finnas kvar i `data/` eller `components/`** (nämn eventuella undantag i rapporten).

## Gamla sparade id:n
Daniels enhet har sparade produkter och samlingar med gamla id:n, och följda samlingar och återförsäljare som kan ha tagits bort. **Appen får inte krascha**: sparade och följda id:n som inte längre finns hoppas tyst över (listor, antal, sorteringen, Spara i-kortet, Följer). Verifiera det, och beskriv i rapporten vad som händer med gamla sparade samlingar (tomma samlingar behålls).

## Utanför scope (flagga)
Fler produkter, hudvård, riktiga produktbilder med flera vinklar, ny kategori utöver typen Teknik, att filterflikarna filtrerar, och bättre bildupplösning.

## Verifiering
tsc, Metro, simulator mörkt och ljust: Hem (alla hyllor har innehåll och rätt bilder), en produktdetalj med lightbox, Partnerdetalj för varje återförsäljare, Samlingsdetalj för varje ny samling med logotyp, Sparat och Följer med gamla sparade id:n, jämförelsen på en produkt med flera erbjudanden, Hitta om dess svar läser produktdata. Rapport: `docs/briefs/48-rapport.md`.
Dokument: `docs/produkt.md` (katalogen, typen teknik, att `assets/dummy/` ersätts före publik release), `docs/ia-karta.md` om något ändras. Committa, inkl. briefen, och pusha.
