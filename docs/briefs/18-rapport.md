# Rapport brief 18: react-native-screen-transitions

**Status:** byggd på grenen `spik/screen-transitions` (main orörd, ingen push). Ingen blockerare: biblioteket är ren JS och appen körs i Expo Go (simulator iOS 26.3). Development build behövs inte, react-native-teleport installerades inte.

**Versioner:** react-native-screen-transitions 4.2.0, react 19.3.0, expo-router 58.0.32, reanimated 4.7.1, worklets 0.13.0, gesture-handler 3.3.0, @react-navigation/native 7.5.2. Alla peers är uppfyllda. Installerat med `--legacy-peer-deps` (paketet finns inte i Expos lista). Enda nya transitiva beroendet är `standard-navigation`.

**Byggt:**
- **Rotens stack** är bibliotekets `BlankStack` (Expo Router-adapter). Skärm 1 är `(tabs)` med `inactiveBehavior: 'pause'`, så att flikarna står kvar bakom. Skärm 2 är `product/[id]` med zoom.
  - Skärmarna är JS-vyer, så föregående skärm finns kvar bakom detaljvyn.
  - Flikarna är en egen navigator inuti och är oförändrade. Hem, flikbyte och dev-sidan renderar som förut.
- **Zoom:** kortbilden i `ProductCard` och heron i Produktdetalj är var sin `Transition.Boundary` med `group "product"` och `id` = produkt-id. `screenStyleInterpolator` använder `bounds({id, group}).navigation.zoom()` med telefonens hörnradie (`radius.screenDynamicIsland` eller `screenNotch`, vald via safe area) och fjädrar som token (`motion.zoomSpec`). Kort med egen `onPress` har ingen Boundary och zoomar inte.
- **Gest:** `gestureEnabled`, `gestureDirection: ['vertical', { gesture: 'horizontal', area: 24 }]`. Drag nedåt tas över av `Transition.ScrollView` bara överst, och kantswipe gäller i en 24 px remsa. Ingen helskärms-tillbakagest. Scrollvyn studsar som vanligt.
- **Informationen under heron** tonas in under övergångens sista del (progress 0,75 → 1, `motion.detailRevealFrom`) via `useScreenAnimation`, och samma väg tillbaka vid stängning. Med Minska rörelse är den synlig direkt.
- **Borttaget:** `Link.AppleZoom` och `AppleZoomTarget`, `usePreventZoomTransitionDismissal`, `Stack.Screen`-options för tillbakagesten, den egna Pan-gesten med dess Reanimated-omslag och `dismiss*`-tokens (utom `dismissEdgeWidth`), samt fördröjningstokens för reveal. Reanimated används kvar för titelns toning och scroll-positionen.
- **EdgeFade är oförändrad.** I den nya stacken monteras toppkanten med skärmen. Toningen fanns i första fångade bildrutan efter öppning, alltså inte sist. Den gamla förseningen hörde troligen ihop med native-stackens övergång, men det är inte bevisat.

**Verifierat (simulator):** start i Expo Go, Hem, dev-sidan, öppning av Produktdetalj från kort och `router.back()` utan krasch eller fel. Dessutom tsc, iOS-export och grep. Övergången gick för fort för skärmdumpar, så zoomens utseende är inte sett. Tillfälligt automatiskt tryck och tillbaka användes och är borttaget.

**Overifierat (bara på enhet, simulatorn kan inte dra):** kriterium 1 (att zoomen ser rätt ut), 2 (drag, avbryt, att bilden landar i kortet varje gång, att sidan syns bakom), 3 (kantswipe och inget mittensvep), 4 (scroll mot gest, studs) och 5 (toningen visuellt).

**Avvikelser och kända brister:**
- Zoomens standard för bakgrunden: föregående skärm skalas till 0,9375 och dämpas med svart, högst 45 %. Det är inte ändrat.
- Dev-sidan och andra skärmar utan egna options visas utan animation.
- Varning i loggen från biblioteket: "navigation.getState() was called during render". Den är ofarlig så vitt jag sett.
- Samma produkt i två rader på samma skärm delar id, så zoomen kan välja fel kort.
- Ingen haptik vid stängning.

**Ändrade filer:** `package.json`, `package-lock.json`, `app/_layout.tsx`, `app/product/[id].tsx`, `components/ProductCard.tsx`, `components/product/productTransition.ts` (ny), `theme/motion.ts`, `docs/briefs/18-rapport.md`.

**Rekommendation:** testa på enhet. Om drag och landning sker varje gång och sidan bakom syns: behåll och justera bakgrundens skala och dämpning efter smak. Annars no-go, och grenen ligger kvar.
