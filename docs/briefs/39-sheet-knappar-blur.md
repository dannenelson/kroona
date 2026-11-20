# Brief 39 – Sheet: knappar på en rad + riktig kantblur upptill och nedtill

**Fas:** 0. **Mål (ett):** Rätta två saker i Sheet efter brief 38. Rör inget annat. Inventera först (Button, SheetContent, kantblur/EdgeFade från brief 04 som används på skärmarnas kanter och bakom tab bar).

## 1. Knapparna på EN rad
- "Klar" (primär) och "Skapa ny" (sekundär, med +) ligger alltid **bredvid varandra på en rad**, centrerade som grupp. De får aldrig staplas på två rader, på någon skärmbredd.
- Byt texten "Skapa ny samling" → **"Skapa ny"** i detta steg. (I tomt läge, där den är ensam primär: "Skapa ny samling" får vara kvar.)
- Minska knappens horisontella padding via token (t.ex. `buttonPaddingX`), inte via lokal siffra. Höjd ≥ 56 oförändrat, wrap-bredd, aldrig fullbredd. Gäller `Button` generellt; kontrollera att övriga knappar (Skapa samling, tomlägen) inte ser märkbart sämre ut, annars egen variant/storlek för sheet-fotern.
- Gap mellan knapparna via spacing-token.

## 2. Blur istället för genomskinlig toning
Listan ska gå **bakom** en riktig progressiv blur (samma kantblur-komponent som skärmarna och tab baren använder: gradvis blur med mask, ev. mjuk mörk toning), inte tonas ut mot genomskinlighet.
- **Nedtill:** blurzon bakom knapparna. Innehållet blir suddigt men synligt närmast knapparna, och skarpt längre upp. Ingen hård kant, ingen färgat band.
- **Upptill:** samma bakom headern och fasta element ovanför listan (produktchip + sökfältet i Lägg till i samling). Innehållet scrollar upp bakom dem och blurras.
- Gäller `SheetContent` generellt (Skapa samling får samma beteende där det är relevant), så att det inte blir en specialare för ett steg.
- Skrollmarginaler: första raden börjar under sökfältet, sista raden kan scrollas fri från knapparna.
- Mörkt/ljust, Minska rörelse (blur får vara kvar, ingen extra animation). Om kantblur-komponenten inte kan återanvändas rakt av: justera den delade komponenten, skriv en sak i rapporten.

## Verifiering
tsc, simulator med många samlingar (blur synlig upptill och nedtill), ljust tema. Lista vad som kräver telefon.
Rapport: `docs/briefs/39-rapport.md`. Committa, inkl. briefen, och pusha. Uppdatera designsystem.md (Sheet-footer, blur).
