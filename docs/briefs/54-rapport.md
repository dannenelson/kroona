# Rapport brief 54 – Kategorivy, alla kategorier, Områden-lista och områdesdetalj

## Inventering: vad som redan fanns
- **`app/(tabs)/find.tsx` (brief 53):** hyllorna Idéer, Kategorier och Områden och stilar fanns redan.
  - Kategorierna var en lokal lista utan tryck.
  - Områdesgriden var byggd direkt i filen.
  - Ingen hylla hade "Visa fler".
- **`components/AreasRow.tsx` (Hem):** samma områden som små stående kort, utan tryck. Den räknade fram sitt eget urval.
- **`SectionTitle`:** hade redan "Visa fler ›" (`cta`) från brief 53, men ingen hylla använde den. **`FilterPills` och `ProductGrid`** användes oförändrade.
- **`lib/catalog.ts`:** hade `getProductsForArea` / `getProductsForFilter` och `hasUsedOffer`. **`lib/search.ts`** behövde inte ändras.
- **`data/areas.ts`:** sex områden, alla med `description`. `defaultFollowed` finns i datan men används inte.
- **Följ:** det fanns **ingen följmekanism för områden**.
  - Samlingar och varumärken följs via `FollowedCollectionsContext`, en generell mängd nycklar i AsyncStorage `@kroona/followedCollectionIds`. Samlingsdetaljen och Partnerdetaljen har en Pill "Följ"/"Följer".
  - Sparat → Följer visade bara Varumärken, Personer och Samlingar.
- **`app/collection/[id].tsx`:** följknappen sitter i en metadatarad med antal till vänster och Pill till höger. Det mönstret återanvänds.
- **`app/results.tsx` och `app/search.tsx`:** sökläget som öppnades från resultatet lades ovanpå, så den nya sökningen hamnade över den gamla.
- **Typdata:** möbler har `type`, men **kläder har ingen typ**, bara `gender` (dam/herr/unisex).

## Gjort
1. **Kategorivy** (`app/category/[id].tsx`, id `klader` / `mobler` / `begagnat`):
   - Upptill: tillbaka och rubrik (`screenTitle`, Familjen Grotesk 28/32), därunder "Fråga om {Kategori}" och antal till höger.
   - Knappen "Fråga om": pill 40 hög, `surfaceRaised` (surface2), hårlinjekant, stjärna. Den öppnar `dialog` med `scope` = kategorins namn.
   - Pillarna filtrerar och visas bara om de ger träffar:
     - **Möbler:** Alla, Stolar, Bord, Belysning, Teknik.
     - **Kläder:** Alla, Dam, Herr, Unisex. Datan saknar typ för kläder, så pillarna går efter kön.
     - **Begagnat:** alla produkter med begagnat erbjudande (9), pillar Alla, Kläder, Möbler.
   - Kategorierna finns i ny `data/categories.ts`. Hitta-korten öppnar vyn.
2. **Alla kategorier** (`app/categories.tsx`): `ListRow` med bild 56 × 56 radie 14 från första produkten, namn, antal och chevron. Inga undernivåer. "Visa fler ›" på Kategorier (Hitta) leder hit.
3. **Alla områden** (`app/areas.tsx`): samma områdeskort i 2-kolumnsgrid, alla områden. Griden är utbruten till `components/AreaGrid.tsx` och delas med Hitta. "Visa fler ›" på Områden och stilar (Hitta) och på Områden (Hem) leder hit.
4. **Områdesdetalj** (`app/area/[id].tsx`): tillbaka, rubrik, beskrivning (dämpad), antal, Följ och `ProductGrid` med `getProductsForArea`.
   - Följ använder befintlig mekanism: områdets id är nyckeln i `FollowedCollectionsContext`.
   - **Sparat → Följer har en ny sektion "Områden"** med rader och menyn Öppna / Sluta följa.
   - Områdeskorten på både Hem och Hitta öppnar vyn. Noten om att korten inte öppnar något är borttagen.
