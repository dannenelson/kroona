# Rapport brief 29: Partnerdetalj och kurator på samlingar

**Byggt:**
- **Datamodell:** `Collection.curator: { kind: 'kroona' | 'retailer' | 'user'; id? }`. Teman har `kroona`, och varumärkes-filtersamlingarna har `retailer`. Nya `RETAILER_COLLECTIONS`, DUMMYDATA (Fas 0): J.Lindeberg "Golf och rörelse" och "Merino och skjortor", Filippa K "Ull och stickat" och "Basplagg". De är delmängder av varumärkenas befintliga produkter. Filtret fick varianten `{ type: 'products'; ids }`, eftersom en delmängd inte går att uttrycka med brand/style. Det är en ny variant, inte ett nytt fält.
- **`app/partner/[id].tsx`:** cover med namn, samma toppkant, EdgeFade och glasknapp. Sedan antal produkter + Följ, Om varumärket (beskrivning, värdegrund), Finns (e-handel/butiker, hoppas över om tomt), hyllan Samlingar (PartnerCard, öppnar Samlingsdetalj med zoom) och Alla produkter (masonry). Hela skärmen är en `Transition.ScrollView`.
- **Rörelse:** återanvänder `hierarchyScreenOptions(group)` med en ny grupp `partner` (`partnerScreenOptions`).
- **Ingångar:**
  - PartnerCard för varumärkessamlingar i "Du följer" öppnar Partnerdetalj (`partnerId`). Teman öppnar fortfarande Samlingsdetalj.
  - ProfileCard i "Fler varumärken i din stil" öppnar Partnerdetalj med zoom från cirkeln.
- **Samlingsdetalj:** kuratorraden "Av Kroona" / "Av J.Lindeberg". Varumärket öppnar Partnerdetalj, utan zoom eftersom raden saknar bild.

**Verifierat i simulatorn** (tillfälliga automatiska tryck och scroll, borttagna):
- Hem → Partner (zoom ur kortet) → Samling från hyllan (zoom, "Av J.Lindeberg · 5 produkter · Kollektion") → Produkt → Produkt. Stängningen gick steg för steg tillbaka till Hem.
- Hyllan och gridden visas på Partnerdetalj.
- tsc, iOS-export och grep är gröna.

**Kräver enhet:** swipe ned och kantswipe, och ljust tema visuellt.

**Beslut (invänd gärna):**
1. **Varumärkes-filtersamlingarna ligger kvar** i `COLLECTIONS`. Flöde, `personalizationSignals`, DiscoverBrandsRow, "Du följer" och följ-lagringens standard bygger på dem, och att ta bort dem hade brutit Flöde och personalisering.
2. **Följ på Partnerdetalj** (följ-målet varumärke) använder varumärkessamlingens id som nyckel när den finns, annars återförsäljarens id (`getRetailerFollowKey`). Partnerdetalj, ✓ på kortet i "Du följer" och Flöde visar då samma läge.
3. **Kollektionerna ligger i en egen lista** (`RETAILER_COLLECTIONS`), så Hem, Flöde och följ-standarden är oförändrade. Samlingsdetalj slår upp i `ALL_COLLECTIONS`.
4. **Cover:** `Retailer` saknar bild. Covern är varumärkessamlingens bild, annars första produktens. Ingen logotyp, bara namnet.

**Följ-standarden ("alla följs") påverkar Partnerdetalj:** J.Lindeberg och Filippa K visas som följda, eftersom deras samlingar ingår i standarden. Övriga varumärken visar "Följ". Följer man dem syns det inte i Flöde, eftersom Flöde bara läser `COLLECTIONS`.

**Flaggas, inte åtgärdat:** Flöde bör läsa följda varumärken direkt när Hem och Flöde omarbetas, och då kan filtersamlingarna tas bort. Partnerdetalj för butiker och andrahandstjänster är inte byggd.

**Spegla i Claude Project-dokumenten (Spec/Sammanställning):**
- Samling = kuraterad produktuppsättning med kurator (Kroona / varumärke / användare). Varumärke = egen entitet med Partnerdetalj.
- Datamodell: `Collection.curator`, filtervarianten `products`, `RETAILER_COLLECTIONS` (dummy Fas 0).
- Partnerdetalj byggd för varumärken, med ordningen cover · antal + Följ · Om · Finns · Samlingar · Alla produkter.
- Samlingsdetalj har kuratorraden "Av …" (varumärke → Partnerdetalj).
- Varumärkeskort på Hem leder till Partnerdetalj, och teman till Samlingsdetalj.
- Partnerverktyg för varumärkens egna samlingar är Fas 1+.
