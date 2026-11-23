# Rapport brief 48 – Dummydata: nya produktbilder och en katalog som stämmer med dem

## Inventering
- **Katalogen** var 56 produkter: `products.ts` (6, Unsplash), `newProducts.ts` (40, Picsum) och `catalogTopup.ts` (10, Picsum).
- **Erbjudanden och återförsäljare:** erbjudanden fanns i `offers.ts`. Återförsäljarna var 39: 33 varumärken, 4 butiker och 3 andrahandstjänster.
- **Unsplash-bilder i komponenter:** MixRow (reservmixar), HeroRow, ContinueDialogRow, ContinueRow, CardShowcase och `data/collections.ts`.
- **Komponenterna läser `imageUrl` som sträng** (`{ uri }`). Uppslag mot `PRODUCTS` finns på ett tiotal ställen, och alla tål okända id:n (`find`/`filter` med `?.`), utom antalet i egna samlingar (se nedan).
- **Hitta** bygger systemprompten från `PRODUCTS` (`lib/kroonaSystemPrompt.ts`), så den läser den nya katalogen automatiskt.
- **Partnerdetalj** öppnade bara `retailerType 'brand'`.

## Gjort
### Del 1: bilderna
- **20 bilder** är flyttade med `mv` till `assets/dummy/products/<namn>.jpeg` enligt tabellen. De två hudvårdsbilderna ligger i `assets/dummy/products/_unused/`.
- **`assets/Temp/` är borttagen.** Den var tom och innehöll bara `.DS_Store`.
- **`data/productImages.ts`:** en statisk `require` per fil. `Image.resolveAssetSource(require(...))?.uri` ger en sträng, så att `imageUrl` förblir en sträng och inga produktkomponenter behövde ändras.
  - Det fungerar i dev (Metro-URL) och i iOS-exporten, där alla 20 bilder kom med som assets.
- **`aspectRatio`** är satt från de verkliga måtten (bredd / höjd).
- **`images` är utelämnat.** Produktdetalj och lightbox fungerar med en enda bild (verifierat på produkt 17).

### Del 2: katalog, återförsäljare, erbjudanden
- **`data/products.ts`** har 20 produkter med id `'1'`–`'20'`, en per bild och markerade som DUMMYDATA. `newProducts.ts` och `catalogTopup.ts` är borttagna.
  - **Kläder och accessoarer:** Filippa K (poncho, tote, axelväska), H&M (röd löparsko, solglasögon), Lindex (daypack, mockaboots, blazer), J.Lindeberg (svart low sneaker, orange sneaker) och Weekday (svart studio-sneaker, läderryggsäck).
  - **Hem och teknik**, påhittade märken: Sonora (tre teknikprodukter), Ljusverket (lamporna), Ekens Verkstad (bentwood- och rottingstol, ekbord) och Nordform (vit fåtölj).
  - **Stilar:** Skandinavisk 6 (poncho, lampor, daypack, bentwoodstol, ekbord, vit fåtölj) och Urban 6. Hållbarhet 3,2–4,8, varav 7 produkter ≥ 4,3.
- **`'teknik'`** är tillagd i `FurnitureType`. Inga `switch`, `Record` eller etikettkartor täckte typen; bara unionen och områdesfiltret.
- **Återförsäljare** (9, gallrade):
  - Varumärken: J.Lindeberg, Filippa K, Weekday, H&M (`brand-hm`), Lindex (`brand-lindex`).
  - Butiker: Nordic Nest (`store-nordic-nest`), Royal Design (`store-royal-design`).
  - Andrahand: Återbruket, Budrummet.
  - Alla har minst en produkt. De fyra TODO 48-raderna i `RETAILER_LOGOS` är aktiverade.
- **Erbjudanden** (33):
  - Varje produkt har minst ett nytt erbjudande.
  - **9 har även begagnat:** poncho, retrohörlurar, solglasögon, tote (auktion), mockaboots, bentwoodstol, rottingstol (auktion), ekbord och blazer.
  - **Fyra hemprodukter har 2–3 erbjudanden** från olika återförsäljare: lamporna, högtalaren, ekbordet (Nordic Nest, Royal Design och begagnat) och fåtöljen.

### Del 3: samlingar och områden
- **`COLLECTIONS`:**
  - Kvar: J.Lindeberg ('1'), Filippa K ('4'), Skandinavisk stil ('2', logotyp scandinavisk-design) och Urban stil ('3', utan logotyp).
  - Nya, med kurator `kroona` och logotyp:

    | Samling | Produkter |
    |---|---|
    | Smarta hem (`k-smarta-hem`) | högtalare, lampor, två hörlurar |
    | Gaming Deluxe (`k-gaming-deluxe`) | två hörlurar, högtalare, bentwoodstol |
    | Handla hållbart (`k-handla-hallbart`) | de 7 med högst poäng |
    | Second Hand (`k-second-hand`) | 5 kläder med begagnat |
    | Second Life (`k-second-life`) | 4 hemprodukter med begagnat |

  - Alla har minst 4 produkter. `COLLECTION_LOGOS` är uppdaterad, och området "Begagnad mode" är ersatt med samlingen Second Hand.
- **`RETAILER_COLLECTIONS`** (8, alla med minst 2 produkter):
  - J.Lindeberg: Sneakers
  - Filippa K: Höstgarderob, Väskor
  - Weekday: Urban vardag
  - H&M: Sommarfavoriter
  - Lindex: Höst i stan
  - Nordic Nest: Vardagsrummet
  - Royal Design: Designklassiker
