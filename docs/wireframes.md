# Kroona — Wireframes

*Levande dokument. Fidelity-nivå mellan ia-karta.md (vilka skärmar finns) och designsystem.md (hur komponenterna ser ut). Grovt innehåll per skärm, journey-optimerat. Statuskoder: ✅ Klar · 🟡 Provisorisk · 🚧 Pågående · ⬜ Ej påbörjad · ⏸ Parkerad. Master i repot (`docs/wireframes.md`), projektet är en spegel.*

> **Uppdaterat 2026-11-26** efter briefer 38–69: avsnitten beskriver det som är byggt. Flikroller (2026-11-18): Hem = hyllor, Följer = Pinterest-flöde av det man följer, Hitta = sök, dialog och kategorier, Sparat = sparat och följt. Nytt avsnitt 9: Profil, Notiser och Inställningar.

---

## Bakgrund — varför detaljvyerna kom först
Nästan varje kort i alla flikar pekar mot en detaljvy, så detaljvyerna wireframades före flikarna. Produktdetaljen ledde till datamodellen Produkt / Erbjudande (spec v1.13–v1.14).

---

## 1. Produktdetalj — ✅ Byggd (brief 13–22, 60, 62 och uppföljningar, `app/product/[id].tsx`)
**Nås från:** alla produktkort. Är navet för stegen Jämför och Köp (se Resan).

1. Hero-bild — produktens kanoniska bild
2. Varumärke + produktnamn
3. Hållbarhetsindex — fullt utfällt, oförändrat oavsett erbjudande
4. Spara-knapp (bokmärke, fyllt när sparad), primär position: tryck = snabbspar till Sparade produkter, långt tryck = kortet "Spara i …" (brief 41)
5. **"Finns begagnad hos"** — begagnat-erbjudanden, visas FÖRE nytt. Rad: tjänst, prisläge ("Fast pris: X kr" eller "Auktion, bud från X kr"), länk ut.
6. **"Köp hos"** — nytt-erbjudanden: AF-namn, pris, lager, geografi. Sortering, default pris. Påverkar aldrig begagnat-listan.
7. Liknande produkter — horisontell rad

**Byggd (brief 13), beslutade avvikelser från designen (Looken A):** hållbarhetsindex som siffra ("4,2 av 5") i faktatabellen · prisläge (Fast pris / Auktion, bud från) på begagnade rader · ingen sorteringskontroll i "Köp hos", pris stigande · inga pricksidor på hero (en bild per produkt) · Spara = fylld ikon och "Sparad", ingen inverterad yta · priset överst = "Från lägsta pris" (med "Begagnat" om lägst är begagnat). Tryck på en erbjudanderad ger haptik och en toast ("Du skulle nu gå till …"), ingen utlänk i Fas 0.

**Sedan brief 70–71:** toppbarens högra knapp är **mer (⋯)** med en förankrad meny: Spara i samling, Följ/Sluta följa varumärke (när märket har profil), Dela (platshållare), Visa liknande (scrollar till Liknande). Följ/Sluta följa i menyn bekräftas med snackbaren "Du följer <märke>" / "Du följer inte längre <märke>" (brief 73). Inget Spara-val, bokmärket på namnraden finns. Produkter utan index (testdata 4, 5, 7) visar "Ej redovisat" och inget löv på korten. Hållbarhetsindexet är tryckbart och öppnar **"Så räknar vi"** (fyra delposter, exempeldata); saknas index visas "Ej redovisat".

**Sedan brief 60–65:** märke (tryckbart till varumärkets profil om den finns), namn och **rund Spara-knapp** (bokmärke, samma glas som tillbaka/dela) på namnraden, pris, **betyg** direkt under ("☆ 4,1 (12 omdömen)"), sedan Hållbarhet (Hållbarhetsindex och fakta). Toppen: bara kantblur, svag statusfältstint i mörkt läge.

**Sedan brief 73:** rubrikerna har en liten ikon framför texten: Hållbarhet (löv), Finns begagnad hos (återvinning), Köp hos (kasse), Liknande (bilder).

**Beslut:** Nytt/Begagnat ligger på Erbjudande. Flera begagnat-erbjudanden samtidigt. Prisläge undviker missvisande låga startbud. Begagnat före nytt.
**Öppet:** signal på produktkort för "finns begagnad". Hur begagnat inhämtas (integration eller manuellt i Fas 0).
**Förslag, ej beslutade (Resan):** "Fråga Kroona" direkt på produkten · tydlig info om företaget man stöttar.

---