5. **Idéer** (`app/ideas.tsx`): idékorten i en kolumn, fulla bredden. Kortet är utbrutet till `components/IdeaCard.tsx`. "Visa fler ›" på Idéer för dig leder hit.
6. **Sök om ersätter:**
   - Fältet i Sökresultat ersätter resultatet med sökläget (`router.replace`), och den nya sökningen ersätter i sin tur sökläget. Tillbaka går därför dit man var före första sökningen.
   - "Avbryt" i sökläget återställer resultatet man kom från, med samma `q` eller `idea`.
7. **Gamla länkar:** inte ändrade, se frågetecken nedan.

## Beslut jag tog själv
- **Delad topp `components/ScreenHeader.tsx`:** TopBar med tillbaka och rubrik i `screenTitle`. Fem nya skärmar använder den.
- **Nya tokens:**
  - `typography.screenTitle` 28/32, samma värden som `greeting` men med en egen roll;
  - `findCards.askChipHeight` 40.
- **Idéerna i listan** är fulla bredden med samma proportion som 240 × 160, alltså ca 239 höga på en 390-skärm. "240 × 160" och "fulla bredden" går inte att uppfylla samtidigt.
- **Övergångar:** alla nya skärmar glider in från höger (`pushScreenOptions` från brief 53). Ingen zoom, eftersom korten inte har boundary.
- **Följda områden** sorteras A–Ö i Sparat, mellan Personer och Samlingar.

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK (2205 moduler).
- **Simulatorn, mörkt läge**, via djuplänk på egen port 8097. Varje steg renderar rätt:
  - Hitta med "Visa fler ›" på alla tre hyllorna;
  - Möbler, Kläder och Begagnat med sina pillar och antal (8, 12, 9);
  - Dialogen med pillen "Möbler" och startförslag;
  - Kategorier (lista);
  - Områden och stilar (grid);
  - Vintage (detalj med Följ);
  - Idéer (en kolumn).
- **Ljust läge:** Möbler, Kategorier, Hemmakontor och Idéer. OK.
- **Kedjorna är INTE tryckta igenom av mig.** Simulatorn kör utan fönster, och installationen av ett tryckverktyg (AXe) nekades. Daniel valde att trycka själv. Kedjor att trycka:
  1. Hitta → Möbler → "Fråga om Möbler" → dialog med pill.
  2. Hitta → Kategorier "Visa fler" → lista → vy.
  3. Områden "Visa fler" (Hem och Hitta) → lista → detalj → Följ → syns i Sparat → Följer → Områden.
  4. Idéer "Visa fler" → lista → resultat.
  5. Sök om från resultat → tillbaka. Det ska landa där man var före första sökningen.
- Testkoden (ljust tema) är borttagen och ingen `TEMP-DEBUG` är committad. Min Metro på 8097 är stoppad, och Daniels server på 8081 är orörd.

## Frågetecken
- **"Utforska" i Sparat** (tom Följer-flik) leder till Hitta-startsidan. Det fungerar och är lämnat som det är. Frågan är om den hellre ska leda till Alla områden, nu när man kan följa områden. `ContinueDialogRow` är inte rörd.
- **Samma bild på Kläder och Begagnat i Alla kategorier.** Båda får ponchon, eftersom bilden tas från första produkten och ponchon är först i båda. Katalogens ordning styr.

## Utanför scope (flaggat, inte byggt)
- Undernivåer i kategorilistan.
- Pris- och Stil-filter.
- Notisskärm.
- Mixarnas destination.
- Filtrerande Hem-pillar.
- Hyllström.
- Chatthistorik, röst och namn på AI:n.

## Övrigt upptäckt
- **`defaultFollowed`** finns på två områden (Hemmakontor, Mjukt hem) men används inte. Standardmängden för följ är bara Kroonas samlingar. Ska de vara förföljda i demot behövs en egen ändring, och den slår bara igenom för nya installationer.
- **Sök om via "Fråga om":** om man i sökläget (öppnat från resultat) väljer "Fråga om" ersätts sökläget av dialogen. Tillbaka från dialogen går då förbi det gamla resultatet.
