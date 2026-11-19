# Brief 13 — Produktdetalj (steg 3)

**Mål:** Bygg Produktdetalj som en riktig skärm, nåbar från produktkorten, med datamodellen från brief 12. Det är navet för Jämför och Köp. Endast den här skärmen. Ingen Samlings- eller Partnerdetalj, ingen följa-logik, ingen backend.

**Läs först:** `CLAUDE.md`, `docs/produkt.md` (Låsta beslut, datamodell), `docs/wireframes.md` §1, `docs/design.md` §0, `lib/catalog.ts`, `types/catalog.ts`, `components/`, `app/components.tsx`. Visuell referens: Claude Design "Kroona Looken A" https://claude.ai/artifact/5XbvB5EogW8efQhHAzkxDH, skärmarna **Produktdetalj** och **Produktdetalj · nedscrollad** (mörkt och ljust). Presentera en plan i Plan Mode först.

## Struktur (uppifrån, enligt wireframen och designen)
1. **Hero-bild** (full bredd, produktens bild) med glasknappar över fotot: tillbaka (vänster) och dela (höger, utan logik). Foto-glas enligt `design.md`. Ingen pricksida (datan har en bild per produkt).
2. **Märke** (liten, dämpad) och **produktnamn** (Familjen Grotesk).
3. **Pris och Spara:** pris till vänster, Spara-knapp till höger. **Pris = lägsta pris över alla erbjudanden, visat som "Från X kr"** (använd `getLowestPrice`). Är det begagnat som är lägst: en liten dämpad etikett "Begagnat" bredvid. Spara-knappen: bokmärkesikon + text "Spara"/"Sparad". **Sparad = fylld bokmärkesikon och ändrad text, ytan inverteras inte.** Använder befintliga `SavedProductsContext`.
4. **Hållbarhet:** neutral presentation (ingen grön/röd, aldrig värdering). Visa hållbarhetsindexet som vanlig text/siffra ("4,2 av 5") plus fakta-tabell (material, tillverkad i, certifiering) där de finns. Samma oavsett erbjudande.
5. **Finns begagnad hos:** **före** nytt. Visas bara om produkten har begagnade erbjudanden. Grupperat per tjänst (`getUsedOffersByService`), fast prissortering. Rad: initialcirkel, tjänst, skick, **prisläge** ("Fast pris" eller "Auktion, bud från"), pris, lager, chevron.
6. **Köp hos:** nya erbjudanden, **sorterade på pris stigande** (ingen sorteringskontroll i Fas 0, eftersom det bara är 1–3 rader). Rad: initialcirkel, återförsäljare, "Ny · frakt", pris, lager, chevron. Texter för lager och frakt: mappa kodvärdena i datan till läsbar svenska ("I lager", "Få kvar", "Slut").
7. **Liknande:** horisontell rad med små produktkort (`getSimilarProducts`, ProductCard S eller kompakt variant som i designen).
8. **Nedscrollad header:** när man scrollat förbi hero visas en sticky topp med produktnamn, tillbaka och dela (se designens "nedscrollad"). Använd `EdgeFade` (rak) bakom Dynamic Island.

## Navigation
- Ny route, t.ex. `app/product/[id].tsx`, som läggs ovanpå flikarna (Stack i roten). Tab-baren syns inte på detaljvyn.
- **Tillbaka går alltid till skärmen man kom från.**
- **Alla produktkort** (Hem, Flöde, Sparat, Hitta, rader) öppnar Produktdetalj vid tryck. Långt tryck-menyn är oförändrad. Där en skärm saknar `onPress` idag: lägg till navigation, men ändra inget annat i skärmarna. Hitta: produktkort i dialogen öppnar detaljen och tillbaka återvänder till chatten med bevarad konversation (kontrollera att det funkar, annars rapportera).
- Tryck på en erbjudanderad: **haptik och en kort bekräftelse** ("Du skulle nu gå till [återförsäljare]"), **ingen riktig länk** i Fas 0 (ingen tracking, ingen utlänk). Bekräftelsen som liten, tillfällig glasruta (toast) som försvinner av sig själv. Bygg den som en liten, återanvändbar komponent.

## Gör
1. Bygg skärmen, route och navigation enligt ovan, med befintliga komponenter och tokens (`theme/`). Nya delar som bara används här (erbjudanderad, faktatabell) bor kvar i skärmens egen mapp/fil tills de behövs på fler ställen. Gör en delad komponent först när den används på två ställen.
2. Funkar i **mörkt och ljust** tema, och med dynamisk textstorlek utan att layouten går sönder.
3. Rimliga tomma tillstånd: produkt utan begagnade erbjudanden döljer den sektionen, produkt med bara begagnade döljer "Köp hos" (och visar bara begagnat).
4. Lägg en genväg/länk i dev-sidan eller testa via ett kort så att Daniel kan öppna ett par produkter (en med både nytt och begagnat, en bara begagnad, en utan begagnat).
5. Uppdatera `docs/wireframes.md` §1 och `docs/design.md` med de avvikelser från designen som listas nedan. Verifiera: `npx tsc --noEmit`, iOS-export, grep att inga hex/fontstorlekar/spacing-siffror ligger utanför `theme/`. Commit (ingen push).

## Avvikelser från designen (Looken A) som är beslutade
- Hållbarhetsindex som siffra tillagt (designen visar bara fakta).
- Prisläge (Fast pris / Auktion, bud från) tillagt på begagnade rader.
- Ingen sorteringskontroll i "Köp hos" (pris stigande).
- Inga pricksidor på hero.
- Spara-knappen: fylld ikon + ändrad text, ingen inverterad yta.
- Pris överst = "Från lägsta pris".

## Gör INTE
- Samlingsdetalj, Partnerdetalj, Hitta-ändringar eller andra skärmar utöver att korten navigerar hit.
- Följa-logik, utlänkar, tracking, backend, nya paket (fråga först).
- Ändra produktdata eller datamodell. Behövs en ändring: rapportera den.

## Klart när
- Alla produktkort öppnar Produktdetalj och tillbaka går till rätt skärm.
- Alla sektioner fungerar för de tre produkttyperna (nytt+begagnat, bara begagnat, bara nytt), i båda teman.
- Tryck på erbjudanderad ger haptik och toast, ingen länk.
- tsc och export utan fel, commit finns.

## Rapportera kort
Hur skärmen och navigationen är uppbyggd, hur du löste Hitta-tillbaka, egna beslut och avvikelser (särskilt från designen), och vad Daniel ska titta och känna efter på enhet.
