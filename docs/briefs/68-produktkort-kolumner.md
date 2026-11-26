# 68 – Produktkort: textblock i två kolumner + menyknapp i gridden

Fas 0. Uppföljning på brief 62 (rapport i docs/briefs/62-rapport.md). Rör bara produktkortets textblock och dess knapp i höger kolumn. Inga nya funktioner.

## Problem

Brief 62 gjorde avstånden tätare, men blocket känns löst: texter och knapp flyter utan gemensam linjering. Vi behöver ett fast rutnät, inte fler justeringar av enskilda avstånd.

## Beslut (Daniel)

I gridar (som Pinterest) ska Spara bara finnas i kontextmenyn, inte som egen knapp på kortet. Högerkolumnen får alltså en menyknapp (tre prickar), och Spara ligger i den meny som brief 61 byggde.

## Inventera först

1. Lista alla ställen där ett produktkort med textblock renderas (Hitta/resultat, Följer masonry, Följer en kolumn, dialogens produkthylla, kategori, område, samling, Hem-hyllor, sparade produkter).
2. Rapportera om de delar en komponent för textblocket eller har egen kod var och en.
3. Kolla vilken ikon som finns för kontextmeny/tre prickar (assets/svg/icons) och hur menyn från brief 61 öppnas idag. Återanvänd båda. Rita ingen ny ikon.

## Mål

Ett enda textblock överallt. Finns flera varianter, samla dem i en komponent (förslag: `ProductCardText`) med prop `action`: `'menu' | 'save' | 'none'`.

- `'menu'`: tre-pricksknapp som öppnar den befintliga kontextmenyn (Spara m.m.). Används på kort i gridar: Följer masonry, sökresultat, kategori, område, samling.
- `'save'`: bokmärket som idag. Behålls bara i Följer en-kolumnsvyn tills vidare (flaggas i rapporten, Daniel avgör).
- `'none'`: ingen knapp. Hyllor (Hem, dialog) som idag.

Samma typografi och avstånd oavsett `action`.

## Layout (två kolumner)

Textblocket ligger 8 px under bildens underkant.

- Rad med två kolumner, `flexDirection: 'row'`, `alignItems: 'flex-start'` (valign top).
- Vänster kolumn: `flex: 1`, `minWidth: 0`. Märke, namn, pris, betyg, vänsterjusterade mot bildens vänsterkant.
- Höger kolumn: knappen, fast bredd, `alignSelf: 'flex-start'`, ingen egen marginal uppåt. Högerkanten linjerar med bildens högerkant.
- Avstånd mellan kolumnerna: 8 px.
- Namnet går aldrig in under knappen. Det radbryter i vänsterkolumnen, max 2 rader, sedan ellipsis.
- Med `action: 'none'` tar vänsterkolumnen hela bredden.

## Vertikal linjering

- Knappens synliga överkant linjerar med överkanten på första textraden (märkesraden). Mät på skärmdump, justera med några px. Behövs större tryckyta: `hitSlop`, inte större ruta som skjuter ikonen nedåt.
- Radavstånd som i brief 62 (märke/namn/pris 2 px via `productCard.textGap`, betyg 4 px). Ändra inte tokenvärden, bara strukturen.
- Rader som saknas (t.ex. betyg) tar ingen plats och lämnar ingen lucka.
- Första textraden har samma höjd oavsett märkets längd.

## Gör inte

- Ändra inte typografi, färger, bildformat eller betygsvisning (62 gäller).
- Bygg inte om kontextmenyns innehåll (61 gäller), bara se till att Spara/Ta bort ur sparade finns där och att snackbaren från 61 fungerar.

## Verifiering

- tsc och Metro gröna.
- Skärmdump ljust och mörkt: Följer masonry (menyknapp), Följer en kolumn, sökresultat, kort med långt namn (2 rader + ellipsis), kort utan betyg, menyn öppen från kortet.
- Ingen text under knappen. Knappens överkant linjerar med textens överkant.

## Dokumentation

Uppdatera produktkortets textblock i docs/designsystem.md: två kolumner, valign top, en komponent, `action`-varianter, namnregel, "Spara i gridar ligger i kontextmenyn".

## Rapport

docs/briefs/68-rapport.md: vad som fanns, vilka ställen som slogs ihop, beslut du tog själv.
