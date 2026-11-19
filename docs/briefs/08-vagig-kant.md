# Brief 08 — Vågig toppkant (test på enhet)

**Mål:** Låt Daniel jämföra rak och vågig toppkant på enhet och sedan välja. Bara `EdgeFade` och dev-routen. Inga skärmar.

**Läs först:** `CLAUDE.md`, `components/EdgeFade.tsx`, `theme/` (edgeBlur, edgeFadeStops), `app/components.tsx`. Visuell referens: Claude Design "Kroona Looken A" (v11) https://claude.ai/artifact/5XbvB5EogW8efQhHAzkxDH. Där är toppkanten en mjuk, vågig form i stället för en rak linje, mycket mjuk och något högre upp. Presentera en plan i Plan Mode först.

## Gör
1. Ny prop på `EdgeFade`: `shape: 'straight' | 'wave'` (default `'straight'`, så inget annat ändras). Bara `position="top"`.
2. **Vågig form:** hela EdgeFade-lagret (de tre blur-lagren och toningen) maskas med en organisk, mjuk form: nedre kanten följer en lugn kurva (ungefär som ett långsamt vågmönster över hela bredden, en eller två mjuka vågor, amplitud ca 8–14 px) och är mycket mjukt utsuddad, så det inte syns någon linje. Referensen i designen: SVG-form (path) med stark gaussisk utsuddning, ca 15 px, som alfa-mask.
3. Implementera med befintliga paket: `MaskedView` + `react-native-svg` (en path, och en mjuk kant via lager med fallande opacitet eller en blur-filter om `react-native-svg` 15.16 klarar den i Expo Go), eller annat som fungerar med det vi har. Väg enkelhet och prestanda, och rapportera vad du valde och varför. Lägg ingen ny dependency utan att fråga.
4. Formen ska vara statisk, ingen animation (den kan komma senare som delight). Kurvparametrar (amplitud, antal vågor, mjukhet) som tokens i `theme/`.
5. **Dev-routen:** i sektionen med EdgeFade över foto: en Pill-växel **Rak / Vågig** (utöver befintliga Blur på/av), så Daniel kan jämföra på enhet i samma ruta. Standard Rak.
6. Verifiera: `npx tsc --noEmit`, iOS-export, grep att inga hex/fontstorlekar/spacing-siffror ligger utanför `theme/`. Commit (ingen push).

## Gör INTE
- Använda vågig kant i tab-baren eller på skärmar (bara dev-route tills Daniel valt).
- Ändra blur-styrka, toning eller botten-EdgeFade. Inga nya paket utan att fråga.

## Klart när
- Dev-routen kan växla Rak/Vågig, och vågig syns som en mjuk organisk kant utan hård linje.
- Rak är oförändrad.
- tsc och export utan fel, commit finns.

## Rapportera kort
Vilken teknik du valde och varför, prestanda jämfört med rak (kan bara bedömas på enhet, säg vad Daniel ska titta efter), egna beslut och avvikelser.
