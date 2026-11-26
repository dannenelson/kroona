# Rapport brief 65 – Hero på samlings- och företagsprofiler

## Inventering: vad som fanns
- **`app/collection/[id].tsx` och `app/partner/[id].tsx`:**
  - Cover 4:5 i full bredd, med en `Image` (eller mosaik för egna samlingar) i en `Transition.Boundary` (zoommål).
  - Toningen var `overlay.scrimStops`: över de nedre 45 %, ända till helt solid.
  - `scrollY` (Reanimated) fanns redan, men bara för att tona in titeln i toppen. Ingen parallax.
- **Partnerdetalj:**
  - På toningen: logotypcirkel 64 (`logo.headerCircle`) **ovanför** namnet (`display` 34).
  - Under hero: raden "N produkter" + Följ (Pill filled).
  - Rubrikerna Om varumärket, Finns, Samlingar och "Alla produkter" hade inga antal.
- **`BrandLogo`:** logotypen på en mörk platta. Ramen (90 × 45) var 60 % av cirkelns diameter, men den **synliga** logotypen blev bara 30–59 %, eftersom filerna har olika mycket luft.
  - Används i Partnerdetaljens hero, `ProfileCard` (Fler i din stil), varumärkesrader i Sparat och `PartnerCard` (platta, variant brand).
- **`PartnerCard`:** variant brand med logotyp på platta, och variant style (samlingskort). I Partnerdetalj visas samlingarna som style.
- **`data/logos.ts`:** fem återförsäljarlogotyper (Filippa K, H&M, Lindex, Nordic Nest, Royal Design) och sex samlingslogotyper.
- **`data/retailers.ts`:** fem varumärken, två butiker och två andrahandstjänster, med `presence` och `initial`. **Inga områden per företag.**
- **`data/areas.ts`:** sex områden med filter (kategori, stil, typer).

## Gjort
1. **Parallax** (`hooks/useParallaxHero.ts`, Reanimated) på Samlingsdetalj och Partnerdetalj, inte på Produktdetalj.
   - Bilden flyttas ned med halva scrollen (`motion.parallax` 0,5) och glider in bakom innehållet, som nu har temats bakgrund.
   - Vid överscroll följer bildens överkant skärmens topp, och bilden skalas upp.
   - Minska rörelse: ingen parallax.
2. **Företagsprofil:**
   - Hero 60 % av den tidigare höjden.
   - Ny svagare toning `overlay.heroScrimSoft`: 0 → 35 % → 70 % över de nedre 60 %, i stället för till helt solid.
   - **Vänster:** rund logotyp 48 (`logo.heroCircle`) + namn (`title1`). Initialer om logotyp saknas, som för J.Lindeberg och Återbruket. Under: områdena.
   - **Höger:** Följ (Pill glas på foto), linjerad i botten.
   - Antal produkter är borttaget från hero, och raden under hero är borttagen.
3. **Antal vid rubrikerna:** `SectionTitle` fick `count`, som visas som " · N" dämpat. "Samlingar · N" och "Produkter · N". Rubriken "Alla produkter" heter nu "Produkter".
4. **Logotypen i cirkeln och på plattan:** den längsta synliga sidan tar nu 60 % av diametern eller bredden. Ramen skalas med uppmätt fyllnadsgrad per fil (`RETAILER_LOGO_FILL`):

   | Logotyp | Fyllnadsgrad |
   |---|---|
   | Filippa K | 0,59 |
   | H&M | 0,50 |
   | Lindex | 0,89 |
   | Nordic Nest | 0,72 |
   | Royal Design | 0,98 |

   Värdena räknade jag ut ur SVG-banorna. Ändringen gäller överallt där `BrandLogo` används.

## Områden per företag (härlett, rapporterat enligt briefen)
`lib/retailerAreas.ts` tar företagets produkter (`getProductsForRetailer`) och bygger raden så här:
1. Kategorierna Kläder och Möbler som någon produkt har.
2. "Begagnat" för andrahandstjänster.
3. De områden där minst en av produkterna ingår.

Högst tre delar visas. Utfall:

| Företag | Områdesrad |
|---|---|
| Lindex | Kläder · Skandinavisk stil · Vintage |
| Filippa K | Kläder · Skandinavisk stil · Vardagsuniform |
| Royal Design | Möbler · Hemmakontor · Skandinavisk stil |
| Återbruket | Kläder · Möbler · Begagnat |
| J.Lindeberg | Kläder · Utomhusklart |
| H&M | Kläder · Utomhusklart |

## Beslut jag tog själv
- **Hero-höjden** är ett lokalt mått (`COVER_HEIGHT_SHARE` 0,6 av 4:5), som tidigare `COVER_ASPECT`.
- **Namnet i hero** är `title1` (26), inte `display` (34). Det står i en rad med logotypen på en lägre hero.
- **Följ på foto:** Pill i glasvarianten med tonen `photo`. Den filled-variant som låg under hero skulle bli ljus på foto i ljust tema.
- **"Alla produkter" → "Produkter"**, enligt briefens exempel.
- **Antalen gäller bara Partnerdetalj.** Samlingsdetaljs metarad ("6 produkter · Tema") är orörd, eftersom briefen bara nämnde företagsprofilen.
- **Logotypregeln gäller överallt:** fyllnadsgraden används också på plattan (`PartnerCard`, variant brand), inte bara i cirklar, enligt "där cirkeln används".

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK.
- **Simulatorn,** egen Metro på 8097, mörkt och ljust läge. En tillfällig scroll-parameter och temaväxling via länk, inte committade.
  - Partnerdetalj för Lindex (röd logotyp), Filippa K (vit), H&M, Royal Design (butik), Återbruket (andrahand, initialer) och J.Lindeberg (initialer).
  - Parallax i Partner- och Samlingsdetalj (Urban stil): bilden ligger kvar bakom innehållet.
  - Överscrollens skalning är bara visad via ett tillfälligt negativt scrollvärde. Ett riktigt drag med fingret går inte i simulatorn.
  - Logotyperna i Fler i din stil på Hem fyller nu cirklarna jämnare.
- **Städat:** min Metro är stoppad, den tillfälliga koden återställd och temavalet tillbaka på mörkt. Din server på 8081 är orörd.

## Utanför scope (flaggat, inte byggt)
- Riktiga områden per företag i datan.
- Nya hyllor.

## Övrigt upptäckt
- **Övergången nedåt kan krocka med överscrollen.** På Samlingsdetalj stänger ett drag nedåt överst skärmen (hierarkiövergången). Den syns därför troligen sällan på riktigt, och det behöver bedömas på enhet.
- **Toningen i ljust tema:** den mjukare toningen slutar på 70 % mörkt och möter sedan en ljus sida. Kanten mellan foto och sida syns tydligare i ljust läge än förut.
