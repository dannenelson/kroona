# Brief 17 — Spik: egen stängningsgest på Produktdetalj (Reanimated)

**Mål:** Produktdetalj ska gå att stänga så här, konsekvent och med kontroll (Daniels krav, bedömda på enhet):
1. Är man överst i innehållet och drar nedåt (var som helst på skärmen) följer **hela skärmen fingret**. Den krymper lätt och får rundade hörn.
2. Man kan **avbryta** genom att dra upp igen eller släppa kort. Den fjädrar tillbaka. Släpper man förbi en tröskel (avstånd eller fart) stängs den.
3. **Kantswipe från vänster fungerar överallt**, oavsett scrollposition och var på skärmen.
4. Ingen hård studs eller blinkning. Rörelsen ska vara mjuk, lugn och vara lätt att lära sig.
5. Vertikal scroll i innehållet fungerar som vanligt när man inte är överst.

Det här är en **spik** (egen "spik: ..."-commit, går att backa). Bara Produktdetalj.

**Bakgrund:** Den inbyggda zoom-stängningen (brief 16, `Link.AppleZoom`) är oförutsägbar mot scrollvyn (studsen tävlar med gesten). Begränsar vi den med `unstable_dismissalBoundsRect` stängs även kantswipe av utanför gränsen, vilket Daniel inte accepterar. Öppningszoomen fungerar bra och ska **behållas**. Daniel har godkänt att installera Reanimated för den här spiken.

**Läs först:** `CLAUDE.md`, `app/product/[id].tsx`, `components/ProductCard.tsx`, `app/_layout.tsx`, `docs/design.md` §0 (rörelse, delight), `theme/motion.ts`, expo-routers dokumentation om zoom-övergången (https://docs.expo.dev/router/advanced/zoom-transition/) och react-native-gesture-handlers dokumentation för att samordna en Pan-gest med en ScrollView. Presentera en plan i Plan Mode först.

## Gör
1. **Paket:** installera `react-native-reanimated` (och `react-native-worklets` om SDK 58 kräver det) med `npx expo install`, så rätt version väljs för SDK 58. Kontrollera att versionen inte har den kända Hermes-minnesregressionen (se Expos upgrade-notis: undvik expo ≤57.0.8, vi ligger på 58.x). Använd bara Reanimated där gesten behöver det. Migrera inte befintliga animationer.
2. **Egen gest:** Pan-gest (gesture-handler) som samordnas med scrollvyn (till exempel simultaneous med scrollvyns inbyggda gest) och som bara aktiveras när scrollen är exakt överst och draget går nedåt. Skärmen följer fingret (translation, lätt skala, rundade hörn). Släpp: tröskel av avstånd/hastighet → stäng, annars fjädra tillbaka. Avbryt med uppdrag.
3. **Behåll öppningszoomen** (native). Ta bort den begränsande `unstable_dismissalBoundsRect`-lösningen (53a1ada) och de tidigare studs-hacken.
4. **Kantswipe:** Testa först om den inbyggda kantswipen finns kvar när den inbyggda zoom-stängningen stängs av för skärmen (`usePreventZoomTransitionDismissal` utan gräns). Gör den inte det: bygg en egen kantgest (smalt område vid vänsterkanten, drag åt höger) som styr samma stängning.
5. **Överlämning vid stängning:** när vår gest tar skärmen till stängt läge ska det inte bli ett hopp. Undersök hur det går att lämna över till den inbyggda tillbaka-rörelsen (`router.back()`) utan synligt hopp, eller om en egen utfasning är bättre. Rapportera vad som funkar. Om det inte går att få bort ett hopp utan att ersätta öppningszoomen: **stanna och rapportera**, gör inte det bygget.
6. Testa i **mörkt och ljust** tema, från kort på Hem, Sparat, Hitta och Liknande. Bakgrunden bakom skärmen när den dras ska följa temat (görs redan med navigationstemat).

## Kriterier (go/no-go, Daniel bedömer på enhet)
Punkterna 1–5 i Målet. Särskilt: följer skärmen fingret **varje gång**, kan man avbryta, och fungerar kantswipe på allt.

## Gör INTE
- Ersätta öppningszoomen, ändra andra skärmar, lightbox (brief 18), migrera övriga animationer till Reanimated, nya paket utöver Reanimated/Worklets.

## Rapportera (max 10 rader)
Fungerar/inte, vilka kriterier som håller, hur överlämningen vid stängning löstes, vad som sticker ut, rekommendation (behåll, justera, no-go).
