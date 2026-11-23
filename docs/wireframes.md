# Kroona — Wireframes

*Levande dokument. Fidelity-nivå mellan ia-karta.md (vilka skärmar finns) och designsystem.md (hur komponenterna ser ut). Grovt innehåll per skärm, journey-optimerat. Statuskoder: ✅ Klar · 🟡 Provisorisk · 🚧 Pågående · ⬜ Ej påbörjad · ⏸ Parkerad. Master i repot (`docs/wireframes.md`), projektet är en spegel.*

> **Uppdaterat 2026-11-18.** Flikarnas roller ändrades (se produkt.md och Resan): Hem = hyllor, Flöde = det man följer, Hitta = dialog med urval och jämförelse, Sparat = sparat och följt. Avsnitt 4 (Profil), 5 (Hem), 6 (Flöde), 7 (Hitta) och 8 (Sparat) är justerade nedan. Avsnitt 1–3 gäller oförändrade. Hem, Flöde och Sparat behöver wireframas om i detalj när de är på tur.

---

## Bakgrund — varför detaljvyerna kom först
Nästan varje kort i alla flikar pekar mot en detaljvy, så detaljvyerna wireframades före flikarna. Produktdetaljen ledde till datamodellen Produkt / Erbjudande (spec v1.13–v1.14).

---

## 1. Produktdetalj — ✅ Wireframe klar · 🚧 Byggd i brief 13 (`app/product/[id].tsx`)
**Nås från:** alla produktkort. Är navet för stegen Jämför och Köp (se Resan).

1. Hero-bild — produktens kanoniska bild
2. Varumärke + produktnamn
3. Hållbarhetsindex — fullt utfällt, oförändrat oavsett erbjudande
4. Spara-knapp (bokmärke, fyllt när sparad), primär position: tryck = snabbspar till Gillade produkter, långt tryck = kortet "Spara i …" (brief 41)
5. **"Finns begagnad hos"** — begagnat-erbjudanden, visas FÖRE nytt. Rad: tjänst, prisläge ("Fast pris: X kr" eller "Auktion, bud från X kr"), länk ut.
6. **"Köp hos"** — nytt-erbjudanden: AF-namn, pris, lager, geografi. Sortering, default pris. Påverkar aldrig begagnat-listan.
7. Liknande produkter — horisontell rad

**Byggd (brief 13), beslutade avvikelser från designen (Looken A):** hållbarhetsindex som siffra ("4,2 av 5") i faktatabellen · prisläge (Fast pris / Auktion, bud från) på begagnade rader · ingen sorteringskontroll i "Köp hos", pris stigande · inga pricksidor på hero (en bild per produkt) · Spara = fylld ikon och "Sparad", ingen inverterad yta · priset överst = "Från lägsta pris" (med "Begagnat" om lägst är begagnat). Tryck på en erbjudanderad ger haptik och en toast ("Du skulle nu gå till …"), ingen utlänk i Fas 0.

**Beslut:** Nytt/Begagnat ligger på Erbjudande. Flera begagnat-erbjudanden samtidigt. Prisläge undviker missvisande låga startbud. Begagnat före nytt.
**Öppet:** signal på produktkort för "finns begagnad". Hur begagnat inhämtas (integration eller manuellt i Fas 0).
**Förslag, ej beslutade (Resan):** "Fråga Kroona" direkt på produkten · tydlig info om företaget man stöttar.

---

## 2. Samlingsdetalj (tema/stil/egen samling) — ✅ Wireframe klar
**Nås från:** samlingskort på Hem och i Flöde, och egna samlingar i Sparat. Samma vy för båda.
Innehållet kan vara heterogent, så filtrering ska vara generell. Här bor **masonry-gridden** (Pinterest-känslan).

**Åtgärdsknapp:** följd samling visar Följ/Avfölj. Egen samling visar Dela + redigera/radera.

1. Cover-bild, namn överlagt
2. Kort beskrivning (valfri)
3. Metadata: kurator ("Av Kroona", "Av <varumärke>" som öppnar Partnerdetalj, eller användare), antal produkter, tag; privat/publik för egna
4. Åtgärdsknapp
5. Filterrad, generisk facettering. Stil (pill eller text-flik) är **öppen**, se plan.md.
6. Produktgrid — masonry, återanvänder ProductCard

---

