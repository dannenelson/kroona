# Rapport brief 39: Sheet-knappar på en rad och riktig kantblur

**Byggt:**
1. **Knappar på en rad:** "+ Skapa ny" (sekundär) och "Klar" (primär) ligger alltid bredvid varandra, centrerade som grupp med `spacing.sm` emellan (`flexDirection: 'row'`, ingen wrap). Texten är "Skapa ny" i steget. I tomt läge är den ensam primär med "Skapa ny samling". Knapparnas sidpadding sänktes via token, `control.ctaPaddingX` 44 → 28 (skissens värde), för `Button` generellt. Höjden är ≥ 56 som förut. Skapa samlings "Spara" och tomlägenas knappar blev smalare men ser rimliga ut i simulatorn, så ingen egen variant behövdes.
2. **Blur i stället för genomskinlig toning:** alfamasken från brief 38 är borttagen, eftersom den gjorde innehållet osynligt i stället för suddigt.
   - Sheet-headern ligger nu ovanpå stegets innehåll, och innehållet fyller lagret.
   - `SheetContent` har fått `header` (fasta element, t.ex. produktchip + sök), `footer` och `edgeToEdge` (skrollande lista).
   - Innehållet skrollar bakom header, fasta element och CTA och blurras progressivt där med den delade kantblurren `EdgeFade`, variant `clear` från brief 38 (samma maskade blurlager som skärmarnas kanter och flikfältet, utan färgtoning). EdgeFade behövde inte ändras mer.
   - Listan hämtar marginalerna med `useSheetInsets()` (ersätter `useSheetFooterInset`): första raden börjar under sökfältet, och sista raden kan skrollas fri från knapparna.
   - Skapa samling får samma struktur automatiskt.

**Verifierat i simulatorn** (nio testsamlingar, tillfällig testkod borttagen):
- Mörkt och ljust tema: knapparna ligger på en rad, och raderna närmast knapparna blir gradvis suddiga utan färgband (tydligast i ljust).
- Listan börjar under sök, skrollar upp bakom sökfältet och kan skrollas till slutet, där sista raden ligger ovanför knapparna.
- Skapa samling oförändrat.
- tsc och iOS-export är gröna.

**Kräver telefon:**
- Hur blurzonen upptill (bakom titel och produktchip) upplevs. Den var svår att bedöma med de neutrala dummyraderna i simulatorn.
- Blurens känsla i rörelse och tangentbordet med sök.

**Övrigt:** min test ändrade tillfälligt simulatorns utseendeläge, och det är återställt till ljust. Appen tvingar mörkt tema (`userInterfaceStyle: dark`), så ljust testades via temaväxeln.
