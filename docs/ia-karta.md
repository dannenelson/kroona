# Kroona — Informationsarkitektur

*Levande dokument. Alla skärmar/flöden oavsett fas, taggade med vilken fas de hör till. Syfte: den samlade bilden — vad finns, vad kopplar till vad, vad är kvar. Master ligger i repot (`docs/ia-karta.md`), projektet är en spegel.*

**Statuskoder:** ✅ Byggd · 🚧 Delvis byggd · ⬜ Ej byggd

*Uppdaterat 2026-11-18 — flikarnas roller ändrade (se produkt.md): **Hem** = hyllor med kort, **Flöde** = uppdateringar från det man följer, **Hitta** = dialog, urval och jämförelse, **Sparat** = det man sparat och följer. Masonry-grid flyttar in i detaljvyerna. Följa (varumärke, företag, område, samling) byggs lokalt i Fas 0. Profildetalj (andra användare) flyttad till Fas 1+. Se även `Resan` (journey × flikar).*
*Tidigare: 2026-08-21 — detaljvyerna wireframade, Egna samlingar flyttad till Fas 0.*

**Område** = kategori eller stil med kurerat innehåll (t.ex. "Hemmakontor", "Skandinavisk stil").

---

## Fas 0 — Demo-appen (nuvarande scope)

| Skärm | Syfte | Kopplar till | Status |
|---|---|---|---|
| **Hem** | Samlingspunkt, som Spotify: hälsningshero, sedan hyllor med kort (samlingar, varumärken, områden, rekommendationer). Inga produkter i grid. | Samling-, Partner- och Produktdetalj, Hitta | 🚧 Gammal struktur byggd, ska göras om till hyllor |
| **Flöde** | Uppdateringar från det man följer (varumärken, företag, områden, samlingar) | Produktdetalj, Partner- och Samlingsdetalj | 🚧 Grundversion byggd med gammal roll (blandat upptäcktsflöde), ska omarbetas |
| **Hitta** | Dialog som hjälper att bolla och få ett urval, plus jämförelse. Valen (pris, hållbarhet m.m.) är en del av dialogen. | Produktdetalj | ✅ Byggd. Kvar: produktkort länkar till Produktdetalj |
| **Sparat** | Det man sparat och följer. Egna samlingar, "Gilla" alltid först, hantera följda. | Samlingsdetalj, Partnerdetalj | 🚧 Gilla-listan byggd, samlingar och följda ej |
| **Produktdetalj** | Fördjupning: hållbarhet, begagnat och nytt, liknande produkter, spara. Nav för stegen Jämför och Köp. | Från alla produktkort | ⬜ Wireframe klar (wireframes.md avsnitt 1) |
| **Samlingsdetalj** | Innehåll i en stil-/temasamling eller egen samling, med masonry-grid. Följ/Avfölj, eller Dela/redigera för egna. | Från samlingskort, Sparat | ⬜ Wireframe klar (avsnitt 2) |
| **Partnerdetalj** | Varumärkes-/återförsäljarprofil: värdegrund, geografisk närvaro, produktgrid. Följ/Avfölj. | Från PartnerCard | ⬜ Wireframe klar (avsnitt 3) |
| **Följa (lokalt)** | Följ varumärke, företag, område eller samling. Lagras lokalt, några förvalda i demot. | Flöde, Sparat | ⬜ Ny 2026-11-18 |
| **Egna samlingar** | Skapa/döpa/privat-publik/flytta produkter mellan samlingar | Sparat, Samlingsdetalj | ⬜ Lokal AsyncStorage-modell (spec avsnitt 3) |
| **Onboarding** (5 steg) | Smakinsamling | Hem (första körning) | ⬜ Medvetet parkerad |

## Fas 1 — Första återförsäljaren + konto

| Skärm/funktion | Syfte | Status |
|---|---|---|
| Konto/inloggning | Krävs för cross-device, click_id-koppling | ⬜ |
| Profildetalj och följa andra användare | Kräver att andra konton existerar | ⬜ Flyttad hit 2026-11-18 |
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
- Flikroller: **avgjorda 2026-11-18** (se överst och Resan). Wireframes för Hem, Flöde och Sparat behöver göras om.
- Hem: antal hyllor och korttyper, och ClusterCards plats, är öppna.
- Följa: var ligger "följ"-knappen på produktkort, om alls?
