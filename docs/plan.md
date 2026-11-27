# Kroona — Plan

*En sida. Svarar på "vad jobbar vi med nu, och vad kommer sen". Uppdateras när något ändras, aldrig med nya idéer (de går till `idebank`). Senast: 2026-11-27.*

## Mål för Fas 0 (bekräftat 2026-11-17)
Ett demo i telefonen som Daniel kan visa en pilotpartner och som håller i en 5-minuters genomgång av hela köpresan: **Hem → Produktdetalj → Samling → Sparat**, plus Hitta och Följer.

**Klart när:** de fyra tabbarna och tre detaljvyer (Produkt, Samling, Partner) är byggda på 56 dummyprodukter, i både mörkt och ljust tema, utan att API-nyckeln ligger i klienten. *(Katalogen är sedan brief 48 20 produkter med lokala bilder; flikarna, detaljvyerna och båda temana är byggda. Kvar: API-nyckeln.)*

## Nu — ett aktivt spår åt gången
| # | Spår | Klart när |
|---|---|---|
| 0.1–0.3 | Dokument, repo-inventering, designgrund | ✅ Klart 2026-11-17–19 |
| 1 | **Fas 0-demot, skärm för skärm via briefer** (38–73 klara 2026-11-20–27) | Flikarna, detaljvyerna, Profil/Notiser/Inställningar och arkivet är byggda (se Kodläge). Pågår: polering via korta uppföljningar. Nästa brief väljer Daniel. |

## Kodläge (inventerat 2026-11-26, commit `08b05e0`)

| Yta | Specat | Designat | Byggt |
|---|---|---|---|
| Hem | ✅ | ✅ | ✅ Topp med avatar (Profil), klocka (Notiser) och varierande hälsning (`lib/greetings.ts`), fältet "Vad är du intresserad av idag?", pillar (filtrerar inget än), hyllor: Fortsätt där du var (dialoger, sökningar och samling, senast använd, 240 × 160), Skapat för dig, Samlingar för dig (logotyp eller titel), Fler i din stil, Områden, Populära samlingar, Kanske intressant för dig. |
| Följer | ✅ | ✅ | ✅ Pinterest-flöde (brief 59): följt och inspiration blandat, masonry / en kolumn, pillar som filtrerar, pull-to-refresh, tomläge. Dummylogik. |
| Hitta | ✅ | ✅ | ✅ Sök, dialog och kategorier (brief 53–54). Hyllor Idéer, Tidigare (3 senaste) och Kategorier (fyra: Kläder, Möbler, Elektronik, Begagnat), Områden och stilar. Arkiv och Alla kategorier (3-kolumnsgrid). Dialoger och sökningar sparas lokalt och återupptas (brief 66). Kvar: jämförelse, röst. |
| Sparat | ✅ | ✅ | ✅ Mina samlingar \| Följer, Sparade produkter, rader/kort. Egna samlingar: skapa, byt namn, redigera innehåll, ta bort (lokalt). Följ-ikoner efter typ och läge (brief 67). Kvar: ordning i samlingar, eget omslag (idébanken). |
| Produkt-, Samlings-, Partner- och Profildetalj | ✅ | ✅ | ✅ Produktdetalj (+ lightbox, betyg under priset, rund Spara på namnraden, märket öppnar profilen). Samlings- och Partnerdetalj med gemensam hero (`ProfileHero`), parallax, antal vid rubrikerna; Partnerdetalj med områden och hållbarhet (brief 69; "Ej redovisat" och "Så räknar vi" brief 70). Mer-meny (⋯) förankrad vid knappen på Produktdetalj och i Sparat (brief 70; Produktdetaljs val brief 71). Produkter kan sakna hållbarhetsindex ("Ej redovisat", tre testprodukter) och snackbaren har plus/minus-märke på miniatyren (brief 71). Produktkortets meny: Följ <märke>, Dela (platshållare) och Visa liknande fungerar (brief 72). Följ via meny bekräftas med snackbar, Visa liknande har ikonen `images`, och rubrikerna på Produkt- och Partnerdetalj har ikoner (brief 73). Profildetalj för personer (dummy). |
| Profil, Notiser, Inställningar | ✅ | ✅ | ✅ Dummy (brief 64): egen profil, notiser med olästprick, inställningar med Ljust/Mörkt/System (sparas), dev-sidan. |
| Onboarding | parkerad | — | — |

**Fynd från inventeringen 2026-11-17 (läge nu)**
1. ~~Datamodellen är den gamla~~ ✅ Produkt / Återförsäljare / Erbjudande sedan brief 12, katalogen 20 produkter sedan brief 48.
2. ~~Bara mörkt tema~~ ✅ Ljust, mörkt och system (brief 64), `userInterfaceStyle: automatic`.
3. ✅ Tokens i `theme/`.
4. ✅ `expo-blur`, Familjen Grotesk och Reanimated installerade.
5. `tsc --noEmit` utan fel.
6. **API-nyckeln ligger i klienten** (kvar). `claude-sonnet-5` i `claudeProxy.ts` ej verifierat.
7. Skräp kvar, se Teknisk skuld.

