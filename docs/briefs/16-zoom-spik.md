# Brief 16 — Spik: zoom-övergång ProductCard → Produktdetalj

**Mål:** Ta reda på om Expo Routers inbyggda zoom-övergång (iOS 18+) fungerar bra nog som grund för hierarkirörelsen i appen. **Det är en spik, inte en färdig funktion.** Bara ProductCard → Produktdetalj. Committa som en separat commit märkt "spik" så den går att backa.

**Bakgrund:** Daniel vill att man visuellt tar sig ner och upp i hierarkin (som Pinterest): trycker man på en produktbild växer bilden till detaljvyn, informationen under tonas in, och swipe ned eller kantswipe tar en tillbaka med samma rörelse baklänges. Flikbyte ska inte få zoom. Dokumentation: https://docs.expo.dev/router/advanced/zoom-transition/ (alfa-API i SDK 55+: `Link.AppleZoom`, `Link.AppleZoomTarget`, `usePreventZoomTransitionDismissal`; kräver `Link asChild`, bara i Stack, iOS 18+).

**Läs först:** `CLAUDE.md`, `components/ProductCard.tsx` (idag `router.push` inuti en `Pressable` med långtryck via gesture-handler), `components/ProductContextMenu.tsx`, `app/product/[id].tsx`, `app/_layout.tsx`, dokumentationen ovan. Presentera en plan i Plan Mode först.

## Gör
1. Kontrollera först om funktionen alls finns i vår miljö: Expo SDK 58, react-native-screens-version, och om den kräver development build i stället för Expo Go. Rapportera innan du bygger om något blockerar.
2. Koppla zoomen på `ProductCard` (bilden är källan) och på Produktdetalj (heron är målet, 4:5, justera alignment om det behövs). Behåll `onPress`-override för kort som inte ska navigera.
3. Behåll **långtryck-menyn** oförändrad. Testa att långtryck, släpp, drag-för-att-välja och vanligt tryck fortfarande fungerar och inte startar zoomen av misstag.
4. Informationen under heron (märke, namn, pris, sektioner) ska **tonas in** efter att bilden landat, kort och lugnt. Bygg det som en liten egen animation, bara om det går utan att störa övergången. Annars rapportera varför.
5. Testa på enhet och rapportera mot kriterierna nedan.

## Kriterier (go/no-go, bedöms av Daniel på enhet)
- Zoomen känns mjuk och inte fördröjd (dokumentationen nämner upp till ca en sekund vid snabba gester).
- Swipe ned stänger detaljvyn med bilden tillbaka till sin plats i griden. Fungerar det inte när man är scrollad längre ned? Hur beter sig gesten mot vertikal scroll i detaljvyn?
- Kantswipe (från vänster) fungerar som förut.
- Långtryck-menyn krockar inte.
- Fungerar från alla ställen korten används (Hem, Sparat, Hitta, Liknande) eller rapportera var den inte gör det.
- Äldre iOS (<18) faller tillbaka till vanlig navigering utan fel.

## Gör INTE
- Egen implementation av delad element-övergång eller egen swipe-gest (det är nästa steg om detta blir no-go).
- Zoom på andra skärmar än Produktdetalj, lightbox (brief 17), flikbyten, nya paket utan att fråga.

## Rapportera (max 10 rader)
Går/går inte, vilka kriterier som håller, vad som sticker ut, och din rekommendation: behåll, behåll med justeringar, eller no-go.
