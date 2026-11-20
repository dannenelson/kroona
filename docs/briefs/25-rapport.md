# Rapport brief 25: Lightboxens bild fastnar mellan två lägen

**Verifierad orsak (koden och RNGH v3:s källa, `v3/hooks/callbacks/eventHandler.ts`):**
- Diagnosen stämmer delvis. `onDeactivate` körs även när en aktiv gest avbryts (FAILED/CANCELLED, `canceled: true`), och `onFinalize` körs alltid. Själva avbrottet hoppade alltså inte över snäppningen.
- Felet var att grenen valdes efter `zoomed.value` **vid gestens slut**. Nyp och pan körs samtidigt. Landar ett andra finger mitt i ett svep hinner nypet skala bilden över 1x innan pan-gesten avbryts. Då tog `onDeactivate` zoom-grenen och returnerade tidigt:
  - `pageX` snäpptes aldrig, så bilden stod mellan två sidor.
  - Vid swipe-stängning blev `dragX`/`dragY`, dold chrome och `dismissing` kvar.
- Dessutom räknade ett nytt drag mitt i en sidfjäder från målsidan (`-index × width + translation`), inte från bildens faktiska läge. Det gav ett hopp.

**Åtgärd** (`app/lightbox/[id].tsx`, bara pan-gesten):
- Läget (`PAGE`, `DISMISS`, `ZOOM_PAN`) låses vid aktivering. `dismissing` är ersatt av `mode`.
- `onDeactivate` sparar bara släppvärden. I v3 får `onFinalize` inte translation och fart.
- `onFinalize` tar alla beslut och körs alltid. Utfart om stängning passerade tröskeln (och inte avbröts). Annars landar allt exakt:
  - drag till 0 och chrome synlig;
  - inzoomad bild hålls inom ramen;
  - pagern går till en hel sida beräknad från faktisk position (`round`, eller nästa/föregående vid flick), alltid inom första och sista sidan.
- `onTouchesDown` avbryter pågående fjädrar (`cancelAnimation`), och ett nytt drag fortsätter från bildens faktiska läge.

**Verifierat:**
- tsc och iOS-export.
- Röktest i simulatorn: lightboxen öppnas centrerad och stängs.
- Snäppregeln räknad för tio fall: vila och flick åt båda håll, avbrott mitt emellan, avbrott vid 40 %, fångad fjäder samt första och sista sidan. Alla landar på en hel sida.
- Den tillfälliga koden är borttagen.

**Inte verifierat (simulatorn kan inte svepa eller nypa):** de scenarier briefen listar, alltså andra finger mitt i svep, nyp mitt i svep, kantswipe mitt i, snabba upprepade svep och kanterna. De kräver enhet.

**Kod:** +53/−34 rader. Logiken är samlad i `onFinalize`, men lägeskonstanter och sparade släppvärden tillkom. Det blev ingen nettominskning.

**Flaggas, inte åtgärdat:** ett tryck (eller ett dubbeltryck) mitt i en sidfjäder fångar fjädern och startar en ny från vila, vilket ger en liten fartändring.