## 2. Samlingsdetalj (tema/stil/egen samling) — ✅ Byggd (brief 28, gemensam hero brief 65 med tillägg)
**Nås från:** samlingskort på Hem och i Följer, och egna samlingar i Sparat. Samma vy för alla.

1. **Hero** (`ProfileHero`, samma som Partnerdetalj): lägre cover (60 % av 4:5) med parallax, svag toning; längst ned vänster **logotyp** (samlingar med logotyp) eller **titel**, raden **"vad av vem"** (brief 74: "Tema av Kroona", "Kollektion av <företag>", "Samling av <person>", "Privat samling av dig" med lås, "Publik samling av dig"; tryckbar till kuratorns profil), höger **Följ/Följer** och under den **"<N> följare"** (dummy, +1 när du följer; inte för egna samlingar). Uppe till höger **⋯**: egen samling Byt namn, Redigera innehåll, Dela, Ta bort samling; andras Följ/Sluta följa <namn>, Dela.
2. (Raden "Av <kurator>" under hero är borttagen i brief 74.)
3. "Produkter · N", text-flikar (Alla, kategorier, stilar, Nytt) och produktgrid.
4. **Egen samling, redigeringsläge** (från menyn i Sparat): rad per produkt med papperskorg, Klar avslutar.
5. **Önskelista** (brief 75): heroraden "Önskelista av dig" med gåva, ingen Följ och inget antal; ⋯ som för egna samlingar (Redigera = bara namn, "Ta bort önskelista"); tomläge "Önskelistan är tom".

**Ej byggt:** beskrivning (saknas i datan), ändra ordning, eget omslag.

---

## 3. Partnerdetalj (varumärke/återförsäljare) — ✅ Byggd (brief 29, 48, 65, 69)
**Nås från:** varumärkescirklar, PartnerCard, kuratorraden, märket på Produktdetalj. Varumärken, butiker och andrahandstjänster.

1. **Hero** (`ProfileHero`): lägre cover med parallax, svag toning; vänster **rund logotyp + namn** (initialer om logotyp saknas), under **områden** ("Kläder · Skandinavisk stil · Vintage", härledda ur produkterna); höger **Följ/Följer** och under den **"<N> följare"** (brief 74, dummy, +1 när du följer). Uppe till höger **⋯**: Följ/Sluta följa <namn>, Dela (brief 74).
2. "Om varumärket" / "Om butiken" / "Om tjänsten": beskrivning och värdegrund
3. **Hållbarhet** (brief 69–70, alltid): Hållbarhetsindex som faktarad (tryck öppnar "Så räknar vi"), eller **"Ej redovisat"** med en neutral rad när index saknas; certifikat som chips (tryck öppnar kort med förklaring) och hållbara initiativ som lista, var för sig bara när de finns.
4. Finns: e-handel, butiker och var
5. **Samlingar · N**: hylla med kollektioner
6. **Produkter · N**: produktgrid

**Sedan brief 73:** rubrikerna har en liten ikon framför texten: Om … (info), Hållbarhet (löv), Finns (kartnål), Samlingar (mappar), Produkter (produkt). Följ-pillen i hero får ingen snackbar; den byter själv till "Följer".

---

## 4. Profildetalj (person) — ✅ Fas 0 dummy (brief 37)
**Beslut 2026-11-20 (Daniel):** personer går att följa. I Fas 0 med dummypersoner och lokal följ-lagring; riktig social funktion (konton, följarlistor, feed från personer, notiser, skapa profil) är Fas 1+.

**Nås från:** Följer → Personer i Sparat, raden "Samling av <person>" i Samlingsdetaljens hero, ProfileCard (med person). Personernas samlingar syns under "Populära samlingar" på Hem.

1. Avatar (96, initialer), zoommål från raden/kortet
2. Namn, @handle, "N följare · M samlingar"
3. Kort bio
4. Följ/Följer
5. Hylla "Samlingar" (personens publika samlingar → Samlingsdetalj)

Varumärkesidentitet täcks av Partnerdetalj.
---

## 5. Hem — ✅ Byggd (brief 43–51, 63 och uppföljningar)
**Roll:** samlingspunkt som Spotify. Hyllor med kort; produktkort bara i "Kanske intressant för dig".

1. Topp: avatar (→ Profil), Kroona-logotyp, klocka (→ Notiser, prick vid olästa)
2. Hälsning som varierar efter tid på dygnet (lista i `lib/greetings.ts`, en slumpad rad per appstart, en rad)
3. Fältet "Vad är du intresserad av idag?" (→ Sökläget), sedan pillar Allt/Kläder/Möbler/Begagnat (filtrerar inget än)
4. **Fortsätt där du var:** senast använda dialoger, sökningar och egen samling, högst 4, mindre liggande kort (240 × 160) med typikon; utan bild en dämpad toning
5. Skapat för dig (mixar) · Samlingar för dig (stora kort, logotyp eller titel) · Fler i din stil (cirklar: företag och personer) · Områden (små kort) · Populära samlingar (kollage) · Kanske intressant för dig (produktkort)

