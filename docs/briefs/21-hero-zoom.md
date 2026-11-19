# Brief 21: Heron, punkter utan bakgrund + zoom in/ut som fungerar på enhet

Fas 0. Kör autonomt (auto mode). Skriv rapport till `docs/briefs/21-rapport.md`. Committa efter verifiering (tsc + Metro-check). Inga debug-rester i commit, döda inte Daniels Expo-server.

## Del A: Punkterna i detaljvyn, ingen bakgrund
- Ta bort glaspillen (`Glass tone="dark"`) bakom `PagerDots` i `components/product/HeroPager.tsx`. Punkterna ligger direkt på fotot.
- Läsbarhet mot både ljusa och mörka foton utan bakgrund: aktiv punkt vit, inaktiva vita ~55 % opacitet, en mjuk mörk skugga runt varje punkt (boxShadow, token i `theme/shadows.ts`, ingen hårdkodning). Samma storlekar och animation som idag.
- Lightboxen rörs inte (där ligger punkterna på mörk bakgrund).

## Del B: Zoom in/ut från heron fungerar fortfarande inte på enhet
Daniel testade på riktig telefon efter brief 20: "zoom in/ut från heron funkar fortfarande inte". Din slow-motion-verifiering i simulatorn visade rätt, så något skiljer enhet från simulator, eller en testväg ni inte provat. Hitta orsaken, gissa inte.

Utgå från att kort → detalj-zoomen fungerar (bekräftad på enhet). Lightbox-zoomen använder samma bibliotek men beter sig annorlunda. Undersök minst:
1. **Mätning:** när mäts källan (heron) och målet (lightboxens bild)? Är herons bild mätt korrekt när den ligger i en horisontell `Transition.ScrollView` (scrollOffset, bild 2+)? Mäts lightboxens mål medan skärmen redan animeras in (skala/opacitet) och blir då fel?
2. **Id-val på UI-tråden:** interpolatorn läser `lightboxIndex.value` som sätts på JS-tråden precis före `router.push`. Kan värdet inte ha hunnit synkas när första bildrutan beräknas? Säkra det (t.ex. skicka index som route-param OCH shared value, eller sätt värdet i god tid).
3. **Mål-rektangeln:** `Image.getSize` är asynkron. Vad används innan storleken är känd (helskärm?) och mäts målet då för tidigt? Måste vara känt innan zoomen startar (cacha storlekarna i förväg, t.ex. när detaljvyn monteras).
4. **Alla vägar:** produkt med EN bild, produkt med flera bilder på bild 1, på bild 2+, öppning och stängning (kryss, swipe ned, kantswipe), samt stängning efter att man bläddrat i lightboxen. Ser du fel i någon av dem, åtgärda.
5. Jämför rad för rad med hur kort → detalj är uppsatt (id, group, Trigger/View, vad som är mätt) och rätta avvikelser som saknar skäl.

Verifiera i simulatorn med tillfälligt långsam övergång (ta bort efter) för varje väg ovan. Du kan inte testa på enhet: lägg därför till ett tillfälligt skärmöverlägg i dev (`__DEV__`, märkt TEMP-DEBUG-ZOOM, bakom en toggle på `app/components.tsx`, samma mönster som TEMP-DEBUG-GEST) som visar vid öppning och stängning: valt id, uppmätt källa-rect, uppmätt mål-rect, om boundary hittades. Det ska inte vara committat om du är säker på orsaken; är du inte säker, committa det inte ändå men skriv i rapporten hur det slås på så att Daniel kan skicka en skärmdump.

## Definition klar
- Punkter utan bakgrund, läsbara på ljust och mörkt foto.
- Tryck på hero-bild N: bilden växer ur just den bilden till lightboxen. Stäng: bilden krymper tillbaka till heron, och heron visar den bild man lämnade.
- Rapporten säger vad som var orsaken och vad som INTE kunde verifieras utan enhet.

## Flagga, bygg inte
Andra problem du hittar: nämn i rapporten, åtgärda inte.
