# 71 – Fler val i mer-menyn, produkter utan index, plus/minus-märke i snackbar

Fas 0. Tre små delar, committa per del (tsc/Metro grönt mellan varje). Bygger på brief 70.

## Beslut bakom (Daniel, 2026-11-27)

- Mer-menyn på Produktdetalj får samma val som kontextmenyn vid långt tryck på ett produktkort, utom Spara (som har egen knapp). Spara i samling får ligga där.
- Några testprodukter ska sakna hållbarhetsindex, så att "Ej redovisat" syns på produkter.
- Det är svårt att se när en produkt läggs till i eller tas bort från Sparade produkter och samlingar. Ett litet märke med plus eller minus ska göra det tydligt.

## Inventera först

1. Kontextmenyns val på produktkort idag (Spara, Spara i samling, Följ varumärke, Dela, Visa liknande) och var de definieras, så att Produktdetaljs mer-meny återanvänder dem.
2. Alla ställen som läser `sustainabilityScore` (kort, Produktdetalj, sortering, Liknande, filter, dialogens produktkort, `toCardProduct`).
3. Snackbarens miniatyr (`thumbUri`, 40, `radius.tile`) och var snackbaren visas för tillägg/borttagning av produkt (Spara, Spara i …, Redigera innehåll).
Rapportera kort om något avviker.

## Del 1: Mer-menyn på Produktdetalj

Mer-knappen (⋯, `AnchoredMenu` från brief 70) får: Spara i samling, Följ/Sluta följa varumärket (bara när märket har en profil), Dela (platshållare), Visa liknande (scrollar till eller öppnar Liknande, som kontextmenyn gör idag). Inget Spara-val (bokmärket på namnraden finns). Samma ikoner och ordning som i kontextmenyn, minus Spara. Följ-ikonen följer läget (company-add / company-check).

## Del 2: Produkter utan hållbarhetsindex

- Gör `sustainabilityScore` valfri i typen och i `toCardProduct`. Alla ställen som läser den måste tåla `undefined`: kort visar inget löv, Produktdetalj visar "Hållbarhetsindex: Ej redovisat" (neutral rad, samma som på företag, ingen sheet "Så räknar vi" utan index), sortering och filter lägger produkter utan index sist.
- Ta bort indexet från 3 dummyprodukter (välj tre olika, varav minst en med betyg och en utan, och en i vardera kategori om möjligt). Märk ändringen `// TESTDATA`.
- Rör inte företagens index.

## Del 3: Plus/minus-märke på snackbarens miniatyr

Tolkning (säg till om den är fel, annars bygg så): snackbarens produktminiatyr (40 × 40) får ett litet runt märke i ena hörnet, överst till höger, med `plus` när något lades till och `minus` när något togs bort. Gäller alla snackbars som handlar om en produkt i en samling: "lades till i sparade produkter", "togs bort från sparade produkter", "lades till i <samling>", "togs bort från <samling>" (inklusive Redigera innehåll).
- Märket: cirkel ca 16–18, yta `textPrimary` med ikon i `bg` (inverterad, som vald pill), ikon 12 med den synliga linjen enligt `Icon`, ligger halvt utanför miniatyrens hörn, utan egen kant om det syns tydligt, annars 1,5 px kant i snackbarens yta.
- Ikoner: `plus` och `minus` finns i assets/svg/icons. Rör inte filerna (kör `node scripts/generate-icon-registry.js` om `minus` inte finns i registret).
- Märket får en kort pop när snackbaren visas (`popScale`, ingen rörelse vid Minska rörelse).
- Snackbar utan produktminiatyr (t.ex. "<samling> skapades") får inget märke.
- Lägg till en prop på Snackbar för märket (t.ex. `badge: 'add' | 'remove'`), inga nya färger. Dokumentera i designsystem.md.

## Gör inte

- Inga nya synliga knappar i gridar, inga märken på produktkort.
- Inga kommentarer eller betyg (Fas 1+).

## Uppdatera efteråt

designsystem.md (Snackbar-märket, mer-menyn), wireframes.md (§1 och §8b), plan.md.

## Verifiering

tsc och Metro gröna. Skärmdumpar ljust och mörkt: mer-menyn på Produktdetalj, en produkt utan index (kort och detalj), snackbaren med plus och med minus (långt namn, kort namn).
