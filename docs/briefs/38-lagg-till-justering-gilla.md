# Brief 38 – Justering: Lägg till i samling + Gilla

**Fas:** 0. **Mål (ett):** Fixa tre synpunkter från Daniel på brief 36. Rör inget annat. Inventera först (Sheet, SheetContent, lägg-till-steget, SaveButton, ProductCard, ProductContextMenu-poster, EdgeFade/kantblur).

## 1. CTA i "Lägg till i samling"
- Primär CTA: **"Klar"** (Button primary, wrap-bredd). Stänger lagret och visar snackbar enligt brief 36 (samma regler).
- **"Skapa ny samling"** blir sekundär Button (secondary, med +), placerad bredvid/ovanför Klar. Aldrig helbredd. Om de inte ryms på en rad: stapla centrerat, Klar överst.
- Cirklarna togglar fortsatt flera samlingar (oförändrat).
- Sheetens X stänger som förut (utan att något ångras, ändringar gäller direkt).
- Tomt läge (inga samlingar): "Skapa ny samling" blir primär, ingen Klar.

## 2. Sticky CTA med blur
Listan scrollar BAKOM CTA-ytan och blurras/tonas ut mot botten (återanvänd kantblur/EdgeFade-principen från övriga skärmar, mjuk toning, ingen hård kant). Sista listraden ska kunna scrolla fri från CTA:n (bottenpadding = CTA-höjd). Gäller `SheetContent` generellt så att Skapa samling får samma beteende. Mörkt/ljust, Minska rörelse.

## 3. Gilla (hjärta) i stället för Spara
- Beslut Daniel: hjärta överallt för snabbspar. Produktmenyn (långt tryck): "Spara"/"Sparad" → **"Gilla"/"Gillad"** med hjärtikon (tom/fylld).
- Samma byte för SaveButton på produktvyn och ProductCard om de visar Spara/bokmärke: hjärta, texten Gilla/Gillad. Snackbar: "<produkt> gillades · Visa" (Visa → Gillade produkter). Ingen snackbar vid borttagning.
- "Spara i samling" behåller bokmärke-plus och sin text.
- Uppdatera design.md §0 (spara-ikon: hjärta = Gilla, bokmärke-plus = Spara i samling) och produkt.md/wireframes där "Spara" avses.

## Utanför scope (noterat av Daniel, tas i UX-genomgången)
Följ på en samling skapad av en användare kopplas idag till användaren, inte samlingen. Rör inte nu.

Rapport: `docs/briefs/38-rapport.md`. Committa efter verifiering, inkl. briefen, och pusha.
