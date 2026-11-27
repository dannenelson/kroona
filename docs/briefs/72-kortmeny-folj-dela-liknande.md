# 72 – Kortets kontextmeny: Följ <märke>, Dela, Visa liknande

Fas 0. Liten brief. Committa per del, tsc/Metro grönt.

## Bakgrund

Kontextmenyn vid långt tryck på produktkort har fem val: Spara, Spara i samling, Följ varumärke, Dela, Visa liknande. Enligt rapport 71 gör bara de två första något; de tre andra stänger menyn. Daniel säger att Följ/Sluta följa varumärke fungerar. Verifiera först vad som faktiskt händer.

## Inventera först

1. Vad Följ, Dela och Visa liknande gör idag i kortmenyn (koden för menyvalen, och var menyn byggs: `ProductContextMenu`, `ProductCard`).
2. Hur Följ/Sluta följa varumärke görs på Produktdetaljs mer-meny (brief 71) och på företagsprofilen, så att samma logik och följ-lagring används.
Rapportera kort om beskrivningen ovan inte stämmer.

## Del 1: Följ med märkets namn

- Menyvalet heter **"Följ <märkesnamn>"** / **"Sluta följa <märkesnamn>"**, till exempel "Följ Filippa K". Inte "Följ varumärke". Långa namn kortas med ellipsis så att raden håller menyns bredd.
- Visas bara när märket har en profil (som i mer-menyn på Produktdetalj). Ikonen följer läget (company-add / company-check). Verifiera att valet fungerar och växlar rätt i kortmenyn; bygg det om det inte gör det.
- Samma namnändring i mer-menyn på Produktdetalj.
- Snackbar efter val, som övriga följ-bekräftelser, med namnet i fetstil om en sådan finns idag.

## Del 2: Dela

Platshållare, samma som övriga Dela-val: snackbaren "Delning kommer senare". Ingen riktig delning (Fas 1+).

## Del 3: Visa liknande

Tryck öppnar Produktdetalj för produkten, scrollad så att raden Liknande hamnar under toppbaren (samma beteende som Visa liknande i mer-menyn, brief 71). Visa valet bara om produkten har en Liknande-rad. Om det blir enklare att bygga som en param (t.ex. `scrollTo=similar`) på produktrouten, gör så; rapportera vad du valde.

## Gör inte

- Rör inte Spara och Spara i samling.
- Inga nya synliga knappar på korten.
- Ingen riktig delning.

## Uppdatera efteråt

design.md (kontextmenyn, §0 och §3), designsystem.md (menyvalen), plan.md.

## Verifiering

tsc och Metro gröna. Skärmdumpar ljust och mörkt: kortmenyn med "Följ Filippa K" och med ett långt märkesnamn, samma märke efter följ ("Sluta följa …"), samt en produkt utan Liknande-rad.
