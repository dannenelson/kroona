# Rapport brief 24: Lightboxens stängning som Apple Foto

**Byggt:**
- **Swipe ned/upp** är nu lightboxens egen gest, som en gren i den befintliga pan-gesten i `app/lightbox/[id].tsx`. Ingen ny gest lades till.
  - Bara den aktiva bilden följer fingret (X/Y) och krymper svagt (1 → `minScale` 0,85).
  - Bakgrunden tonas med avståndet och är borta vid 40 % av höjden. Det gäller både lightboxens egen bakgrund och bibliotekets backdrop (via `lightboxBackdrop`).
  - Kryss, punkter och grannbilder tonas bort vid dragstart.
- **Släpp:**
  - Över tröskeln (12 % av höjden eller 800 px/s): bilden fortsätter med släppfarten (minst 800 px/s) i 220 ms och tonar bort. Därefter körs `router.back()`, och lightboxen är då redan osynlig.
  - Under tröskeln: bilden fjädrar tillbaka med `motion.spring`.
- **Kryss och kantswipe** använder samma fade som förut. Biblioteket har bara kantgesten kvar (`gestureDirection: { gesture: 'horizontal', area }`).
- **Interpolatorn** innehåller bara fade och skala från progress. Handoff, glidning, `lightboxReleaseProgress` och `releaseDrift` är borttagna.
- **Inzoomad bild:** pan som förut, ingen stängning. Nyp, dubbeltryck och bläddring är oförändrade.
- **Tokens:** `motion.lightboxDismiss`.
- **Minska rörelse:** bara opacitet, ingen nedskalning och ingen utfart. Bilden följer fortfarande fingret, eftersom det är direkt manipulation.

**Kodmängd: ingen nettominskning** (+147/−96 rader i 5 filer). Bibliotekets vertikala stängning kostade ingen kod hos oss. Den egna gesten med följning, tröskel, utfart, toning av grannbilder och chrome är ny kod. Borttaget är interpolatorns drag-, handoff- och glidlogik samt vertikal-fail-grenen.

**`lightboxGestureLock` är kvar.** Utan den kan bibliotekets kantswipe ta över när man panorerar en inzoomad bild från vänsterkanten eller nyper.

**Verifierat:**
- tsc och iOS-export.
- Simulatorn: öppning visar bild, kryss och punkter, och krysset stänger utan fel.
- Den tillfälliga koden är borttagen.

**Kräver enhet:** hela swipe-stängningen (följning, nedskalning, toning, tröskel, utfart, fjäder tillbaka), kantswipe och Minska rörelse. Simulatorn kan inte dra.

**Flaggas, inte åtgärdat:**
- Ett andra finger mitt i en swipe-stängning avbryter pan-gesten. Bilden kan då bli kvar förskjuten tills nästa gest. Det är inte provat.
- Efter utfarten animerar detaljvyns bakgrundsskala 1,05 → 1 under stängningen (ca 320 ms). Det är synligt men mjukt.
- Reanimated varnar för att `useAnimatedReaction` får beroenden i `HeroPager` (brief 21). Varningen är ofarlig på native.
