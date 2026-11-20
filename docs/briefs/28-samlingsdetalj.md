# Brief 28: Samlingsdetalj

Fas 0. Kör autonomt (auto mode). Skriv rapport till `docs/briefs/28-rapport.md`. Committa och pusha efter verifiering (tsc + iOS-export). Inga debug-rester, döda inte Daniels Expo-server. Inventera befintliga filer innan du bygger (skriv inte över).

## Mål
Ny skärm `app/collection/[id].tsx`: innehållet i en kuraterad samling (`data/collections.ts`: varumärke eller tema). Källa: `docs/wireframes.md` §2, `docs/design.md`. Tryck på ett samlingskort (Hem, Flöde, där `CollectionCard`/`CollectionRow` används) öppnar den.

## Scope (bara detta)
1. **Rörelse = samma hierarki som Produktdetalj.** Zoom från samlingskortets bild (egen unik boundary per kortinstans, samma mönster som ProductCard), swipe ned och kantswipe stänger, föregående skärm syns ett steg bakom. Egna transition-options för skärmen i `components/product/productTransition.ts` (eller en delad fil): **återanvänd/parametrisera** produktens options, kopiera inte. Kontrollera djupet: Hem → Samling → Produkt → ny Produkt, och stängning steg för steg.
2. **Innehåll (wireframe §2, uppifrån):**
   - Cover-bild (full bredd, fast proportion) med samlingens namn överlagt (Familjen Grotesk), samma toppkant/EdgeFade och glasknappar (tillbaka) som Produktdetalj.
   - Metadata: antal produkter, kurator "Kroona", tag (Varumärke/Tema). Kort beskrivning om datan har en (annars hoppa över, hitta inte på ny datamodell).
   - Åtgärdsknapp **Följ/Avfölj** (kuraterad samling). Dela/redigera/radera hör till egna samlingar och bygger vi inte nu.
   - Filterrad som **text-flikar med understrykning** (design.md §11). Generiskt: härled flikar ur datan som finns (t.ex. Alla + kategori/stil/Nytt), visa inte tomma. Är det oklart vad som är meningsfullt: håll det minimalt (Alla · Nytt) och flagga.
   - Produktgrid: masonry, återanvänd `ProductGrid`/`ProductCard` (produktzoom till Produktdetalj ska fungera därifrån). Skärmen scrollar med `Transition.ScrollView` så att stängning samspelar med scroll som i Produktdetalj.
3. **Följ i Fas 0:** knappen byter läge och fyller samlingens `defaultFollowed`-läge lokalt. Finns redan en följ-/spara-lagring: använd den. Annars enkel lokal state eller AsyncStorage, minsta möjliga, och flagga att "Följa (lokalt)" är en egen uppgift.
4. Dummydata, ingen backend, ingen tracking. Mörkt och ljust tema. Tokens för allt (inga hårdkodade värden). Reduce motion respekteras.

## Utanför scope (nämn i rapporten om du ser behov, bygg inte)
Egna samlingar och dela/redigera, Partnerdetalj, Sparat, ändringar av Hem/Flöde utöver att kortet blir tryckbart, ny datamodell.

## Definition klar
- Tryck på samlingskort → zoom upp → samlingsdetalj med cover, metadata, Följ, flikar, masonry. Produkt i gridden öppnar Produktdetalj med zoom. Swipe ned/kantswipe stänger steg för steg utan fel bakgrund.
- Uppdatera `docs/design.md` (rörelse + Samlingsdetalj), `docs/plan.md` (status), `docs/ia-karta.md` (Samlingsdetalj byggd).
- Rapporten säger vilka beslut du tog (flikar, följ-lagring, beskrivning) så att Daniel kan invända.
