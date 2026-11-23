# Rapport brief 43 – Hem: redaktionella kortformat och ny hyllordning

## Gjort
- **`components/EditorialCard.tsx`** (ny): text på bilden, tre varianter enligt tabellen: `portraitLarge` 280 × 373 / r24 / toning + blur / centrerad / 22/26, `portraitSmall` 150 × 225 / r16 / bara toning / centrerad / 16/20, `landscape` 320 × 213 / r20 / toning + blur / vänsterställd / 18/22 med valfri statusrad.
  - Undertitel 13 (12 på små), vit 76 %. Titel max 2 rader med ellipsis.
  - Inre kant 1 px ovanpå bilden (vit 12 % / mörk 10 %), ingen yttre kant.
  - Har props för `cover`, `chip`, `size` (härledda format), `boundary` (zoom) och `onPress`. Tryckrespons via `useCardPress`.
- **Tokens:**
  - `theme/radius.ts`: `editorialLarge 24`, `editorialMedium 20`, `editorialSmall 16`.
  - `theme/spacing.ts`: `editorialCard` med mått, toning- och blurandelar, blurlager och padding.
  - `theme/typography.ts`: `editorialLarge/Medium/Small`.
  - `theme/colors.ts`: färgrollen `imageEdge` och `overlay.onPhotoMuted` / `overlay.editorialFade`.
- **Hem** (`app/(tabs)/index.tsx`): Header, TextTabs och AskBar är orörda. Hyllorna nedan har 32 px emellan (`spacing.xxl`), och varje hylla returnerar `null` utan innehåll.
  1. **Fortsätt där du var** (`ContinueRow`, ny): ett liggande kort för dialogen (dummy, → Hitta) och ett för senast öppnade egna samling (mosaik, zoom till Samlingsdetalj).
  2. **Skapat för dig** (`MixRow weekly={false}`): kvadratiska 160 × 160-kort med 2 × 2-mosaik och text på bilden. Data och rankning i MixRow är oförändrade, och namnen är kvar.
  3. **Samlingar för dig** (`CollectionsForYouRow`, ny): stora stående kort. Kroonas teman kommer först, sedan varumärkenas kollektioner. Undertext "Av Kroona · N produkter" eller "Av J.Lindeberg · …". Zoom till Samlingsdetalj.
  4. **Fler i din stil** (`MoreInYourStyleRow`, ny): cirklar på 76 px (ProfileCard) med varumärken och personer varannan. Varumärkena väljs med DiscoverBrandsRows logik, som nu delas via `useDiscoverBrandTiles()`. Personerna är de man inte följer. Tryck öppnar Partnerdetalj respektive profilen.
  5. **Områden** (`AreasRow`, ny): små stående kort från `data/areas.ts`. Omslaget är första produktens bild och undertexten "N produkter".
  6. **Populära samlingar** (`PopularCollectionsRow`, omskriven): kollagekort 200 × 267 med en bred bild över två små. Glaschip med avatar och namn överst till vänster, titel och antal centrerade. Zoomen till Samlingsdetalj är kvar.
  7. **Kanske intressant för dig**: oförändrad.
- **Borttaget från Hem, filerna ligger kvar:** CollectionRow ("Du följer"), DiscoveryMosaicCard, HeroRow, DiscoveryPreviewCard, ContinueDialogRow och DiscoverBrandsRow. CollectionCard ligger också kvar och används av CardShowcase.
- **Dokument:**
  - `design.md`: nytt §8j och radietabellen.
  - `designsystem.md`: nytt §16 EditorialCard.
  - `ia-karta.md`: Hem-raden, Partnerdetaljens ingångar och öppna frågor.
  - `produkt.md`: en rad om Hem.

## Beslut jag tog själv
- **Senast öppnade egna samling fanns inte som data.** Jag lade till `lastOpenedCollection` och `markCollectionOpened` i `UserCollectionsContext`, sparat i AsyncStorage (`@kroona/lastOpenedCollection`). Samlingsdetalj anropar `markCollectionOpened` när en egen samling öppnas. Det finns ingen reserv (till exempel senast skapade): har man inte öppnat någon visas bara dialogkortet.
- **Blur:** fyra maskade BlurView-lager à 25 % (sammanlagt ca 12 px i botten), med egna nedre hörn eftersom BlurView inte klipps pålitligt av förälderns radie.
  - Jag såg först en hård kant på kortet "Skandinavisk stil" och provade flera upplägg av lagren. Med blurren avstängd visade det sig att kanten är en trottoarkant i själva fotot.
  - Blurren tonar in mjukt.