**Öppet:** pillarnas filter, hyllström/rankning.

---

## 6. Följer — ✅ Byggd (brief 59, dummylogik)
**Roll:** Pinterest-flöde: produkter från det man följer (samlingar, varumärken och butiker, områden, personers samlingar) och inspiration som liknar det, blandade jämnt, i ny ordning vid öppning och pull-to-refresh.

1. Rubrik "Följer" och vyväljare (masonry / en kolumn, hålls under sessionen)
2. Pillar: Alla, Kläder, Möbler, Begagnat och följda områden
3. Masonry (produktkort M) eller en kolumn (produktkort L med bokmärke på namnraden)
4. Tomläge när man inte följer något: "Följ något som du gillar", fyra områden, "Se alla områden"

**Fas 1+:** riktig rekommendation, uppdateringskort, oändlig scroll (visar högst 40).

---

## 7. Hitta — ✅ Byggd (brief 53–54, 66 och uppföljningar)
**Roll:** hitta produkter på tre sätt: sök, dialog och kategorier.

1. Rubrik "Hitta", fältet **"Ställ en fråga eller sök"** och hjälpraden (→ Sökläget: "Sök efter …" eller "Fråga om …", förslag, senaste sökningar)
2. **Idéer för dig** (idékort → Sökresultat), Visa fler → Idéer
3. **Tidigare:** de 3 senaste dialogerna och sökningarna (ikon `stars`/`search`, "Dialog · Idag"), Visa fler → **Arkiv**
4. **Kategorier:** fyra kort 109 × 150 (Kläder, Möbler, Elektronik, Begagnat) i en rad som rullar i sidled, Visa fler → **Alla kategorier** (3-kolumnsgrid, A–Ö)
5. **Områden och stilar:** 2-kolumnsgrid, Visa fler → Alla områden

**Dialog** (egen skärm): med eller utan avgränsning (pill), startförslag, inline produktkort i två kolumner. Sparas lokalt när den fått ett svar och kan återupptas med hela historiken.
**Arkiv** (`app/archive.tsx`): Idag / Igår / Tidigare, pillar Alla / Dialoger / Sökningar, långt tryck Öppna/Ta bort, Rensa allt (bekräftas), tomläge med `history`.

**Ej byggt:** jämförelse i dialogen, röst (mikrofonen är bara ikon), sök i historiken (Fas 1+).

---

## 8. Sparat — ✅ Byggd (brief 35, 37, 61, 67, redigera samlingar 2026-11-26)
**Roll:** det man sparat och följer, där man hanterar det.

1. Header — "Sparat" + **"+"** uppe till höger (öppnar Sheet: Skapa samling). Ersätter "Ny samling"-kortet.
2. Flikar överst: **Mina samlingar | Följer**.
3. **Mina samlingar:**
   - **"Sparade produkter"** (hette Gillade produkter före brief 61) som egen specialrad överst: *inte* en samling. Bokmärket sparar dit, och en produkt kan ligga både där och i en samling.
   - Egna samlingar som **rader** (standard) eller **kort** (växlare). Mosaikomslag av de fyra första produkterna, namn, antal, Privat/Publik.
   - **Två sektioner (brief 75):** **Samlingar** och **Önskelistor** (den senare bara när det finns minst en). Önskelistor visar gåva och "Önskelista · N produkter". "N samlingar" räknar bara Samlingar.
4. **Följer** i sektioner, var och en med "Visa alla": **Varumärken**, **Personer** (brief 37, dummy), **Samlingar**, **Områden**.
5. Bekräftelser via Snackbar med fetstilta namn ("**<produkt>** lades till i **<samling>** · Visa", brief 61).

**Byggt (brief 35, Personer brief 37, Områden brief 54):** allt ovan. Rader: mosaikthumb 56/r14, "Privat · N produkter" med lås / "Publik · N produkter"; kortvy 2 kolumner; vy-valet sparas lokalt; "N samlingar" räknar bara egna. Följer: Varumärken (avatar 48, "N samlingar"), Samlingar (mosaik 48, "Av Kroona/<varumärke>"), max 3 + "Visa alla" som expanderar på plats. Följer: "Sluta följa" med följ-ikon efter typ (företag `company-check`, person `user-check`, brief 67). Tomlägen med wrap-knapp ("Skapa samling", "Utforska" → Hitta). Spara från produkt: se §8b (brief 40).

