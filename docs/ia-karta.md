# Kroona — Informationsarkitektur

*Levande dokument. Alla skärmar/flöden oavsett fas, taggade med vilken fas de hör till. Syfte: den samlade bilden — vad finns, vad kopplar till vad, vad är kvar. Master ligger i repot (`docs/ia-karta.md`), projektet är en spegel.*

**Statuskoder:** ✅ Byggd · 🚧 Delvis byggd · ⬜ Ej byggd

*Uppdaterat 2026-11-18 — flikarnas roller ändrade (se produkt.md): **Hem** = hyllor med kort, **Följer** = uppdateringar från det man följer, **Hitta** = sök, dialog och kategorier (brief 53), **Sparat** = det man sparat och följer. Masonry-grid flyttar in i detaljvyerna. Följa (varumärke, företag, område, samling och — sedan brief 37 — person) byggs lokalt i Fas 0. Profildetalj för personer finns som dummy i Fas 0; social funktion är Fas 1+. Se även `Resan` (journey × flikar).*
*Tidigare: 2026-08-21 — detaljvyerna wireframade, Egna samlingar flyttad till Fas 0.*

**Område** = kategori eller stil med kurerat innehåll (t.ex. "Hemmakontor", "Skandinavisk stil").

---

## Fas 0 — Demo-appen (nuvarande scope)

| Skärm | Syfte | Kopplar till | Status |
|---|---|---|---|
| **Hem** | Samlingspunkt, som Spotify: topp (avatar, logotyp, notiser, hälsning "God …, Daniel", brief 46), fältet "Vad är du intresserad av idag?" (öppnar Sökläget, brief 53), filterpillar direkt över innehållet (ordning brief 63), sedan hyllor (brief 43): Fortsätt där du var · Skapat för dig · Samlingar för dig · Fler i din stil (varumärken + personer) · Områden · Populära samlingar · Kanske intressant för dig. Inga produkter i grid. | Samling-, Partner-, Profil- och Produktdetalj, Hitta | ✅ Hyllor byggda (brief 43). Kvar: filterpillarna filtrerar inget, notisskärmen saknas (klockan gör inget), mixar saknar destination (Områden öppnar Områdesdetalj sedan brief 54), hyllström/rankning egen brief. "Du följer" flyttad till Sparat → Följer. |
| **Följer** | Pinterest-flöde (brief 59): det man följer (samlingar, varumärken/butiker, områden, personers samlingar) och inspiration som liknar det, blandat jämnt och omblandat vid öppning och pull-to-refresh. Rubrik + vyväljare (masonry / en kolumn, hålls under sessionen), filterpillar (Alla, Kläder, Möbler, Begagnat + följda områden). Tomläge när man inte följer något: "Följ något som du gillar", fyra områdeskort och "Se alla områden". | Produktdetalj (från båda vyerna), Områdesdetalj och Alla områden (tomläget) | ✅ Fas 0 dummylogik (brief 59). Fas 1+: riktig rekommendation, uppdateringskort, oändlig scroll (visar högst 40). |
| **Hitta** | Hitta produkter på tre sätt (brief 53): **fritextsök** (träffar direkt), **dialog** (AI-hjälp, med eller utan avgränsning) och **kategorier** (brief 54). Startsida: rubrik, fältet "Fråga eller sök", hyllorna Idéer för dig · Kategorier · Områden och stilar. AI:n har inget namn i UI. | Sökläge, Sökresultat, Dialog | ✅ Fas 0 (brief 53, 54). Kvar: jämförelse, undernivåer i kategorier |
| **Sökläge** (`app/search.tsx`) | Aktivt fält: "Sök efter ”ord”" → Sökresultat, "Fråga om ”ord”" → Dialog, förslag (typer, områden, samlingar) eller senaste sökningar (lokalt, max 5). Nås från fältet på Hem, Hitta och Sökresultat. | Sökresultat, Dialog | ✅ Fas 0 (brief 53) |
| **Sökresultat** (`app/results.tsx`) | Träffar för en sökning eller en idé: fält, pillar Alla/Nytt/Begagnat, antal, banner "Osäker på vad du behöver?" → Dialog med avgränsning, produktgrid. Lokal sökning utan backend (`lib/search.ts`). | Produktdetalj, Dialog, Sökläge | ✅ Fas 0 (brief 53). Pris och Stil ej byggda |
| **Kategorivy** (`app/category/[id].tsx`) | Kläder, Möbler eller Begagnat (`data/categories.ts`): rubrik, "Fråga om …" → Dialog med kategorin som scope, antal, pillar (Möbler: typer; Kläder: kön, eftersom typ saknas för kläder; Begagnat = skick: Kläder/Möbler), produktgrid. Nås från Kategorier på Hitta och Alla kategorier. | Dialog, Produktdetalj | ✅ Fas 0 (brief 54) |
| **Alla kategorier** (`app/categories.tsx`) | En rad per kategori (bild 56, namn, antal, chevron). Inga undernivåer. "Visa fler" på Kategorier (Hitta). | Kategorivy | ✅ Fas 0 (brief 54). Undernivåer senare |
| **Alla områden** (`app/areas.tsx`) | Alla områden i 2-kolumnsgrid. "Visa fler" på Områden (Hem) och Områden och stilar (Hitta). | Områdesdetalj | ✅ Fas 0 (brief 54) |
| **Områdesdetalj** (`app/area/[id].tsx`) | Rubrik, beskrivning, Följ (lokalt, samma mekanism som samlingar; syns i Sparat → Följer → Områden), antal, produktgrid. Från områdeskorten på Hem och Hitta. | Produktdetalj | ✅ Fas 0 (brief 54) |
| **Idéer** (`app/ideas.tsx`) | Alla idékort i en kolumn. "Visa fler" på Idéer för dig (Hitta). | Sökresultat | ✅ Fas 0 (brief 54) |
| **Dialog** (`app/dialog.tsx`) | Chatten som tidigare låg i Hitta-fliken, nu egen stackskärm utan flikfält. Params `query` (första frågan) och `scope` (avgränsning, visas som pill och styr systemprompten). Startförslag när den är tom. | Produktdetalj | ✅ Fas 0 (brief 53). Röst och historik ej byggda |
| **Sparat** | Det man sparat och följer. Flikar Mina samlingar \| Följer. "Sparade produkter" (specialrad, inte en samling) först, sedan egna samlingar (rader/kort). Följer i sektioner. | Samlingsdetalj, Partnerdetalj | ✅ Ny struktur byggd (brief 35). Lägg till i samling, redigera/radera och Personer ej. |
| **Produktdetalj** | Fördjupning: hållbarhet, begagnat och nytt, liknande produkter, spara. Nav för stegen Jämför och Köp. | Från alla produktkort | ⬜ Wireframe klar (wireframes.md avsnitt 1) |
| **Samlingsdetalj** | Innehåll i en stil-/temasamling eller egen samling, med masonry-grid. Följ/Avfölj, eller Dela/redigera för egna. | Från samlingskort, Sparat | ✅ Byggd för kuraterade samlingar (brief 28, `app/collection/[id].tsx`). Kurator: Kroona (teman) eller varumärke (kollektioner), brief 29. Egna samlingar och "Sparade produkter" ("Av dig", ingen Följ), brief 32/35. |
| **Partnerdetalj** | Varumärkes-/återförsäljarprofil: värdegrund, geografisk närvaro, produktgrid. Följ/Avfölj. | Från varumärkescirklar (Hem: Fler i din stil), Sparat → Följer och kuratorraden i Samlingsdetalj | ✅ Byggd för varumärken (brief 29, `app/partner/[id].tsx`) med Samlingar-hylla. Sedan brief 48 öppnas även butiker och andrahandstjänster ("Om butiken" / "Om tjänsten", produkter via erbjudanden). |
| **Profildetalj** | En person: avatar, namn, @handle, följare, bio, Följ, hyllan Samlingar (personens publika samlingar). | Från Följer (Personer), kuratorraden i Samlingsdetalj, ProfileCard | ✅ Fas 0 dummy (brief 37, `app/profile/[id].tsx`). Social funktion Fas 1+. |
| **Följa (lokalt)** | Följ varumärke, företag, område eller samling. Lagras lokalt, några förvalda i demot. | Följer, Sparat | ⬜ Ny 2026-11-18 |
| **Egna samlingar** | Skapa/döpa/privat-publik/flytta produkter mellan samlingar | Sparat, Samlingsdetalj | 🚧 Skapa (namn, Privat/Publik) byggt, AsyncStorage (`UserCollectionsContext`, brief 32). Döpa om/radera/flytta i del 2. |
| **Onboarding** (5 steg) | Smakinsamling | Hem (första körning) | ⬜ Medvetet parkerad |

