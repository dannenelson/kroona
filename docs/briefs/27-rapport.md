# Rapport brief 27: Mörkare lightbox, inget rör sig bakom

- `motion.lightboxBackdropOpacity` är 0,94, en enda token. I simulatorn anas detaljvyn bara.
- Heron följer inte längre bläddringen. Ny shared value `lightboxHeroIndex`, som heron reagerar på i stället för `lightboxIndex`. Den sätts till lightboxens bild när stängningen börjar:
  - Kryss och kantswipe: i lightboxens interpolator, så fort progress sjunker under 1 vid stängning. En rad, som täcker båda vägarna.
  - Swipe-stängning: vid beslutet om utfart.
- I simulatorn: bläddring till bild 3 i lightboxen lämnade heron på bild 1 medan lightboxen var öppen, och efter stängning visade heron bild 3. tsc och iOS-export är gröna, och ingen debug-rest finns kvar.
- **Avvägning, kantswipe:** heron byter redan när draget börjar, eftersom drag och stängning inte går att skilja i progress. Avbryts kantswipen har heron ändå bytt till den bild som visas. Bakgrunden är då nästan täckande, och heron står på rätt bild.
- Kod: +26/−16 rader (ingen nettominskning; den nya shared value-variabeln och synkroniseringen vid stängning tillkommer). Herons `useAnimatedReaction` har inte längre beroende-arrayen, så Reanimated-varningen från brief 24 är borta. `goToPage` är förenklad.
