# Rapport brief 53 – Hitta: ett fält som söker och pratar

## Inventering: vad som redan fanns
- **`app/(tabs)/find.tsx`:** hela Hitta var chatten (FlatList med bubblor, inline `ProductGrid compact`, felgräns runt griden, `askClaude` + `show_products`). Tog emot `query` från Hem via router-param och skickade den automatiskt. Tomläge och felmeddelande nämnde "Kroonas AI-guide".
- **`components/AskBar.tsx`:** riktig `TextInput` ("Vad letar du efter idag?") med pil som skickade `query` till `/find`.
- **`SectionTitle.tsx`:** hade redan `cta` (`{ label, onPress }`, ritad som 13/500 i `textPrimary`) och `icon`-slot, men **ingen hylla på Hem använde någon av dem**. Det fanns alltså inga stora chevroner i hyllrubrikerna att ersätta.
- **`ProductGrid.tsx`:** tvåkolumnsgrid, `compact` utan sidopadding. **`FilterPills.tsx`:** Pill `filter` (36), användes bara på Hem.
- **`data/areas.ts`:** fem områden med `filter { category, styles, types }`. **`lib/catalog.ts`:** `getProductsForArea`.
- **`data/products.ts`:** 20 produkter **utan färgfält**; färgen står bara i de engelska namnen ("Black", "Red").
- **`lib/cardProduct.ts`:** pris = lägsta nya, annars lägsta begagnade; `isUsed` = bara begagnat.
- **`lib/kroonaSystemPrompt.ts`:** prompten inledde med "Du är Kroonas AI-guide i Hitta-fliken".

## Gjort
1. **Dialogen är en egen skärm:** `app/dialog.tsx`, stackskärm utan flikfält, med tillbakaknapp.
   - Chatten är flyttad med oförändrad funktion.
   - `query` skickas automatiskt en gång.
   - `scope` visas som pill i toppen och läggs som en rad i systemprompten (`buildHittaSystemPrompt(scope)`): rekommendera inom scope om inte användaren själv går utanför.
   - När konversationen är tom visas startförslag:
     - med scope: "Till vardagsrummet", "Liten yta", "Under 3 000 kr", "Jag vet inte än";
     - utan scope: "Bröllopspresent", "Inreda ett litet kök", "Något till en kollega".
   - Fältets platshållare är "Skriv eller prata". Felet har ny text.
   - Prompten säger nu "en AI-guide i Kroona", och modellen ombeds att inte presentera sig med något namn.
   - Två `console.log` för felsökning togs bort vid flytten. `console.error` ligger kvar.
2. **Hitta är en startsida:** rubrik "Hitta", fältet och hjälpraden, och tre hyllor.
   - **Idéer för dig:** liggande kort 240 × 160, radie 20, förstoringsglas före titeln. Tryck öppnar Sökresultat direkt.
   - **Kategorier:** tre kort 109 × 150, radie 16, centrerad text. Trycket gör inget ännu.
   - **Områden och stilar:** 2-kolumnsgrid, 92 hög, titel + "N produkter".
3. **Sökläge** (`app/search.tsx`): tonar in.
   - Aktivt fält med markör och autofokus, rensa-knapp och "Avbryt".
   - Två rader: "Sök efter ”ord”" och "Fråga om ”ord”".
   - "Förslag": högst 4, bara förslag som själva ger träffar.
   - Med tomt fält visas "Senaste sökningar" (AsyncStorage `@kroona/recentSearches`, max 5).
   - Sökläget ersätter sig självt med målet, så att tillbaka leder dit man kom ifrån.
4. **Sökresultat** (`app/results.tsx`), params `q` eller `idea`:
   - tillbaka och fältet med termen (tryck öppnar sökläget igen);
   - pillar Alla/Nytt/Begagnat som fungerar;
   - antal träffar;
   - bannern till dialogen med `query` och `scope` = termen;
   - `ProductGrid`.
   - Utan träffar visas "Inga träffar på ”ord”" och knappen "Fråga om ”ord”".
5. **Lokal sökning** (`lib/search.ts`):
   - ord i gemener, småord bort (`och`, `i`, `till`, `stil` …);
   - varje ord ska finnas i namn, märke, typ, kategori, stil eller material, direkt, via enkel böjning (stolar → stol, svarta → svart) eller via `data/searchSynonyms.ts` (rum, svenska → engelska namn, färger);
   - träffar i namnet sorteras först.
6. **"Visa fler ›":** `SectionTitle` `cta` har nu standardtexten "Visa fler", 13/18 i `textSecondary`, med chevron 14 och linje 2,2 (`ChevronIcon` fick `strokeWidth`).
7. **Hem-fältet:** `AskBar` är ett tryckbart fält "Fråga eller sök", 56 högt, med stjärna och mikrofon. Det öppnar sökläget och används även på Hitta och i Sökresultat. Flödet med `query` till `find.tsx` är borttaget.

## Beslut jag tog själv
- **Idéerna**, eftersom varje idé måste ge minst 2 träffar:
  - "Nyheter inom Smarta hem" = teknik + belysning, bara nyheter. Ger 2 träffar: Brass Pendant Set och Smart Speaker.
  - **"Stickat i ull" byttes mot "Klassiskt i läder"**, kläder med läder, 4 träffar. Ull gav bara 1 träff (ponchon).
  - **"Belysning under 2 000 kr" byttes mot "Presenter under 1 000 kr"**, 5 träffar. Belysning gav 0 träffar: katalogen har en enda lampa, och den kostar 2 395 kr.
  - Idéfiltret har områdets form plus `newOnly`, `maxPrice` och `material` (`IdeaFilter` i `types/catalog.ts`). `getProductsForFilter` i `lib/catalog.ts` används nu också av `getProductsForArea`.
