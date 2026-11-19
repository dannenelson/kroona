# Brief 10 — Toppkanten bakom Dynamic Island (rättning av brief 08)

**Varför:** Brief 08 byggde en vågig form i en demoruta mitt i dev-routen. Det visar bara att tekniken går. Daniel vill se och bedöma toppkanten där den ska sitta, och den ska **ersätta** toningen som redan ligger överst, inte vara en ny form bredvid.

**Det Daniel vill se (visuellt resultat, inte teknik):**
- Toningen finns **bara bakom statusfält och Dynamic Island** (safe area överst + en liten bit, ca 68 px). Den ska inte synas som en form mitt i bilden.
- Den är **gradvis**: starkast vid själva överkanten och mjukt utfasad nedåt, så att den möter skärmens övre kant utan synlig gräns. Ingen "ritad form med blur på". Man ska inte kunna peka ut var den slutar.
- Nedre gränsen är **organisk, inte rak**: toningen når olika djupt åt olika håll över bredden (mjuka, långsamma kurvor), men på ett sätt som bara märks som att kanten inte är en rak linje.
- Den ska se bra ut över både ljusa och mörka foton och över ren bakgrund.

**Läs först:** `CLAUDE.md`, `components/EdgeFade.tsx`, `app/components.tsx`, `app/(tabs)/_layout.tsx`, `components/CustomTabBar.tsx`. Presentera en plan i Plan Mode först.

## Gör
1. **Undersök och rapportera:** var kommer toningen/blurren överst på flikskärmarna ifrån idag? Är det vår kod, eller iOS egen scroll-edge-effekt (iOS 26)? Hur stänger man av den om den är nativ (t.ex. scroll-edge-/header-props)? Ändra inget på flikskärmarna ännu, bara rapportera.
2. **Ta bort demorutan som test.** I dev-routen ska det som testas vara **skärmens egen toppkant** (den som redan ligger fast överst på dev-sidan, bakom riktiga statusfältet och Dynamic Island), med växel **Rak / Vågig** (Pill överst på sidan eller i en flytande kontroll). Innehållet scrollar under den, så Daniel ser den i rätt sammanhang. Behåll Blur på/av.
3. **Gör toppkanten gradvis så som beskrivet ovan.** Dubbla toningar får inte ge en synlig form: antingen styr formen hur långt toningen når (djup varierar över bredden), eller så maskas en gradient med en mycket mjuk kant. Välj det som ser ut som en jämn tonövergång, inte en form. Mer utsuddning och mindre kontrast i kanten är bättre än skarpare form. Tokens i `theme/`.
4. Testa att det syns rätt över: ljust foto, mörkt foto och ren bakgrund, i båda teman. Beskriv i rapporten hur det ser ut och vad som är svårt att bedöma utan enhet.
5. Verifiera: `npx tsc --noEmit`, iOS-export, grep att inga hex/fontstorlekar/spacing-siffror ligger utanför `theme/`. Commit (ingen push).

## Gör INTE
- Ändra flikskärmarna, tab-baren eller botten-toningen. Det kommer efter att Daniel valt form (nästa brief ersätter den nuvarande toningen på riktigt).
- Nya paket utan att fråga.

## Klart när
- Dev-sidans egen toppkant kan växla Rak/Vågig, ligger bara bakom Dynamic Island och är en gradvis övergång utan synlig form.
- Rapporten säger varifrån flikskärmarnas nuvarande topptoning kommer.
- tsc och export utan fel, commit finns.

## Rapportera kort
Varifrån dagens topptoning kommer och hur den kan ersättas, vilken teknik du valde, hur det ser ut över ljus/mörk bakgrund, och vad som bara kan bedömas på enhet.