## Näst — i den här ordningen
1. ✅ Tema, SDK 58, baskomponenter, designriktning "Apple-ren" (2026-11-18–19).
2. ✅ Datamodell i koden (brief 12, katalog brief 48).
3. ✅ Detaljvyer: Produkt (13–22, 60, 62), Samling (28, 65), Partner (29, 65, 69), Profildetalj (37).
4. ✅ Sparat (32–42, 61, redigera egna samlingar 2026-11-26).
5. ✅ Hem (43–51, 63), Följer (59), Hitta (53–54, 66).
6. ✅ Profil, Notiser, Inställningar (64). Ikonsystem (56–58, 67).
7. **Demo-redo:** API-nyckel bakom proxy, telefonbygge för visning, enhetstest av gester (zoom, swipe, lightbox, långt tryck, växlar).
8. **Spec v1.20:** gå igenom `docs/spec-forslag.md` med Daniel (beslut B1–B3).

## Teknisk skuld (ingen brådska, men inte glömd)
- `npm audit`: 54 sårbarheter (1 kritisk). Kolla om den kritiska gäller något som hamnar i appen. Kör inte `audit fix --force`.
- `@react-navigation/native` och `bottom-tabs` ligger kvar i `package.json` men används inte direkt. Kan tas bort.
- `react-native-svg-transformer` hittar Metro-konfigen bara på ett visst ställe i `node_modules`. Kraschar Metro efter en framtida installation behövs en egen transformer.
- API-nyckeln i klienten, `claude-sonnet-5` i `claudeProxy.ts` ska verifieras, `test.json` i roten.
- Oanvända komponenter: `CardShowcase`, `ClusterCard`, `ContinueDialogRow`, `DiscoveryPreviewCard`, `DiscoveryMosaicCard`, `HeroRow`, `DiscoverBrandsRow` (bara dess hook används), `CollectionRow`.
- Vågkantkoden i `EdgeFade`/`theme/glass.ts` och dev-växlarna (avskriven 2026-11-19).
- `TEMP-DEBUG-GEST` (gestdiagnos bakom `__DEV__`) i `app/product/[id].tsx` och dev-sidan: ta bort när gesterna är godkända på enhet.
- Tokens `success`/`warning`/`successSubtle` används bara av dialogen, `CardShowcase` och `ClusterCard`.
- `app.json` saknar `scheme` (varning från Linking i Metro).
- Oanvänd import `Image` i `app/product/[id].tsx`.
- `ProductGrid` lägger varannan produkt i varje kolumn (inte kortaste kolumn, som Följers masonry).
- Fem produkter har tillfälligt långa testnamn (`// TESTDATA` i `data/products.ts`).
- Expo Gos lagring delas mellan utvecklingsservrar: testdata och temaval från tester kan synas i Daniels app (rensas efter varje test).

## Senare — Fas 1 och framåt (byggs inte i Fas 0)
Supabase-projekt och schema (collections, collection_items, follows) · konton · följa andra användare och Profildetalj · riktig personalisering · tracking och provision · första riktiga återförsäljaren · admin för handlare · DPP

## Öppna beslut
- [x] Mål och "klart när" bekräftade (2026-11-17)
- [ ] Hosting: Supabase i Fas 1, och proxyn för API-nyckeln före demo?
- [ ] Schemajämförelse (researchloggen) före Fas 1
- [x] "Område" = kategori eller stil med kurerat innehåll (2026-11-18)
- [x] Filterstil: text-flikar med understrykning (2026-11-18). Pillar behålls med annan funktion, se design.md avsnitt 11
- [ ] Ljust glas över ren yta syns inte: använd surface + kant + skugga där, glas bara över foto?
- [x] Pillens funktion: byter innehåll överst på Hem. Text-flikar filtrerar i listor (2026-11-18)
- [ ] Ljust foto-glas över mörka bilder i ljust tema (Daniel, 2026-11-18). Pausat, bedöms på enhet.
- [x] Vågig toppkant: avskriven 2026-11-19. Kvar att städa (se Teknisk skuld).
- [x] Toppen på sidor med bild överst: bara blur, svag statusfältstint i mörkt läge (2026-11-26, design.md §3).
- [ ] Ersätt iOS native top edge effect på flikskärmarna (`scrollEdgeEffects.top: 'hidden'`) med egen EdgeFade.
- [ ] Initialkrock "AV" (Ateljé Väst / Andra Varvet) — gäller den gamla katalogen, troligen inaktuell.
- [ ] Looken A i Claude Design saknar Produktdetalj-avvikelserna (design.md §8b).
- [ ] Hitta: hur ser urval och jämförelse ut i dialogen?
- [x] ia-karta och wireframes justerade till flikrollerna (2026-11-26).
- [x] Hållbarhetsindex när data saknas: "Ej redovisat" (Daniel 2026-11-27, brief 70). Övriga Spec-punkter i `docs/spec-forslag.md`.
- [ ] Fyllda former i `company-add`/`company-check` (avsiktligt eller rita om som linjer?), rapport 67.
- [ ] Ska förvalt följda områden (`defaultFollowed`) användas? I dag följs alla Kroona-samlingar förvalt men inga områden.

## Spelregler
1. **Ett spår åt gången.** Nytt spår startar när det gamla är klart eller uttryckligen pausat.
2. **Ny idé → idébanken**, inte hit. Den flyttas hit först när Daniel prioriterar den.
3. **Fas-koll:** hör det till Fas 1+? Flagga och bygg inte.
4. **Commit efter varje godkänd Code-runda** (tsc/Metro).
5. **Sidospårsfråga innan varje session:** "Står detta i Nu/Näst?" Om inte, fråga Daniel.
