# Brief 41 – Snabbspar (tryck) + kort (långt tryck), bokmärke, "Ny samling" som länk

**Fas:** 0. **Mål (ett):** Tre justeringar av "Spara i"-kortet från brief 40, efter Daniels beslut. Rör inget annat. Inventera först (SaveButton, ProductCard, ProductContextMenu, Sheet card-presentation, lägg-till-steget, Snackbar, ikonerna Heart/Bookmark, Sparat-raden Gillade produkter).

## 1. Snabbspar med tryck, kortet med långt tryck
- **Tryck** på Spara-knappen (produktvy och ProductCard) = snabbspar: togglar produkten i **Gillade produkter** direkt (det finns som idag, oförändrat lagringsbeteende).
- **Långt tryck** på Spara-knappen öppnar "Spara i"-kortet. Haptik vid långt tryck om det redan används i appen. Samma gest på båda ställena (hook, ingen specialare).
- Snackbar vid snabbspar: "<produkt> sparades i Gillade produkter" med åtgärden **"Ändra"** som öppnar "Spara i"-kortet (så att långt tryck är upptäckbart, Instagram-mönstret). Beslut Claude: "Ändra" ersätter "Visa" här. Efter att kortet stängts gäller brief 40:s snackbar (med "Visa"). Vid borttagning (avgillning): ingen snackbar.
- Långt tryck-menyn på produktkortet: **"Spara"** (= snabbspar, togglar, "Sparad" när den ligger i Gillade) och **"Spara i samling"** (öppnar kortet). Övriga val orörda.

## 2. Bokmärke i stället för hjärta
- Spara-ikonen är **bokmärke** överallt (produktvy, ProductCard, menyval). Fylld när produkten ligger i Gillade produkter ELLER i någon samling.
- "Gillade produkter" är bara namnet på den generella samlingen som inte kan raderas eller döpas om. Den får bokmärkesikon (inte hjärta) i raden i "Spara i"-kortet och i Sparat (rader och kort). Namnet behålls.
- Uppdatera ikonanvändning och design.md §0 (spara = bokmärke; mapp-med-plus planeras senare, byggs inte nu).

## 3. "Ny samling" som länk, inte CTA
- Ta bort den sticky "+ Skapa ny"-knappen i kortet. I stället: en **högerställd textlänk "Ny samling"** på rubrikraden, mittemot rubriken "Spara i …" (Instagram-mönstret). Neutral färg (text), vikt 500/600, tryckyta ≥ 44, tryckfeedback som övriga textlänkar. Ingen accentfärg.
- Öppnar Skapa samling i samma kort som idag (oförändrat flöde).
- Behåll blur upptill och nedtill i kortet (nu utan knapp nedtill: listan får bottenpadding för safe area och sista raden kan scrollas fri). Allt övrigt i brief 40 (2/3 ↔ full ↔ stäng, rader, Gillade överst) orört.
- Tomt läge: bara raden Gillade produkter, länken "Ny samling" finns kvar.

## Dokument
designsystem.md, design.md §0, produkt.md, wireframes.md (Spara-flödet: tryck = snabbspar, långt tryck = kort, Ny samling-länk).

## Utanför scope (flagga)
Mapp-med-plus-ikon, Skapa samling från "+" i Sparat som kort, redigera/radera samling.

## Verifiering
tsc, iOS-export, simulator (tryck på Spara, snackbar med Ändra → kortet, menyvalen, länken, tomt läge, mörkt/ljust). Långt tryck/gester kräver telefon; lista dem. Rapport: `docs/briefs/41-rapport.md`. Committa efter verifiering, inkl. briefen, och pusha.