## 3. Partnerdetalj (varumärke/återförsäljare) — ✅ Wireframe klar
**Nås från:** PartnerCard. Kopplar till Återförsäljare i datamodellen. Platsen för värdegrundsprofil och geografisk närvaro (transparens).

1. Cover/logotyp
2. Följ-knapp
3. "Om varumärket": beskrivning och värdegrund
4. Geografisk närvaro: e-handel, eller fysiska butiker och var
5. Antal produkter
6. **Samlingar:** hylla med varumärkets egna kollektioner (kort som öppnar Samlingsdetalj)
7. Produktgrid — masonry

**Byggd (brief 29):** `app/partner/[id].tsx`, bara `brand`. Ordning i appen: cover med namn · antal produkter + Följ · Om varumärket (beskrivning, värdegrund) · Finns (e-handel, butiker) · Samlingar · Alla produkter.

---

## 4. Profildetalj (person) — ✅ Fas 0 dummy (brief 37)
**Beslut 2026-11-20 (Daniel):** personer går att följa. I Fas 0 med dummypersoner och lokal följ-lagring; riktig social funktion (konton, följarlistor, feed från personer, notiser, skapa profil) är Fas 1+.

**Nås från:** Följer → Personer i Sparat, kuratorraden "Av <person>" i Samlingsdetalj, ProfileCard (med person). Personernas samlingar syns under "Populära samlingar" på Hem.

1. Avatar (96, initialer), zoommål från raden/kortet
2. Namn, @handle, "N följare · M samlingar"
3. Kort bio
4. Följ/Följer
5. Hylla "Samlingar" (personens publika samlingar → Samlingsdetalj)

Varumärkesidentitet täcks av Partnerdetalj.
---

## 5. Hem — 🟡 Ny roll, behöver wireframas om
**Roll:** samlingspunkt som Spotify. Hyllor med kort, aldrig produktgrid. Tryck öppnar ett eget läge (Samlings-, Partner- eller Produktdetalj).

**Riktning (inte detaljerad):**
1. Kompakt hälsningshero ("God kväll [Namn]!")
2. Hyllor: fortsätt där du var · samlingar och områden · varumärken du kanske gillar · rekommendationer · inspiration (Pinterest-glimt med några bilder som öppnar en samling)
3. Rekommendationer följer det man aktivt sökt och jämfört (lokalt i Fas 0, dummy i demot)

**Tidigare struktur (byggd, gammal roll):** FilterPills, AskBar, ContinueDialogRow, CollectionsRow "Du följer", MixRow "Skapat för dig", RecommendedProductsRow, MixRow "Veckans mix", PopularCollectionsRow, DiscoverBrandsRow, DiscoveryMosaicCard, EditorialCard/HeroRow. Komponenterna kan återanvändas som hyllor.

**Öppet:** antal hyllor och korttyper. ClusterCards plats. Kategorifilter överst: behövs det?
**Förslag, ej beslutade:** "Varför ser jag detta?" på en hylla.

---

## 6. Flöde — 🟡 Ny roll, behöver wireframas om
**Roll:** uppdateringar från det man följer: varumärken, företag, områden (kategori eller stil med kurerat innehåll) och samlingar.

**Riktning:**
1. Kronologiskt flöde av nytt från det man följer (nya produkter, nya samlingar, prissänkningar)
2. Tom-läge: förslag på vad man kan följa. Demot startar med förvalda följda.
3. Pull-to-refresh och lazy-load kvarstår

**Tidigare (byggd, gammal roll):** masonry-grid som blandade det man följer med algoritmiska rekommendationer, text-flikar med understrykning som filter, lazy-load och pull-to-refresh.

**Öppet:** layout (kort, lista eller grid). Masonry är flyttat till detaljvyerna. Filterstil (pill eller text-flik).

---

## 7. Hitta — 🚧 Byggd, justeringar identifierade
Chatt med två dialoglägen och produktkort inline. Roll: bolla och få ett urval, plus jämförelse. Valen (pris, hållbarhet, cirkularitet) är en del av dialogen, inte inställningar i förväg. Kroona kan minnas vad man sökt, och användaren ska kunna se och rensa det.

- **Topprad:** tillbaka/meny, Arkiv och Ny chatt (Arkiv-funktion är Fas 1)
- **Tal:** mikrofon-ikon läggs in nu, funktionen är Fas 1+
- **Kompakta produktkort i dialogen** som länkar till Produktdetalj (fanns inte som destination när Hitta byggdes)
- **Kontextuell tillbaka:** från Produktdetalj tillbaka till chatten med bevarad konversation, inte till en flik
- **Öppet:** hur urval och jämförelse ser ut i dialogen (designfråga när Hitta är på tur)

