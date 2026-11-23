# Brief 43 – Hem: redaktionella kortformat och ny hyllordning

**Fas:** 0. **Mål (ett):** Bygg de tre redaktionella kortformaten (stor stående, liten stående, liggande) som en gemensam komponent och montera om Hem enligt Claude Design-skissen. Kör efter brief 42. Inventera först (components/, app/(tabs)/index.tsx, data/) så att inget befintligt skrivs över.

Källa: Claude Design-skissen "Kroona Hem – kortformat" (Hem mörkt/ljust + måttbräda). Pixelvärden nedan är skissens, på 390 bred skärm.

## Nuläge (verifierat av Claude)
Hem monterar idag: Header, TextTabs (bara visuell), AskBar, ContinueDialogRow (LinkCard horisontell), CollectionsRow "Du följer" (PartnerCard 150 × 310), PopularCollectionsRow (CollectionCard), RecommendedProductsRow, DiscoverBrandsRow, DiscoveryMosaicCard, HeroRow, DiscoveryPreviewCard. MixRow/MixCard och ClusterCard finns men är inte monterade på Hem. Radius-tokens saknar 20 och 24.

## Del 1: kortformat (en komponent, t.ex. `components/EditorialCard.tsx`)
Text ligger **på bilden** med toning och blur i botten. Tre varianter:

| Variant | Mått | Radie | Toning/blur | Text | Titel |
|---|---|---|---|---|---|
| `portraitLarge` | 280 × 373 (3:4) | 24 | toning + blur | **centrerad** | 22 / 26 |
| `portraitSmall` | 150 × 225 (2:3) | 16 | bara toning | **centrerad** | 16 / 20 |
| `landscape` | 320 × 213 (3:2) | 20 | toning + blur | **vänsterställd**, valfri statusrad | 18 / 22 |

Regel: **stående kort har centrerad text, liggande kort vänsterställd.** Undertitel 13 (stor/liggande) och 12 (liten), vit 76 %.
- **Kant:** 1 px inre linje, vit 12 % (mörkt) och mörk 10 % (ljust), aldrig dubbel kant. Ritas ovanpå bilden.
- **Toning:** 0 → 56 % → 78 % (mörk #0E1014) över nedre ~58 % (liten: 56 % och 0 → 50 → 76).
- **Blur:** äkta blur (samma teknik som i Spara-kortet, brief 39/40, inte transparent gradient), ca 12 px över nedre 48 %, maskad så att den tonar in. Små kort och kort i horisontell scroll: verifiera prestanda på enhet; faller blur-versionen märkbart, behåll bara toningen och beskriv det i rapporten.
- **Radien skalar med storleken** (24 / 20 / 16). Lägg `radius.editorialLarge/Medium/Small` (eller motsvarande) i `theme/radius.ts`, med `borderCurve: 'continuous'`.
- **Produktkort ändras inte** (text under bilden, r14, pris och betyg aldrig på foto).
- Tryckrespons: samma `useCardPress` som övriga kort. Kortet tar `onPress`, så att zoomövergångar (CollectionCard-mönstret med Transition.Boundary) kan behållas där de redan finns.

## Del 2: Hem, ny ordning uppifrån och ned
Behåll Header, TextTabs och AskBar som de är. Därefter hyllor, alla med rubrik i samma stil som idag (SectionTitle) och 32 px mellan hyllorna:

1. **Fortsätt där du var** – `landscape`, 2 kort: pågående dialog (dummy, som idag) och användarens senast öppnade egna samling om en finns. Dölj hyllan helt om inget finns att visa.
2. **Skapat för dig** – mixar, kvadratiska 160 × 160, 2 × 2-mosaik av produktbilder med titel och undertitel på bilden (toning). Använd befintliga MixRow/MixCard-data och rankningslogik; döp inte om dem.
3. **Samlingar för dig** – `portraitLarge`, Kroonas egna samlingar ("Av Kroona · N produkter", eller återförsäljare). Syns 2,2 kort. Öppnar Samlingsdetalj som idag.
4. **Fler i din stil** – cirklar/avatarer (76 px, namn under, centrerat): varumärken **och** personer blandat. Ersätter DiscoverBrandsRow-ytan; behåll dess logik för att välja varumärken. Tryck öppnar Partnerdetalj respektive personprofil. Cirkel betyder identitet, så inga cirklar för samlingar eller innehåll.
5. **Områden** – `portraitSmall` från `data/areas.ts`.
6. **Populära samlingar** – personers samlingar (PEOPLE_COLLECTIONS) som kollagekort 200 × 267 (en bred bild över två små), kuratorchip överst till vänster (avatar + namn, glaschip), titel och antal centrerade. Behåll zoomövergången och öppna Samlingsdetalj.
7. **Kanske intressant för dig** – produktkort, oförändrade (RecommendedProductsRow).

Gäller alla hyllor: dölj en hylla som saknar innehåll, aldrig tom rubrik.
Tas bort från Hem (komponenterna och filerna ligger kvar): "Du följer" (CollectionsRow), DiscoveryMosaicCard, HeroRow, DiscoveryPreviewCard. **Claude tolkar att "Du följer" hör hemma i Följer-fliken; flagga i rapporten om något därmed förlorar sin enda ingång.**
Ljust och mörkt läge ska fungera (themas via `makeStyles`).

## Utanför scope (flagga, bygg inte)
- Filterflikarna (Allt/Kläder/Möbler/Begagnat) filtrerar fortfarande inget.
- Oändlig hyllström, rankning och rytmregel (ingen intilliggande hylla med samma format). Egen brief efter att den här är godkänd visuellt.
- "Visa alla"-chevron på rubrikerna (kräver destination per hylla).
- "Varför ser jag detta?", taste-breaker "Nytt för dig", hälsningshero-omarbetning.
- Menyikoner och flikbyte (brief 44 tar bara namnet).
- Mosaik- och ClusterCard-montering.

## Verifiering
tsc, Metro-check, simulator i mörkt och ljust läge. Titta särskilt på: blur i horisontell scroll (flaggning och prestanda), text som inte kolliderar med kant eller avatarer, långa titlar (max 2 rader med ellipsis), kort utan bild. Rapport: `docs/briefs/43-rapport.md`.
Dokument: `docs/design.md` (korttyper: text på bild med toning och blur, centrerad på stående, vänster på liggande, radier 24/20/16, kant 1 px; produktkort oförändrade), `docs/designsystem.md` (EditorialCard), `docs/ia-karta.md` (Hem: ny hyllordning), `docs/produkt.md` (en rad). Committa, inkl. briefen, och pusha.
