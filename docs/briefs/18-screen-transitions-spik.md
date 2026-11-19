# Brief 18 — Spik: react-native-screen-transitions för hierarkirörelsen

**Mål:** Produktdetalj ska öppnas och stängas som i Pinterest/Apple, och det ska fungera varje gång. Daniels krav (bedöms på enhet):
1. Tryck på ett kort: kortets bild växer (delad zoom) till detaljbilden, informationen under tonas in.
2. Överst i innehållet, drag nedåt var som helst: hela skärmen följer fingret, **föregående skärm syns bakom**, hörnen har telefonens rundning, man kan avbryta genom att dra upp, och släpper man förbi tröskeln går bilden tillbaka till **sitt kort**, **utan hopp och varje gång**.
3. Kantswipe från vänster stänger överallt. Högersvep mitt på skärmen stänger inte.
4. Vertikal scroll i innehållet fungerar normalt. Ingen hård studs, inget som blinkar.
5. Toppens toning (EdgeFade) finns på plats direkt när skärmen visas.

**Bakgrund:** Brief 16–17 byggde detta ovanpå Expo Routers inbyggda zoom (Link.AppleZoom) plus en egen Reanimated-gest. Det ger tre kvarstående fel: föregående skärm syns inte bakom, överlämningen vid stängning är inkonsekvent, och toningen kommer sist. Det är inbyggda begränsningar i att blanda två system. Lösning att prova: biblioteket **react-native-screen-transitions v4.2.0** (MIT, släppt 2026-11-10), som äger hela övergången (delad zoom via Bounds API, gest-samordnad scroll, genomskinlig stack så föregående skärm syns). Den har en Expo Router-adapter för SDK 56+ (`react-native-screen-transitions/expo-router`). Peer: react ≥19.2, expo-router ≥56, reanimated ≥4, worklets ≥0.8, gesture-handler ≥2.16.1, @react-navigation/native ≥7.3. `react-native-teleport` är valfri (utan den degraderar bara "handoff"/"escapeClipping").

**Arbetssätt (viktigt):** Daniel vill slippa klippa-och-klistra. Arbeta **självständigt i auto mode utan att vänta på godkännande av planen**, på en **egen gren** `spik/screen-transitions` (skapa den från nuvarande HEAD, commita där, ingen push). Pausa bara vid blockerare som listas nedan. **Skriv rapporten till `docs/briefs/18-rapport.md` och committa den**, så läser jag den direkt från repot. Skriv sedan en kort sammanfattning i terminalen (max 5 rader).

**Läs först:** `CLAUDE.md`, `app/_layout.tsx`, `app/product/[id].tsx`, `components/ProductCard.tsx`, `components/EdgeFade.tsx`, `docs/design.md` §0. **Läs bibliotekets egen dokumentation i `node_modules/react-native-screen-transitions` (README, `src/`, typer) efter installation**: dokumentationssajten är inte nåbar härifrån. Nyckelbegrepp i källan: `navigation.zoom()`, `Transition.Boundary` (Trigger/View, `id`, `group`), `Transition.ScrollView`, `gestureEnabled`, `gestureDirection`, `gestureDrivesProgress`, `screenStyleInterpolator`, `transitionSpec`, och `navigators/expo-router`.

## Gör
1. Installera biblioteket med `npx expo install` (om det inte finns i Expos lista: `npm install react-native-screen-transitions --legacy-peer-deps`). Kontrollera att peer-versionerna är uppfyllda (särskilt React ≥ 19.2) och att appen startar **i Expo Go**. Installera **inte** react-native-teleport om det kräver development build, och rapportera om något i spiken ändå kräver en sådan.
2. Rotens navigator: byt Stack till bibliotekets Expo Router-integration (blank stack via adaptern) så att `(tabs)` är skärm 1 och `product/[id]` en detaljskärm med zoom. Flikbyten ska vara oförändrade. Rapportera om fliknavigeringen påverkas.
3. Zoomen: kortbilden i `ProductCard` är källa (Boundary Trigger med `id` per produkt), detaljbilden (hero) är mål. Behåll `onPress`-override och långtryck-menyn oförändrade (kontrollera att långtryck, drag-för-att-välja och vanligt tryck inte krockar).
4. Gesten: vertikal stängning med `Transition.ScrollView` runt detaljinnehållet (gesten tar bara över överst), plus kantswipe från vänster. Stäng av helskärms-tillbakagesten (högersvep mitt på skärmen ska inte stänga). Hörn: telefonens rundning (token `radius.screenDynamicIsland`/`screenNotch` finns redan). Tröskel och fjäder: använd tokens i `theme/motion.ts` (nya vid behov).
5. Ta bort det som biblioteket ersätter: `Link.AppleZoom`/`Link.AppleZoomTarget`, `usePreventZoomTransitionDismissal`, den egna Pan-gesten, `dismiss*`-tokens som inte längre används, och Reanimated-omslagen i `app/product/[id].tsx` som bara fanns för gesten. Behåll Reanimated som paket (biblioteket kräver det). Lämna resten av skärmen oförändrad.
6. Informationen under hero tonas in efter att bilden landat (kort, lugnt, respektera "Minska rörelse").
7. EdgeFade: se till att toningen syns från första bilden (diagnostisera varför den kom sist; hypotes: blur-lagren skapas först efter övergången; testa att rendera den utan att vänta på övergången). Ändra inte utseendet på övriga skärmar.
8. Testa i simulatorn att skärmen öppnas, renderar och inte kraschar (gesterna kan inte dras där). Stäng aldrig Daniels egen Expo-server: kör simulatorn på en egen port och döda bara din egen process (inte `pkill -f "expo start"`).
9. `npx tsc --noEmit`, iOS-export, grep att inga hex/siffror ligger utanför `theme/`. Inga kvarlämnade debug-rester.

## Blockerare (pausa och rapportera endast vid dessa)
- Biblioteket kräver development build för det vi behöver (Expo Go räcker inte).
- Det går inte att få fliknavigeringen att fungera oförändrad.
- Zoomen kan inte uppnås med biblioteket utan större omskrivning än briefen beskriver.
Vid blockerare: skriv rapporten med orsaken och stanna. Annars gå hela vägen.

## Kriterier (bedöms av Daniel på enhet) och no-go
Punkterna 1–5 i Målet. No-go om biblioteket inte klarar punkt 2 (inkonsekvent överlämning eller sidan bakom saknas) eller kräver development build. Då ligger allt kvar på grenen och main är orörd.

## Gör INTE
Lightbox (brief 19), andra skärmar, flytta fler övergångar till biblioteket, ändra design/tokens utöver gesten, pusha, röra main.

## Rapport (`docs/briefs/18-rapport.md`, max 25 rader)
Vad som byggdes, vilka kriterier som sannolikt håller och vilka som är overifierade (simulatorn kan inte dra), hur zoom/gest/scroll kopplades, versioner, avvikelser, kända brister, och rekommendation (behåll, justera, no-go). Lista exakt vilka filer som ändrats.
