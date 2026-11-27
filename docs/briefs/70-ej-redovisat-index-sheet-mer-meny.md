# 70 – "Ej redovisat", sheet för hållbarhetsindex, mer-meny vid knappen

Fas 0. Dummydata. Tre delar, bygg i den här ordningen och committa per del (tsc/Metro grönt mellan varje).

## Beslut bakom (Daniel, 2026-11-27, se docs/spec-forslag.md B1–B4)

- Företag som inte redovisar hållbarhet ska synas som "Ej redovisat", som incitament till transparens. Ändrar brief 69 ("dölj sektionen").
- Tryck på hållbarhetsindex (produkt och företag) öppnar en sheet som visar hur siffran räknats fram.
- Inga synliga CTA:er i gridar. Långt tryck (lyft bild, blur) behålls där.
- Mer-knapp (⋯) är en vanlig kontextmeny förankrad vid knappen, inte långtrycks-beteendet.

## Inventera först

1. Hur hållbarhetsindex visas idag (Produktdetalj, företagsprofil) och var i koden, så att samma komponent kan göras tryckbar.
2. Hur Dela visas på Produktdetalj idag.
3. `components/ProductContextMenu`, `hooks/useLongPressMenu`, `components/ListRow.tsx` (mer-knappen) och `app/(tabs)/saved.tsx`: vad finns för att placera en meny vid ett ankare? Finns bottom sheet-komponent att återanvända för del 2?
Rapportera kort innan du bygger om något avviker.

## Del 1: "Ej redovisat"

- Företagsprofilen visar alltid sektionen Hållbarhet. Saknas uppgifter: raden "Hållbarhetsindex: Ej redovisat" med en kort neutral rad ("Företaget har inte redovisat sin hållbarhet."). Ingen färgkodning, ingen värdering. Certifikat och initiativ döljs var för sig när de saknas.
- Samma sak för produkter som saknar index.
- Använd befintliga ikoner och komponentstil. Rita inga nya ikoner.

## Del 2: Sheet "Så räknar vi"

- Tryck på indexraden (produkt och företag, inte när "Ej redovisat") öppnar en bottom sheet, med samma sheet-mönster som appen redan har.
- Innehåll, dummy: rubrik "Så räknar vi", indexet (t.ex. 3,9 av 5), en lista med 3–4 delposter (t.ex. Material, Tillverkning, Transport, Företagets redovisning) med varsitt delbetyg och en rad förklaring, plus en rad längst ned: "Uppgifterna är exempeldata i demot."
- Dummyberäkningen ska stämma: indexet är medelvärdet av delposterna, avrundat till en decimal.
- Neutral ton, ingen färgkodning.

## Del 3: Mer-meny

- **Produktdetalj:** mer-knappen (more-horizontal) ersätter Dela-knappen. Menyn innehåller Dela (platshållare, som idag) och de val Produktdetalj redan har i kontextmenyn om något.
- **Mer-knappen i Sparat/Samlingar** (ListRow): ska öppna en kontextmeny förankrad vid knappen (utfällning intill knappen, utan lyft bild och utan blur-bakgrund), med samma val som idag (Byt namn, Redigera innehåll, Dela, Ta bort samling). **Långt tryck** på raden behåller dagens beteende.
- Bygg en återanvändbar förankrad meny (t.ex. `AnchoredMenu`), dokumentera i designsystem.md. Menyn ska hålla sig inom skärmen (flippa upp/ned, vänster/höger vid behov), stängas på tryck utanför, och fungera ljust/mörkt.
- Inga nya synliga knappar på produktkort i gridar.

## Gör inte

- Ingen riktig beräkning eller verifiering av index (Fas 0, dummy).
- Ingen visning av certifikat/initiativ per produkt (öppen fråga).
- Kommentarer, tumme upp/ner och bidragsräknare är Fas 1+ och byggs inte.
- Rör inte `company-add.svg`/`company-check.svg`.

## Uppdatera efteråt

docs/designsystem.md (AnchoredMenu, indexsheet), docs/wireframes.md och docs/ia-karta.md där Produktdetalj, Företagsprofil och Sparat berörs, docs/plan.md.

## Verifiering

tsc och Metro gröna. Skärmdumpar ljust och mörkt: företag med och utan hållbarhetsdata, indexsheeten, mer-menyn på Produktdetalj och i Sparat/Samlingar (nära skärmkant uppe och nere), samt långt tryck som fortfarande lyfter bilden.