---

## 8. Sparat — ✅ Ny struktur byggd (brief 35, skiss "Kroona Sparat – ny struktur", godkänd 2026-11-20)
**Roll:** det man sparat och följer, där man hanterar det.

1. Header — "Sparat" + **"+"** uppe till höger (öppnar Sheet: Skapa samling). Ersätter "Ny samling"-kortet.
2. Flikar överst: **Mina samlingar | Följer**.
3. **Mina samlingar:**
   - **"Gillade produkter"** som egen specialrad överst: *inte* en samling. Hjärtat sparar dit, och en produkt kan vara både gillad och i en samling.
   - Egna samlingar som **rader** (standard) eller **kort** (växlare). Mosaikomslag av de fyra första produkterna, namn, antal, Privat/Publik.
4. **Följer** i sektioner, var och en med "Visa alla": **Varumärken**, **Personer** (brief 37, dummy), **Samlingar**, **Områden**.
5. Bekräftelser via Snackbar ("<produkt> sparades i <samling> · Visa").

**Byggt (brief 35, Personer brief 37):** allt ovan utom Områden (ingen följ-lagring för områden än, sektionen döljs). Rader: mosaikthumb 56/r14, "Privat · N produkter" med lås / "Publik · N produkter"; kortvy 2 kolumner; vy-valet sparas lokalt; "N samlingar" räknar bara egna. Följer: Varumärken (avatar 48, "N samlingar"), Samlingar (mosaik 48, "Av Kroona/<varumärke>"), max 3 + "Visa alla" som expanderar på plats. Långt tryck: Öppna/Dela (egna), Öppna/Sluta följa (Följer). Tomlägen med wrap-knapp ("Skapa samling", "Utforska" → Hitta). Spara från produkt: se §8b (brief 40). **Ej byggt:** redigera/döp om/radera, ta bort produkt ur samling (i samlingsvyn), eget omslag.

Att öppna en samling leder till Samlingsdetalj ("Av dig", N produkter · Privat/Publik, ingen Följ; Dela/redigera kommer i del 2). Att öppna ett varumärke leder till Partnerdetalj. Lagras lokalt i Fas 0.

---

## 8b. Spara i … (kort-sheet) — ✅ Byggd (brief 40–41, ersätter Lägg till i samling från brief 36–39)
**Spara-flödet (Instagram-mönstret):** tryck på Spara (bokmärke) = snabbspar till Gillade produkter, med snackbar "… sparades i Gillade produkter · **Ändra**" (Ändra öppnar kortet, så att långt tryck blir upptäckbart). **Långt tryck** på Spara, menyvalet **"Spara i samling"** eller Ändra öppnar kortet. Ingen snackbar vid borttagning.

1. Kort med luft runt om över mörk overlay; öppnas på 2/3 av skärmhöjden, växer till full höjd när man skrollar upp, krymper och stängs när man drar ned på listans topp (eller trycker på overlayen)
2. Rubrik "Spara i …" (vänsterställd) och högerställd textlänk **"Ny samling"** (neutral) → Skapa samling i samma kort (full höjd, chevron tillbaka); Spara skapar samlingen med produkten i, kortet stängs
3. Lista: **Gillade produkter** alltid överst (bokmärke, antal), sedan egna samlingar (mosaik 48, namn, "Privat/Publik · N produkter"), val-cirkel till höger; tryck växlar direkt, flera går
4. Ingen CTA nedtill (blur kvar), ingen produktchip, sök eller X
5. Tomt läge: bara raden Gillade produkter; länken Ny samling finns kvar

Vid stängning, om något lagts till: snackbar "<produkt> sparades i <samling> · Visa" eller "… i N samlingar · Visa" (→ Sparat). Bara borttagningar: ingen snackbar.
---

## Konsekvenser för andra dokument
- **produkt.md, plan.md, ia-karta.md** uppdaterade 2026-11-18.
- **designsystem.md** — FilterPills: stilfrågan (pill eller text-flik med understrykning) är öppen. Se plan.md.
- **Spec** — flikroller och Profildetalj avviker. Justeras vid tillfälle.