- **Ett sjätte område** behövdes för sex kort: "Vintage" (stil Vintage, 2 produkter) i `data/areas.ts`. Det syns därför även i Hem-hyllan Områden.
- **Områdeskortens bredd räknas fram:** (skärm − 2 × 16 − 8) / 2, vilket ger 175 på en 390-skärm. Skissens 169 förutsätter marginal 20. Höjden är 92.
- **Nytt / Begagnat betyder skick:** Nytt = har nytt erbjudande, Begagnat = har begagnat erbjudande. En produkt kan finnas i båda. Det betyder inte "Nyhet".
- **Material ingår i söktexten,** så att "läder" och "ull" ger träffar. Katalogen saknar färgfält, så färger går via synonymer till de engelska namnen.
- **Nya tokens:**
  - `sectionLink` och `findCards` (`theme/spacing.ts`);
  - `motion.searchFade`;
  - övergångarna `pushScreenOptions` (glid in från höger, kantswipe; med Minska rörelse bara opacitet) och `searchScreenOptions` (tona in).
- **Provisorisk mikrofonikon:** `assets/icons/MicIcon.tsx`.
- **"Fortsätt där du var"** på Hem öppnade `/find`. Kortet öppnar nu `/dialog`, tomt, eftersom det inte finns någon historik. Undertexten är "Fortsätt dialogen" i stället för "Fortsätt i Hitta".

## "Visa fler": hyllor utan destination (länken visas inte)
- **Hem:** ingen hylla har en "se alla"-destination: Fortsätt där du var, Skapat för dig, Samlingar för dig, Fler i din stil, Områden, Populära samlingar, Kanske intressant för dig. Där fanns heller inga chevroner.
- **Hitta:**
  - Idéer för dig: ingen idélista.
  - Kategorier: briefen säger att länken inte ska visas.
  - Områden och stilar: Områden-listan ligger utanför scope.
- **Länken syns därför bara på dev-sidan** (avsnittet "Hyllrubrik med Visa fler"). Den visas på hyllorna när en destination finns.

## Områdeskorten
Kortet länkar dit det redan länkade, alltså ingenstans. Områden på Hem öppnar heller inget, eftersom områdesdetaljen saknas.

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK (2196 moduler).
- Simulatorn på egen port 8097, öppnad med djuplänkar, mörkt och ljust läge:
  - **Hitta-startsidan:** idéer, kategorier, grid med sex områden. OK.
  - **Sökning:**
    - "vardagsrum" ger 8 träffar (teknik, belysning, stolar, bord);
    - "stolar" ger 3 träffar;
    - "svarta skor" ger 2 svarta sneakers, efter att böjningen "-a" lades till;
    - "kök" ger tomläget med "Fråga om ”kök”".
  - **Idé:** "Presenter under 1 000 kr" visar resultat med 5 träffar.
  - **Sökläget:** "st" ger handlingsraderna och förslagen Stolar, Skandinavisk stil och Urban stil. Tomt fält visar inga förslag förrän det finns sparade sökningar.
  - **Dialogen:**
    - med scope "vardagsrum": pill och startförslag;
    - utan params: allmänna startförslag och "Skriv eller prata".
  - **Hem:** fältet "Fråga eller sök" med stjärna och mikrofon.
- **Inte testat med tryck** (simulatorn kan inte trycka åt mig):
  - kedjorna Hem-fältet → sökläge, "Fråga om" → dialog, banner → dialog och Idé-tryck → resultat. Varje mål är testat via djuplänk, och navigeringskoden är kontrollerad med tsc;
  - autosändningen av `query` till API:t;
  - kantswipe på de nya skärmarna.
- Testkoden (offset och ljust tema) är borttagen. Ingen `TEMP-DEBUG` är committad. Min Metro på 8097 är stoppad, och Daniels server på 8081 är orörd.

## Utanför scope (flaggat, inte byggt)
- Kategorivy och kategorilista: kategorikorten gör inget (brief 54).
- Områden-lista och områdesdetalj.
- Pillarna Pris och Stil i Sökresultat.
- Chatthistorik: Fortsätt-kortet öppnar en tom dialog.
- Röst: mikrofonen är bara en ikon.
- Namn på AI:n.
- Hem-pillarna filtrerar fortfarande inte.
- Riktig sökning mot backend.

## Övrigt upptäckt
- **Sökning ovanpå sökresultat:** sökläget som öppnas från Sökresultat ersätts av ett nytt Sökresultat. Det gamla ligger kvar under, så tillbaka går till föregående sökning och inte direkt till Hitta eller Hem. Det fungerar, men flera omsökningar ger en djup stack.
- **`ContinueDialogRow`** (inte på Hem) och **Sparats "Utforska"** länkar fortfarande till fliken `/find`. Det fungerar, men de leder inte till dialogen.
- **Produktkatalogen saknar färgfält**, och namnen är på engelska. Svenska sökord går därför via synonymlistan.