## Fas 1 — Första återförsäljaren + konto

| Skärm/funktion | Syfte | Status |
|---|---|---|
| Konto/inloggning | Krävs för cross-device, click_id-koppling | ⬜ |
| Riktig social funktion (konton, följarlistor, feed från personer, notiser, skapa profil) | Kräver att andra konton existerar | ⬜ Fas 1+. Att följa personer och Profildetalj finns som dummy i Fas 0 (brief 37). |
| Riktig personalisering | Kroona lär sig av vad man söker och jämför, användaren kan se och rensa | ⬜ Fas 0 har bara lokal dummy |
| Chatthistorik/arkiv (Hitta) | Spara, lista, återuppta konversationer | ⬜ |
| Riktiga publika samlings-URL:er | Delning utan app | ⬜ |
| Återförsäljardashboard | Provision, attribution | ⬜ |
| Push/retention | Prissänkning, nya produkter i följd samling | ⬜ |
| Säkerhetsskuld | Anthropic-nyckel bort från klienten | ⬜ **Före publik distribution** |

## Fas 2+ — Skalning

| Idé | Status |
|---|---|
| Socialt lager (t.ex. "nyligen aktiva profiler") | 💡 Idé, se idebank |
| Önskelistor (som GoWish) | 💡 Senare |
| Internationalisering | Arkitektur förberedd, ej aktiverad |

---

## Öppna frågor
- Flikroller: **avgjorda 2026-11-18** (se överst och Resan). Wireframes för Hem, Följer och Sparat behöver göras om.
- Hem: hyllordning och korttyper avgjorda i brief 43. Öppet: oändlig hyllström och rytmregel, ClusterCards plats.
- Följa: var ligger "följ"-knappen på produktkort, om alls?
