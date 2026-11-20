# Brief 29: Partnerdetalj + kurator på samlingar

Fas 0. Kör autonomt (auto mode). Rapport till `docs/briefs/29-rapport.md`. Committa (inkl. briefen) och pusha efter verifiering (tsc + iOS-export). Inga debug-rester, döda inte Daniels Expo-server. Inventera befintliga filer först (skriv inte över).

## Beslutad modell (Daniel, 2026-11-20)
- **Samling** = kuraterad produktuppsättning med en **kurator**: Kroona (teman, editorial som Spotify-spellistor), ett varumärke (kollektioner) eller en användare (egna samlingar, byggs senare).
- **Varumärke** är en egen entitet (finns redan som `Retailer`, `retailerType: 'brand'`, med description/values/presence) med en egen sida: **Partnerdetalj**. Den bär en hylla med varumärkets egna samlingar och alla dess produkter.
- Idag är "J.Lindeberg"/"Filippa K" i `data/collections.ts` varumärkes-filter förklädda till samlingar. De ska bli riktiga Partnerdetaljer. Samlingarna ska vara teman, kollektioner eller egna.
- Att varumärken själva skapar samlingar (partnerverktyg) är Fas 1+. I Fas 0 är det dummydata för att visa pilotpartners.

## Scope
1. **Datamodell (minsta möjliga):** `Collection` får `curator: { kind: 'kroona' | 'retailer' | 'user'; id?: string }`. Befintliga teman = kroona. Lägg 2–3 dummykollektioner för J.Lindeberg och Filippa K (egna namn, bild, delmängd av deras befintliga produkter, kurator retailer). Märk dem "DUMMYDATA (Fas 0)". Hitta inte på nya fält utöver det.
2. **`app/partner/[id].tsx`** enligt `docs/wireframes.md` §3, uppifrån: cover/logotyp med namn (samma toppkant, EdgeFade, glasknappar som Produktdetalj/Samlingsdetalj) · Följ/Avfölj (följ-målet är `{kind:'retailer'}`) · Om varumärket (beskrivning och värdegrund från datan) · geografisk närvaro (e-handel, ev. butiker) · antal produkter · **hylla "Samlingar"** med varumärkets kollektioner (kort som öppnar Samlingsdetalj med zoom) · produktgrid (masonry, `ProductGrid`/`ProductCard`). Saknas data: hoppa över sektionen, hitta inte på. `Transition.ScrollView` som i övriga detaljvyer.
3. **Rörelse:** samma hierarki och samma parametriserade transition-options som Produkt- och Samlingsdetalj (återanvänd, kopiera inte). Egen boundary-grupp vid behov. Kontrollera djup: Hem → Partner → Samling → Produkt → ny Produkt, och stängning steg för steg.
4. **Ingångar:** varumärkeskort (`PartnerCard` variant `brand`, `DiscoverBrandsRow`, "Du följer" där ett varumärke visas) öppnar Partnerdetalj i stället för Samlingsdetalj. Teman öppnar fortsatt Samlingsdetalj. Rensa bort varumärkes-filtersamlingarna ur `COLLECTIONS` om de blir oanvända, men bara om inget bryts (följlagring, Flöde, personalisering): annars lämna kvar och flagga.
5. **Samlingsdetalj:** lägg till en kuratorrad i metadata ("Av Kroona" / "Av J.Lindeberg"). För varumärkeskurator öppnar raden Partnerdetalj. Inget mer ändras där.
6. Följ: använd befintlig följ-lagring. Rätta inte det flaggade "alla följs från början" här, utan nämn i rapporten om Partnerdetalj påverkas.
7. Mörkt och ljust tema, tokens för allt, reduce motion, ingen backend/tracking.

## Utanför scope (flagga, bygg inte)
Partnerverktyg för att skapa samlingar, egna användarsamlingar och dela/redigera, Sparat, Hem/Flöde-omarbetning, butiker/andrahandstjänster som Partnerdetalj-variant (bara `brand` nu), kartor/butikslista.

## Dokument (repo docs är master)
Uppdatera `docs/wireframes.md` (§2 kurator, §3 Samlingar-hylla), `docs/ia-karta.md` (Partnerdetalj byggd, kurator), `docs/produkt.md` (datamodell: kurator, varumärke ↔ samling), `docs/design.md` (rörelse), `docs/plan.md` (status). Skriv i rapporten en kort lista över ändringar som behöver speglas i Claude Project-dokumenten (Spec/Sammanställning) så att Daniel/Claude kan uppdatera dem.

## Definition klar
Tryck på ett varumärke → Partnerdetalj (zoom), med Följ, Om, närvaro, Samlingar-hylla, grid. Tryck på en kollektion → Samlingsdetalj med kuratorrad "Av <varumärke>". Produkt i grid → Produktdetalj. Allt stänger steg för steg. Rapporten redovisar alla beslut.
