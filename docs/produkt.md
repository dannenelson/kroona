# Kroona — Produkt

*Vad Kroona är och vad som är bestämt. Ändras sällan. Ersätter `Kroona_Sammanstallning.md` (byggd på spec v1.2, delvis föråldrad). Detaljer och motiveringar finns kvar i specen. Senast: 2026-11-18.*

## Vad
En svensk upptäcktsplattform för mode och heminredning som äger hela köpresan, från inspiration till köp. Pinterest-känsla, men på riktig produktdata (pris, lager, begagnat, hållbarhet) i stället för annonser.

**Varför:** Google, Meta och Amazon tjänar på att köpresan är rörig. Prisjämförare löser bara priset. Kroona har ingen dold agenda.

## För vem
- **Konsument:** designmedvetna, hållbarhetsintresserade, hämtar idag inspiration från Pinterest/Instagram/TikTok.
- **Återförsäljare:** små och medelstora D2C-varumärken, helst utan befintliga affiliate-avtal.
- **Start:** Sverige, kläder först, sedan inredning. Begagnat ingår i samma flöde som nytt från dag ett.

## Affärsmodell
CPA, provision per genomförd försäljning och aldrig per klick. "Ni betalar bara när ni säljer." Server-side tracking, last-click, 30 dagars click_id. (Detaljer: spec avsnitt 9–10.)

## Vision och UX-principer (Daniels formulering, 2026-11-18)
Göra köpresan enklare och roligare för alla konsumenter, oavsett intresse eller kategori, från inspiration och utforskning till köp.

1. **Hela resan täcks av fyra flikar** (Hem, Flöde, Hitta, Sparat). Användaren ska alltid kunna vända sig till Kroona för hjälp.
2. **Hitta det som passar just mig:** specifikationer, pris, hållbarhet, plats och cirkularitet. Information om företagen man stöttar visas transparent.
3. **Användaren har kontrollen:** följ varumärken, företag, områden och samlingar (inte andra användare) för att styra vad som syns i Flöde.
4. **Konsumenten betalar aldrig, och företag betalar inte för att vara med eller synas.** Provision tas bara när en försäljning gått genom tjänsten. Alla spelar efter samma regler.
5. **Senare:** önskelistor (som GoWish) och att följa andra användare.
6. **Innehållet ska vara relevant, bra och snyggt.** Referenser: Spotify (personlig, igenkänning) och Pinterest (upptäckt).
7. **Inga generella värderingar.** Vad som är viktigt (pris, hållbarhet, cirkularitet) skiftar från köp till köp. Kroona lär sig av det man aktivt söker och jämför, och användaren ska kunna se och rensa vad Kroona minns.

## Produkten
| Flik | Roll |
|---|---|
| **Hem** | Samlingspunkt, som Spotify: kompakt hälsningshero, sedan hyllor med kort (samlingar, varumärken, områden, rekommendationer). Inga produkter i grid. Tryck öppnar ett eget läge. |
| **Flöde** | Uppdateringar från det man följer: varumärken, företag, områden, samlingar. |
| **Hitta** | Dialog som hjälper att bolla och få ett urval, plus jämförelse. Valen (pris, hållbarhet m.m.) är en del av dialogen. Inline produktkort. |
| **Sparat** | Det man sparat och följer, där man hanterar det. Egna samlingar, "Gilla" alltid först. |

**Detaljvyer:** Produktdetalj, Samlingsdetalj, Partnerdetalj (varumärke/företag). Profildetalj (andra användare) väntar, eftersom man följer varumärken och inte personer. Masonry-grid (Pinterest-känsla) bor i detaljvyerna, inte på en flik.
Hem är det som är relevant nu, Flöde är det man följer.

## Låsta beslut
- **Datamodell:** Produkt / Återförsäljare / Erbjudande. Nytt/Begagnat är en egenskap hos Erbjudandet.
- **Begagnat visas före nytt**, grupperat per tjänst, med fast prissortering. Prisläge: "Fast pris" eller "Auktion, bud från".
- **Nytt (Köp hos):** sorterbart, default pris.
- **Hållbarhet** informerar och dömer aldrig. Data visas neutralt.
- **Tillbaka-knappen** går alltid till skärmen man kom från.
- **Egna samlingar** byggs i Fas 0 med lokal lagring (AsyncStorage).
- **Område** = kategori eller stil med kurerat innehåll (t.ex. Hemmakontor, Skandinavisk stil).
- **Följa** (varumärke, företag, område, samling) byggs i Fas 0 lokalt, med några förvalda följda i demot. Konton och följa användare är Fas 1+.
- **Personalisering:** Kroona minns lokalt vad man söker och jämför. Riktig personalisering över tid är Fas 1+.

