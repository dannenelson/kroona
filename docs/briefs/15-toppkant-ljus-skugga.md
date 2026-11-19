# Brief 15 — Ljus toppkant i ljust tema, lägre blur, skugga på glasknappar

**Mål:** Tre små justeringar efter enhetstest av brief 14. Ingen Plan Mode, bygg direkt.

## Gör
1. **Toningen i toppen följer temat hela vägen på Produktdetalj.** Ljust tema: alltid ljus toning (ingen mörk foto-toning i hero-läget). Mörkt tema: temats mörka toning. Ta bort foto-toningen och korstoningen (`fadeProgress`) om den inte längre behövs, så blir det en enkel toning. Statusfältets stil följer temat hela vägen (ingen växling vid scroll). Kontrollera att statusfältet är läsbart över ett mörkt foto i ljust tema; rapportera om det inte är det.
2. **Lägre blur i toppen.** Blurzonen över hero ska inte gå längre ner än tidigare (ca 68 px, safe area + `edgeBlur.topExtra`). Toningen får vara längre om det behövs för att täcka titelraden nedscrollat, men blurn ska ligga kvar kort. Rapportera vilka höjder som blev.
3. **Subtil skugga på glasknappar** (`IconButton` på glas, och `TopBar`-knapparna) så att klickytan syns mot ljus bakgrund. Gäller båda teman men ska vara knappt märkbar i mörkt. Lägg skuggan som token i `theme/shadows.ts` (ingen hårdkodad), använd `boxShadow`-sträng eller motsvarande som redan används i projektet. Ändra inte glasets fyllning eller kant. Skuggan får inte klippas av `Glass`-komponentens `overflow: 'hidden'` (lägg den på ett yttre lager om det behövs).

## Gör INTE
Zoom, lightbox, andra skärmar än att skuggan följer med knapparna där de används.

## Avsluta
`npx tsc --noEmit`, iOS-export, grep att inga hex/siffror ligger utanför `theme/`. Uppdatera `docs/design.md` (toppkant och skugga). Commit, ingen push.

**Rapport: max 8 rader.** Vad som ändrats, höjderna, och vad Daniel ska titta på.