**Redigera egna samlingar (2026-11-26, lokalt):** långt tryck (lyfter tumnageln) eller **mer-knappen** (more-horizontal, förankrad meny vid knappen sedan brief 70) på raden → **Redigera** (brief 75: namn och "Håll samlingen privat"; önskelistor bara namn; tomt eller oförändrat går inte), **Redigera innehåll** (Samlingsdetalj i redigeringsläge), **Dela** (platshållare), **Ta bort samling** (systemets bekräftelse, destruktiv). Snackbar med fetstilta namn. **Ej byggt:** ändra ordning, eget omslag (idébanken).

**Skapa (brief 75):** "+" öppnar Skapa samling med typvalet **Samling | Önskelista** överst; Önskelista ger rubriken "Skapa önskelista" och växeln "Håll privat" på och låst ("Önskelistor är alltid privata. Du kan dela dem med andra senare."). Delning är Fas 1+.

Att öppna en samling leder till Samlingsdetalj ("Privat/Publik samling av dig" eller "Önskelista av dig", ingen Följ). Att öppna ett varumärke leder till Partnerdetalj. Lagras lokalt i Fas 0.

---

## 8b. Spara i … (kort-sheet) — ✅ Byggd (brief 40–41, ersätter Lägg till i samling från brief 36–39)
**Spara-flödet (Instagram-mönstret):** tryck på Spara (bokmärke) = snabbspar till Sparade produkter, med snackbar "**<produkt>** lades till i sparade produkter · **Ändra**" (Ändra öppnar kortet, så att långt tryck blir upptäckbart). Nytt tryck tar bort den: "**<produkt>** togs bort från sparade produkter" (brief 61). **Långt tryck** på Spara, menyvalet **"Spara i samling"** eller Ändra öppnar kortet; när det stängs "**<produkt>** lades till i **<samling>** · Visa".

1. Kort med luft runt om över mörk overlay; öppnas på 2/3 av skärmhöjden, växer till full höjd när man skrollar upp, krymper och stängs när man drar ned på listans topp (eller trycker på overlayen)
2. Rubrik "Spara i …" (vänsterställd) och högerställd textlänk **"Ny samling"** (neutral) → Skapa samling i samma kort (full höjd, chevron tillbaka); Spara skapar samlingen med produkten i, kortet stängs
3. Lista: **Sparade produkter** alltid överst (bokmärke, antal), sedan egna samlingar (mosaik 48, namn, "Privat/Publik · N produkter") och önskelistor (gåva, "Önskelista · N produkter"), med en liten etikett "Samlingar" / "Önskelistor" före varje grupp när båda finns (brief 75); val-cirkel till höger; tryck växlar direkt, flera går
4. Ingen CTA nedtill (blur kvar), ingen produktchip, sök eller X
5. Tomt läge: bara raden Sparade produkter; länken Ny samling finns kvar

Vid stängning, om något lagts till: snackbar "**<produkt>** lades till i **<samling>** · Visa" eller "… lades till i N samlingar · Visa" (→ Sparat). Bara borttagningar: ingen snackbar.

**Plus/minus-märke (brief 71):** snackbarens produktminiatyr får ett litet runt märke överst till höger: plus när produkten lades till (sparade produkter, samling, N samlingar), minus när den togs bort (sparade produkter, eller ur en samling i Redigera innehåll). Kort pop när snackbaren visas.
---

## 9. Profil, Notiser och Inställningar — ✅ Fas 0 dummy (brief 64)
**Profil** (`app/me.tsx`, från avataren, glider in från vänster): avatar DN, namn, @handle, räknare Följer/Sparade, rader Sparade produkter · Mina samlingar · Inställningar · Hjälp (platshållare "Kommer snart").
**Notiser** (`app/notifications.tsx`, från klockan, från höger): 7 dummynotiser, Idag / Tidigare, tomläge "Inga notiser än". Prick på klockan vid olästa, borta när sidan öppnats (gäller sessionen).
**Inställningar** (`app/settings.tsx`): Utseende (Ljust / Mörkt / System, sparas, gäller direkt), Notiser (växlar i appens palett, dummy), Om (version), Utvecklare (Komponenter (dev), bara i utvecklingsläge).

**Fas 1+:** konto, redigera profil, riktiga notiser och push.

---

## Konsekvenser för andra dokument
- **produkt.md, plan.md, ia-karta.md** uppdaterade 2026-11-26.
- **designsystem.md** — komponenterna för avsnitten ovan.
- **Spec** — avvikelserna samlas i `spec-forslag.md` (till Spec v1.20).