## Datamodell (Fas 0, konkret) — brief 12
Typer i `types/catalog.ts`, data i `data/`, urvalsfunktioner i `lib/catalog.ts`.

| Typ | Fält | Fil |
|---|---|---|
| **Produkt** (`CatalogProduct`) | id, brand, name, imageUrl (kanonisk), aspectRatio, featured, sustainabilityScore, `isNewArrival` (märket "Nyhet", inte skick), category, style, gender/ageGroup (kläder), type (möbler), `facts` (material, madeIn, certification, valfria). **Inget pris, inget skick.** | `data/products.ts` (`CATALOG`), `newProducts.ts`, `catalogTopup.ts` |
| **Återförsäljare** (`Retailer`) | id, `kind: 'retailer'`, name, retailerType (`brand` · `store` · `secondhand`), brandName (för brand), description, values, presence (online, stores[]), initial, defaultFollowed | `data/retailers.ts` |
| **Erbjudande** (`Offer`) | id, productId, retailerId, price, **condition** (`new` · `used`), conditionNote och **pricing** (`fixed` = "Fast pris", `auction` = "Auktion, bud från") för begagnat, stock (`in_stock` · `few_left` · `out_of_stock`), shipping (text), url (dummy) | `data/offers.ts` |
| **Område** (`Area`) | id, `kind: 'area'`, name, description, filter (category, styles[], types[]), defaultFollowed | `data/areas.ts` |
| **Samling** (`Collection`) | som förut + `kind: 'collection'`, defaultFollowed | `data/collections.ts` |
| **Följbart** (`FollowTarget`) | `{ kind: 'retailer' \| 'collection' \| 'area', id }`. Bara data, logiken byggs senare. | `types/catalog.ts` |

**Dummydata:** 56 produkter, 42 återförsäljare (35 varumärken med riktiga namn men bara demotext, 4 påhittade butiker, 3 påhittade andrahandstjänster), 142 erbjudanden (99 nya, 43 begagnade). 31 produkter finns begagnade; 5 finns bara begagnade. Begagnat är alltid billigare än nytt. Fem områden: Hemmakontor och Mjukt hem är förvalda följda. Förvalda följda varumärken: J.Lindeberg, Filippa K.

**Bakåtkompatibilitet:** `PRODUCTS` (kortformatet `Product` i `types/product.ts`) härleds med `toCardProduct` (`lib/cardProduct.ts`): `price` = lägsta nya pris, annars lägsta begagnade · `isUsed` = inga nya erbjudanden (bara begagnat) · `isNew` = `isNewArrival` · `material` = `facts.material`. Befintliga komponenter och skärmar läser samma fält som förut och är oförändrade.

**Urvalsfunktioner** (`lib/catalog.ts`, rena, data som standardargument): `getOffers(productId, { condition, sort })` · `getNewOffers(productId, sort)` · `getUsedOffersByService(productId)` (grupperat per tjänst, fast prissortering) · `getLowestPrice(productId, condition?)` · `hasUsedOffer(productId)` · `getRetailer(id)` · `getProductsForRetailer(id)` · `getProductsForCollection(collection)` · `getProductsForArea(area)` · `getSimilarProducts(productId, limit)` (samma kategori, poäng för stil och möbeltyp).

## Faser
| Fas | Innehåll |
|---|---|
| **0 (nu)** | Demo med 56 dummyprodukter. Ingen backend, tracking eller provision. Målet är att visa pilotpartners. |
| 1 | En riktig återförsäljare, tracking och provision, konton, Supabase. |
| 2 | Cirka 100 användare via nätverk och waitlist. |
| 3 | Fler återförsäljare, kategorier och länder. |

## Principer
Konsumenten äger köpresan · Lugnt och sansat, aldrig hispigt · Polering är inget efterhandsarbete · Bygg för att hålla, inga genvägar · Transparens som fördel · Minimal funktion, maximal upplevelse

## Pilotkontakter
J.Lindeberg (varm intro) · RevolutionRace · Nordic Nest · Adtraction. Vinkel: konkret och teknisk (CPC-höjningar 2025) före abstrakt hållbarhetsvision.

## Avvikelser mot gamla dokument
- **Typsnitt och färg i Sammanställningen är föråldrade** (Cormorant/DM Sans, `#0F0F0E`). Gällande värden ligger i Design-dokumentet.
- **"Hero och glas parkerade"** gäller inte längre. Hero-hälsning och glas är beslutade.
- **"Konto från dag ett"** är ett Fas 1-krav. Fas 0 har inget konto eller backend.
- **Onboarding (5 steg)** är medvetet parkerad och inte planerad i Fas 0.
- **Flikarnas roller ändrades 2026-11-18.** Tidigare: Hem känt, Flöde upptäckt med masonry. Nu: Hem hyllor, Flöde följda. Wireframes, ia-karta och Spec bör justeras vid tillfälle.
