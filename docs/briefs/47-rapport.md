# Rapport brief 47 – Företagslogotyper och samlingslogotyper (tillfälliga)

## Inventering
- **Logotypfilerna:** alla elva SVG:er är rena Figma-exporter (90 × 45, `fill="none"` på roten och färgen direkt på paths). Ingen städning behövdes. `.svgrrc` från brief 45 tar bort fasta mått och behåller viewBox, och eftersom ingen fil är svart ändras inga färger.
- **Färger:**
  - Vita: Filippa K, Nordic Nest, Royal Design och alla sex samlingslogotyper.
  - H&M `#E1081E`, Lindex `#ED174F`.
- **Var varumärken ritas idag:**
  - `ProfileCard` (cirkel 76, initialer), som används av "Fler i din stil" (Hem) och `DiscoverBrandsRow` (inte på Hem).
  - Partnerdetaljens huvud (foto + namn).
  - `PartnerCard` variant `brand` (namn som wordmark). Den används bara av `CollectionRow`, som inte är monterad sedan brief 43.
  - `BrandRow` i Sparat → Följer (`Avatar` 48).
- **Var samlingar och områden ritas:** `EditorialCard` i "Samlingar för dig" (stor), "Områden" (liten) och "Fortsätt där du var" (liggande, bara egna samlingar). Kollagekorten i "Populära samlingar" är personers samlingar, inte Kroonas, och fick därför ingen logotyp.

## Gjort
1. **Flyttat och omdöpt** med `mv` till `assets/dummy/logos/retailers/{filippa-k,hm,lindex,nordic-nest,royal-design}.svg` och `assets/dummy/logos/collections/{gaming-deluxe,handla-hallbart,scandinavisk-design,second-hand,second-life,smarta-hem}.svg`.
   - Stavfelet "NodicNest" är rättat till `nordic-nest`. `scandinavisk-design` heter som i briefen.
   - De tomma mapparna `assets/Temp/logotyper` och `samlingar` är borttagna. `assets/Temp/produkter` är orörd (brief 48).
2. **Register `data/logos.ts`:**
   - `RETAILER_LOGOS`: `brand-filippa-k` → filippa-k.
   - `COLLECTION_LOGOS`: `'2'` (Skandinavisk stil) → scandinavisk-design.
   - Övriga är kommenterade rader med `TODO 48`, däribland området "Begagnad mode" → second-hand (se flaggor).
   - Dessutom listorna `ALL_RETAILER_LOGO_FILES` / `ALL_COLLECTION_LOGO_FILES` för provytan.
3. **`components/BrandLogo.tsx`** (`retailerId`, `size`, `initial`, `shape: 'circle' | 'plate'`):
   - Logotypen ritas på en mörk platta: ny token `overlay.logoPlate` (ink850 `#1F2227`, samma i båda teman) med 1 px kant `overlay.logoPlateEdge` (vit 12 %).
   - Logotypen tar 60 % av bredden (`logo.plateShare`) med bevarad proportion 2:1.
   - Saknas logotyp ritas initialavataren.
   - `hasBrandLogo(id)` finns för att välja.
4. **Återförsäljare, vad jag rört:**
   - `ProfileCard`: logotypcirkel i stället för initialer när varumärket har en logotyp. Det gäller Hem "Fler i din stil" och DiscoverBrandsRow.
   - `app/partner/[id].tsx`: logotypcirkel 64 (`logo.headerCircle`) ovanför namnet i huvudet. Namnet är kvar.
   - `PartnerCard` variant `brand`: plattan 2:1 (60 % av kortbredden) ersätter namnet. Namnet var redan `accessibilityLabel`.
   - `app/(tabs)/saved.tsx` `BrandRow`: `BrandLogo` 48 i stället för `Avatar`.
5. **Samlingslogotyp:** `EditorialCard` har propen `logo`.
   - Den vita logotypen ersätter titeln, ovanpå toningen och blurren.
   - Stående kort: centrerad. Liggande: vänsterställd.
   - Bredd 60 % (stor/liggande) eller 75 % (liten) av kortets bredd, högst 36 hög (`logo.maxHeight`). Undertiteln är kvar.
   - Titeln finns kvar i `accessibilityLabel` (den är redan standard).
   - Inkopplad i `CollectionsForYouRow` och `AreasRow` via `COLLECTION_LOGOS`.
6. **Dev-sidan:** sektionen "Logotyper (dummy, brief 47)".
   - Alla fem återförsäljare på platta i 76 och 48.
   - Alla sex samlingslogotyper på ljust foto.
   - Tre EditorialCard (stor, liten och liggande) med logotyp på ljusa foton.
7. **Tokens:** `overlay.logoPlate`, `overlay.logoPlateEdge` och `logo { plateShare, largeShare, smallShare, maxHeight, headerCircle }`.
8. **Dokument:** `docs/designsystem.md` §18 och en rad i `docs/produkt.md` om att `assets/dummy/` ska bytas eller tas bort före publik release.

## Verifiering
- `tsc --noEmit` är grönt, och iOS-exporten (Metro-check) är grön.
- **Simulator iPhone 17, mörkt och ljust läge** (dev-sidan med tillfällig scroll och tema, nu borttagen):
  - Vita logotyper syns på plattan i båda lägena, och plattan ser likadan ut i båda.
  - Ingen logotyp kapas i cirkeln. Filippa K ryms på två rader.
  - Samlingslogotyperna är läsbara på stort, litet och liggande kort över ljusa foton.
- **Partnerdetalj för Filippa K:** logotypcirkeln syns ovanför namnet.
- **Inte separat skärmdumpat:**
  - Sparat → Följer. Raden använder samma `BrandLogo`, och den inre fliken går inte att byta via länk.
  - Hem "Samlingar för dig". Samma EditorialCard-väg som provytan.
- Min Metro är stängd, och Daniels server på 8081 är orörd.

## Flaggor
- **Ingen logotyp syns på Hem just nu.**
  - Bara Filippa K har en logotyp, och den syns inte i "Fler i din stil", eftersom Filippa K följs som standard och hyllan visar ej följda varumärken.
  - Däremot syns logotypen Skandinavisk design på kortet "Skandinavisk stil" i "Samlingar för dig".
  - Fler varumärkeslogotyper syns när brief 48 skapar H&M, Lindex, Nordic Nest och Royal Design.
- **Området "Begagnad mode" finns inte** i `data/areas.ts`. Därför är second-hand kommenterad med TODO 48 i stället för inkopplad.
- **Logotyperna fyller inte sina 90 × 45-ramar fullt ut:**
  - Royal Design är ett brett och tunt ordmärke och blir mycket litet i 48-cirkeln (Sparat → Följer).
  - Samlingslogotyperna begränsas av maxhöjden 36 (bredd 72) och blir därför ganska små på det stora kortet (280).
  - Om de ska vara större: höj `logo.maxHeight` eller beskär ramarna i filerna.
- **H&M:s röda logotyp** på den mörka plattan har måttlig kontrast. Den är läsbar men inte stark.
- **Utanför scope (inte byggt):**
  - nya återförsäljare, samlingar och produkter (brief 48)
  - logotyper i Samlingsdetaljens huvud
  - logotyper i stället för namn i produktkort eller listor
- `assets/Temp/.DS_Store` och `assets/Temp/produkter/` ligger kvar och är ospårade.
