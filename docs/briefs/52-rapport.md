# Rapport brief 52 – Mixar med en bild, Populära samlingar med text under, menyikon 28

## Inventering
- **`MixRow`** bygger mixar (rankning och reservdata), och varje mix har upp till 4 bilder. `MixCard` ritade `EditorialCard` `portraitSmall` i storleken `mix` (160 × 160) med en 2 × 2-`CollectionMosaic` som omslag och centrerad text.
- **`PopularCollectionsRow`** ritade kollaget (en bred bild över två små, 200 × 267) med kuratorchip via `EditorialCard`, med toning och centrerad text på bilden.
- **`CollectionCard`** (gamla kortet med text under) används inte på Hem. Bara CardShowcase använder det, och det är inte rört.
- **`tabBar.iconSize`** var 32.

## Gjort
1. **Mixar: en bild.** `MixCard` visar `images[0]` (mixens första produkt) i stället för mosaiken, med titel och undertitel **vänsterställda** på bilden och samma toning som små kort.
   - `EditorialCard` fick propen `align` (`'center' | 'start'`), som annars följer varianten.
   - MixRows data och rankning är orörda.
2. **Populära samlingar: text under.** `CollageCard` är byggd direkt i stället för via EditorialCard:
   - Bildyta **200 × 250** (4:5, `editorialCard.collage`), radie 20 (`radius.editorialMedium`) och 1 px inre kant (`imageEdge`).
   - Ingen toning. Kuratorchipet ligger kvar på bilden uppe till vänster.
   - Titel (ny token `typography.cardTitle` 14/18, vikt 500, max 2 rader) och "N produkter" (`caption` 12, `textSecondary`) ligger under bilden, vänsterställda, med `spacing.sm` emellan.
   - Tryckrespons med `useCardPress` som förut. Zoomen till Samlingsdetalj går från bildytan (`Transition.Boundary`, samma grupp och id-mönster).
3. **Menyikon 28:** `tabBar.iconSize` 32 → **28**. Etiketten ligger kvar på 36 från kanten (24 utan safe area), och radens underkant räknas om till 34,5 (22,5).
- **Regeln i docs** (`design.md` §8j och `designsystem.md` §16): text ligger på bilden bara när bilden är ett enda foto; flerbildskort har texten under. Mixkort, kollagekort och menyikonens storlek är också uppdaterade (`design.md` §8k och `designsystem.md` §17).

## Verifiering
- `tsc --noEmit` är grönt, och iOS-exporten (Metro-check) är grön.
- **Simulator iPhone 17, mörkt och ljust läge:**
  - "Skapat för dig" visar en bild per mix med vänsterställd text på toningen.
  - "Populära samlingar" visar kollaget 4:5 med chip och titel och antal under.
  - Menyikonerna är något mindre än förut, och etiketterna står kvar.
- **Testkoden** (scroll och ljust läge) är borttagen. Min Metro är stängd, och Daniels server på 8081 är orörd.
- **Zoomövergången** från kollaget är inte separat filmad. Den går genom samma `Transition.Boundary`/`b`-param som förut, nu runt bildytan i stället för hela kortet.

## Flaggor
- **Två mixar har samma omslag:** "Filippa K" och "Skandinavisk stil" börjar båda med ponchon (produkt 1). Det följer av mixdatan och rankningen, som inte fick röras. En regel om unika omslag eller fler produkter i mixarna är en egen ändring.
- **Produktkortens text är faktiskt 15/400** (`body`), inte 14/500 som briefen beskriver. Kollagets titel följer briefens 14/500 via den nya token `cardTitle`. Ska de vara identiska behöver ett av dem ändras.
- **Utanför scope (inte byggt):**
  - övriga kort, som Områden och "Samlingar för dig" med text på bild (de är enkelbildskort och följer regeln)
  - mer innehåll i mixarna
  - omritade ikoner
