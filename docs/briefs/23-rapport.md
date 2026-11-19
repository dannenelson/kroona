# Rapport brief 23: Mjuk stängning av lightboxen

**Orsak (uppmätt per bildruta i simulatorn, kryss via `router.back()`):**
- Stängningen var 200 ms (`inOut(quad)`), och opacitet = p och backdrop = 0,85 × p gick ut samtidigt och linjärt. Efter ca 100 ms var halva bilden och halva mörkret borta, och resten försvann på ca 6 bildrutor.
- Swipe kan inte köras i simulatorn, så den delen är läst ur bibliotekets källa (`pan-lifecycle`, `finalizePanRelease`): vid släpp fryses `gesture.handoff` på släppositionen. Bilden stannar alltså tvärt, och faden börjar från vila (timingen tar inte med fingrets fart). Det är troligen "hackar till".
- Inget hopp i själva bytet från live-drag till ögonblicksbild: handoff har samma värde vid släppet.

**Åtgärd (`lightboxScreenOptions`, tokens i `motion.lightboxFade`):**
- Stängning 320 ms med ease-out (`closeEasing`, easeOutQuad som bezier). Den börjar i rörelse och landar mjukt.
- Opacitet vid drag och stängning = 1 − (1 − p)^k: bilden k = 1,5, backdropen k = 2, så att mörkret lämnar långsammare än bilden. Öppningen är linjär och oförändrad. Kurvorna är 1 vid p = 1, så bytet hoppar inte.
- Efter släpp i swipe glider bilden vidare i dragriktningen, från släppunkten (`releaseDrift` 12 % av skärmen, progress vid släppet sparas i `lightboxReleaseProgress`).
- Minska rörelse: `reduceMotionShared` (synkad från systemet i `app/_layout`). Då är det bara opacitet, ingen skala eller glidning, och detaljvyns bakgrundsskala är också avstängd. Faden körs med `ReduceMotion.Never`, så den inte hoppar.

**Uppmätt efter åtgärd:** kryss-stängningen tar 20 bildrutor på ca 320 ms, i jämna steg till 0 (ingen sista rest som försvinner). Backdropen ligger hela tiden efter bilden. Öppningen är oförändrad (linjär, ca 240 ms, skala 0,96 → 1). tsc och iOS-export är gröna, och den tillfälliga loggningen är borttagen.

**Kräver enhet:** swipe ned släppt tidigt och sent (glidningen och att inget hoppar), kantswipe och Minska rörelse.

**Flaggas, inte åtgärdat:**
- Kryss-stängningen startar 2–3 bildrutor (ca 30–60 ms) efter trycket. Det ligger i biblioteket.
- Timingen tar inte med fingrets fart vid släpp. En fjäder gör det (`initialVelocity`), men kräver avvägning.
- `useReduceMotion` och `reduceMotionShared` är två källor för samma inställning. Kan slås ihop senare.