- **`PEOPLE_COLLECTIONS`:** samma fyra id:n med nytt urval (4 produkter vardera). Två namn är justerade så att de stämmer med innehållet.
- **Omslagsbilder:** samlingarnas `imageUrl` tas från en av produkternas bilder.
- **Områden:**
  - Hemmakontor fick `'teknik'`.
  - **Mjukt hem blev tomt** (ingen textil, matta eller dekor), så filtret fick också `'stol'`. Det ger tre fåtöljer, och beskrivningen är justerad.
  - Övriga ger innehåll: Skandinavisk stil 6, Vardagsuniform 2 och Utomhusklart 2.
- **Reservdata:** MixRow (statiska mixar), HeroRow, ContinueDialogRow, ContinueRow och CardShowcase använder `PRODUCT_IMAGES`. Fortsätt-dialogen ("Vinterjacka …") visar ponchon.
- **Unsplash och Picsum:** sökningen ger **0 träffar** i `app/`, `components/`, `data/` och `lib/`.
- **Partnerdetalj** öppnar nu alla återförsäljartyper. Rubriken är "Om varumärket", "Om butiken" eller "Om tjänsten", och produkterna hämtas via erbjudandena för butiker och tjänster. Utan detta gav Nordic Nest, Royal Design och andrahandstjänsterna "Varumärket finns inte". Kuratorraden på deras kollektioner leder dit.

## Gamla sparade id:n
- **Inget kraschar.** Alla uppslag hoppar redan över okända id:n: Gillade produkter (`PRODUCTS.filter`), mosaiker, Spara i-kortet, Samlingsdetalj och Följer (`ALL_COLLECTIONS.find` / `getRetailer`).
- **Antalet i egna samlingar** räknade tidigare `productIds.length`. Nu räknas bara id:n som finns (`knownProductIds` i `data/products.ts`) i Sparat (rader och kort), Spara i-kortet och kortet "Fortsätt där du var".
- **Verifierat i simulatorn med inlagda gamla id:n:**
  - Gillade har `'47'` och `'99'`: visar 4 produkter.
  - Samlingen Bastu har `'47'`, `'3'`, `'99'`, `'17'`: visar "2 produkter".
  - Följda `jl-merino`, `fk-basplagg` och `brand-our-legacy` syns inte. Följer visar Filippa K, J.Lindeberg och Skandinavisk/Urban stil.
- **Vad som händer med gamla sparade data:**
  - Id:n `'1'`–`'20'` finns kvar men **pekar nu på de nya produkterna**. Den som hade sparat gamla produkt '3' (jeansjacka) har nu Black Studio Sneaker sparad.
  - Högre id:n och borttagna samlingar ligger kvar i lagringen men visas inte.
  - Egna samlingar behålls alltid, även om de blir tomma ("0 produkter", mosaik i placeholder).

## Verifiering
- `tsc --noEmit` är grönt, och iOS-exporten (Metro-check) är grön, med 60 assets inklusive de 20 produktbilderna.
- **Simulator iPhone 17, mörkt och ljust läge:**
  - **Hem:** alla hyllor har innehåll med nya bilder. "Fler i din stil" visar Weekday, Lindex och H&M med logotyper. Logotyper syns på "Samlingar för dig".
  - **Produktdetalj och lightbox:** ekbordet, en bild.
  - **Partnerdetalj:** Lindex, Royal Design (logotyp) och Budrummet.
  - **Samlingsdetalj:** Smarta hem, Gaming Deluxe, Handla hållbart, Second Hand och Second Life.
  - **Sparat och Följer** med gamla id:n.
  - **Följer-fliken** (produktgrid) och **Hitta** (öppnar; svaret läser `PRODUCTS`).
- **Testkod borttagen:** scroll-offset, ljust läge och startflik Följer. Inget `TEMP-DEBUG` utöver de befintliga `-GEST` ligger kvar.
- **Simulatorns lagring** har fortfarande de inlagda gamla id:na (testdata).
- **Inte separat granskat:**
  - Jämförelsen nedrullad på en produkt med tre erbjudanden. Ekbordet och fåtöljen har flera erbjudanden, och skärmdumpen visar rubriken "Köp hos" men inte hela listan.
  - Partnerdetalj för J.Lindeberg, Filippa K, H&M, Weekday, Nordic Nest och Återbruket. Samma vy som de tre jag kontrollerade.

## Flaggor
- **Fem liggande bilder, inte fyra:** mockabootsen är också liggande (500 × 326). Korten beskär med `cover`, och motiven syns.
- **Bilderna är 500 px breda** och något mjuka på stora stående kort (280) och i Produktdetaljens hero. Inte åtgärdat.
- **Produktdetaljens prisrad "Från … kr Begagnat"** visar lägsta pris oavsett skick (ekbordet: 2 600 begagnat), medan kortet visar lägsta nya pris (4 495). Det är befintlig logik, men den syns tydligare nu när fler produkter har begagnat.
- **Reservmixar och HeroRow** fick nya bilder via en enkel mappning: motiven stämmer inte med mixnamnen, som "Höstens lager". HeroRow, DiscoveryCards och CardShowcase visas inte på Hem.
- **Hem- och teknikmärkena** (Sonora, Ljusverket, Ekens Verkstad, Nordform) är påhittade och har ingen egen sida. Produktdetalj visar märket som text.
- **"56 dummyprodukter"** står kvar i `CLAUDE.md` och `docs/plan.md`. Jag rörde dem inte (inte listade i briefen).
- **Utanför scope (inte byggt):**
  - fler produkter och hudvård
  - flera bildvinklar
  - ny kategori utöver typen Teknik
  - filterflikar som filtrerar
  - bättre bildupplösning
