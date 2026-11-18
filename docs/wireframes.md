# Kroona — Wireframes

*Levande dokument. Fidelity-nivå mellan ia-karta.md (vilka skärmar finns) och designsystem.md (hur komponenterna ser ut). Grovt innehåll per skärm, journey-optimerat. Statuskoder: ✅ Klar · 🟡 Provisorisk · 🚧 Pågående · ⬜ Ej påbörjad · ⏸ Parkerad. Master i repot (`docs/wireframes.md`), projektet är en spegel.*

> **Uppdaterat 2026-11-18.** Flikarnas roller ändrades (se produkt.md och Resan): Hem = hyllor, Flöde = det man följer, Hitta = dialog med urval och jämförelse, Sparat = sparat och följt. Avsnitt 4 (Profil), 5 (Hem), 6 (Flöde), 7 (Hitta) och 8 (Sparat) är justerade nedan. Avsnitt 1–3 gäller oförändrade. Hem, Flöde och Sparat behöver wireframas om i detalj när de är på tur.

---

## Bakgrund — varför detaljvyerna kom först
Nästan varje kort i alla flikar pekar mot en detaljvy, så detaljvyerna wireframades före flikarna. Produktdetaljen ledde till datamodellen Produkt / Erbjudande (spec v1.13–v1.14).

---

## 1. Produktdetalj — ✅ Wireframe klar
**Nås från:** alla produktkort. Är navet för stegen Jämför och Köp (se Resan).

1. Hero-bild — produktens kanoniska bild
2. Varumärke + produktnamn
3. Hållbarhetsindex — fullt utfällt, oförändrat oavsett erbjudande
4. Spara-knapp, primär position
5. **"Finns begagnad hos"** — begagnat-erbjudanden, visas FÖRE nytt. Rad: tjänst, prisläge ("Fast pris: X kr" eller "Auktion, bud från X kr"), länk ut.
6. **"Köp hos"** — nytt-erbjudanden: AF-namn, pris, lager, geografi. Sortering, default pris. Påverkar aldrig begagnat-listan.
7. Liknande produkter — horisontell rad

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
3. Metadata: antal produkter, kurator (Kroona eller användare), privat/publik för egna
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
6. Produktgrid — masonry

---

## 4. Profildetalj (identitet) — ⏸ Parkerad, Fas 1+
Man följer varumärken, företag, områden och samlingar, inte andra användare. Profildetalj för personer väntar tills konton finns. Varumärkesidentitet täcks av Partnerdetalj.

**Bevarad wireframe (gäller när konton finns):** nås från ProfileCard. Visar profilens samlingar, inte produkter direkt (Profil → Samlingar → Produkter, Pinterest-mönster). Avatar och namn · antal samlingar och följare · Följ-knapp · kort bio · grid av samlingar som länkar till Samlings- eller Partnerdetalj. Öppet: hur varumärkes- och användaridentitet skiljs åt i samma mall.

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

## 8. Sparat — 🟡 Utökat med följda
**Roll:** det man sparat och följer, där man hanterar det.

1. Header — "Sparat" + ny samling
2. Samlingar (2 kolumner): **"Gilla"** alltid först och kan inte raderas eller döpas om. Övriga: namn, privat/publik, antal produkter. "Ny samling" sist.
3. **Följer** (nytt): varumärken, företag, områden och samlingar man följer, med möjlighet att sluta följa. Layout öppen (egen sektion eller eget segment).

Att öppna en samling leder till Samlingsdetalj (Dela/redigera-läge). Att öppna ett varumärke leder till Partnerdetalj. Lagras lokalt i Fas 0.

---

## Konsekvenser för andra dokument
- **produkt.md, plan.md, ia-karta.md** uppdaterade 2026-11-18.
- **designsystem.md** — FilterPills: stilfrågan (pill eller text-flik med understrykning) är öppen. Se plan.md.
- **Spec** — flikroller och Profildetalj avviker. Justeras vid tillfälle.
