# Brief 36 – Lägg till i samling (Sheet) + snabbspar

**Fas:** 0 (dummy, lokal lagring). **Mål (ett):** Man kan spara en produkt från produktvy och kontextmeny, antingen snabbt (hjärta → Gillade produkter) eller i en samling via Sheet. Skiss: "Kroona Sparat – ny struktur", brädena 4–6. Inventera först (SaveButton, ProductCard, ProductContextMenu, Sheet, Snackbar, UserCollectionsContext, SavedProductsContext). Återanvänd, inga nya paket.

## 1. Hjärtat = snabbspar
- Hjärtat (SaveButton på produktvy och ProductCard) togglar Gillade produkter, som idag. Oförändrat beteende.
- Snackbar vid spar: "<produkt> sparades i Gillade produkter" + åtgärd "Visa" (→ Gillade produkter). Vid borttagning ingen snackbar.

## 2. "Spara i samling" – ingång
- Produktvy: egen sekundär knapp/ikon bredvid hjärtat (bokmärke-plus). Beslut Claude: bredvid hjärtat, inte långt tryck på hjärtat, eftersom långt tryck är svårt att upptäcka.
- Kontextmenyn (långt tryck på produkt): nytt menyval "Spara i samling". Befintliga val (Dela, Följ varumärke, Visa liknande) rörs inte.
- Båda öppnar samma Sheet.

## 3. Sheet "Lägg till i samling"
- Använd befintligt Sheet (blur + sheetScrim, X till höger, titel centrerad). Titel "Lägg till i samling".
- Överst: produktchip (thumb 40, namn, varumärke), sedan sökfält "Sök samlingar" (filtrerar egna samlingar på namn).
- Lista: egna samlingar som rader (mosaik 48/r12, namn, "N produkter"; "· redan tillagd" om produkten finns). Cirkel till höger: tom ring (ej tillagd) / fylld med bock (tillagd). Tryck togglar direkt: lägger till eller tar bort produkten, uppdaterar bock och räknare, sheeten stängs INTE.
- Nederst, centrerad, wrap-bredd: Button "Skapa ny samling" (med +). Öppnar befintligt Skapa samling som nästa steg. Efter Spara: den nya samlingen skapas OCH produkten läggs i den, sheeten stängs.
- `swipeToClose: false` för detta steg (listan skrollar). Stäng via X eller tryck utanför ingår inte; X räcker.
- Tomt läge (inga samlingar): ingen lista, bara texten "Du har inga samlingar än." och CTA "Skapa ny samling".
- Stängs sheeten efter att minst en tillägg gjorts visas snackbar: "<produkt> sparades i <samling>" + "Visa" (→ Samlingsdetalj). Har produkten lagts i flera: "<produkt> sparades i N samlingar" (Visa → Sparat). Bara borttagningar: ingen snackbar.

## 4. Allmänt
Tokens, mörkt/ljust, Minska rörelse, inga helbreddsknappar, tryckfeedback som övriga rader. Dokument: wireframes (ny skärm/steg), designsystem (Sheet-steg med lista), produkt.md (hjärta = snabbspar, samling = valfri), plan.md.

## 5. Utanför scope (flagga)
Redigera/döp om/radera samling, ta bort produkt via samlingsvyn, delning, Dela/Följ varumärke/Visa liknande i produktmenyn.

Rapport: `docs/briefs/36-rapport.md` (inkl. lista att spegla till Claude Project). Committa efter verifiering (tsc, Metro), inkl. briefen, och pusha.