- **2 × 2-mosaik i mixarna:** mixarna tar nu 4 produktbilder i stället för 3. De statiska reservmixarna fick en fjärde bild var, återanvänd från samma fil. Gränsen på minst 3 produkter är orörd, och då blir det en stor och två små bilder.
- **Formaten mix och kollage:** jag byggde dem som `size`-varianter av EditorialCard med de små kortens text (toning, ingen blur). Mix har radie 16, kollage radie 20.
- **"Samlingar för dig":** varumärkenas filtersamlingar (J.Lindeberg, Filippa K i `COLLECTIONS`) är inte med. De är varumärken och syns som cirklar i "Fler i din stil".
- **Avatar:** under 32 px används nu `micro` för initialerna (kuratorchippet har 20 px).
- **Underrubriken "Uppdateras varje vecka"** under Skapat för dig behöll jag, eftersom den är en del av SectionTitle-stilen.

## Verifiering
- `tsc --noEmit` är grönt och iOS-exporten (Metro-check) är grön.
- **Simulatorn, egen Metro på 8097, mörkt läge:** jag gick igenom alla sju hyllorna. Text, toning, blur och kant ser ut som tänkt, och texten krockar varken med kanten eller med chippet.
- **Simulatorn, ljust läge** (tillfälligt `setScheme('light')`): korten ser likadana ut, kanten är mörk, chippet har ljust glas, och rubriker och bakgrund följer temat.
- **Kort utan bild:** "Bastu" (0 produkter) visas som placeholder-yta med läsbar text.
- **Långa titlar:** "Bästa begagnade fynden" kortas med ellipsis.
- Testkoden (scroll-offset och ljust läge) är borttagen. Min Metro är stängd, och din server på 8081 kör.
- **Ej verifierat: prestanda för blurren i horisontell scroll på enhet.** Simulatorn kan inte mäta det. Blur finns på 2 liggande och 3 stora kort (4 BlurView per kort). De små korten, mixarna och kollagen har bara toning. Om det hackar på enheten är det enklast att sätta `blur: false` för `portraitLarge` i `VARIANTS`.

## Flaggor
- **"Syns 2,2 kort" i Samlingar för dig går inte ihop med 280 px bredd.** På 390 bred skärm syns ca 1,3 kort. Jag följde måtten i tabellen. Menades 1,2, eller ska korten vara smalare?
- **"Du följer" borttaget:** inget förlorar sin enda ingång.
  - Kroonas teman nås via Samlingar för dig.
  - Varumärkena nås via Sparat → Följer, cirklarna i Fler i din stil (bara ej följda) och kuratorraden i Samlingsdetalj.
  - Följda samlingar listas i Sparat → Följer.
  - HeroRow, DiscoveryMosaicCard och DiscoveryPreviewCard hade inga destinationer.
- **Ingen destination:**
  - **Områden:** det finns ingen områdesvy, så korten kan inte tryckas.
  - **Mixar:** hade ingen destination tidigare heller.
- **"Fler i din stil" kan bli helt varumärken eller helt personer.** Varumärken kräver en följd stilsamling (befintlig logik), och personer visas bara om man inte följer dem. I simulatorn följer jag alla fem personerna sedan brief 42, så bara varumärken syns där.
- **Fortsätt där du var:** dialogkortet är statiskt, så hyllan döljs aldrig i praktiken (som ContinueDialogRow tidigare).
- **Kollaget:** den breda bilden är samlingens omslag och de små är produkt 2–3. I någon samling kan samma bild därför förekomma två gånger.
- **Utanför scope (inte byggt):**
  - Filterflikarna filtrerar inget.
  - Ingen hyllström, rankning eller rytmregel.
  - Ingen "Visa alla"-chevron.
  - Hem saknar kantblur upptill, så innehållet skrollar under statusfältet (som tidigare).
  - Dev-länken "Komponenter (dev)" ligger kvar under AskBar.
  - `ProfileCard` har kvar sin lokala konstant `SIZE = 76`.
