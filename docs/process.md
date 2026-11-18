# Kroona — Process

*Hur vi arbetar, på en sida. Ändras sällan. Planen (`plan.md`) säger vad vi gör, det här säger hur. Senast: 2026-11-18.*

## Flödet
**Krav → Design → UX → Kod → Besiktning.** Ett steg i taget, och varje steg har en granskning innan nästa startar.

| Steg | Resultat | Granskas av | Hur |
|---|---|---|---|
| **Krav** | Rad i `produkt.md` eller `plan.md` | Claude | Utmanar mot spec och Fas 0-scope. Är det rätt sak att bygga nu? |
| **Design** | Tokens och komponentregler i `design.md`, bilder i Claude Design | Claude (design-skills) | Designkritik och tillgänglighet (kontrast, tryckytor) före handoff |
| **UX** | Flöden enligt `wireframes.md` | Daniel + Claude | Journey mot wireframe, provkörning i Expo Go |
| **Kod** | Brief i `docs/briefs/`, byggd av Claude Code | Claude Code + Claude | Plan Mode först. Efteråt kontrollerar Claude `tsc`, grep och diff mot briefen. |
| **Besiktning** | Appen på telefonen | Daniel | Mörkt och ljust läge, alla flikar |

**Skärmar före komponenter.** Look och känsla designas på hela skärmar med riktiga foton och godkänns visuellt av Daniel innan basskomponenter byggs i kod (lärdom från brief 03, 2026-11-18).

Före pilotdemot: en samlad granskning av hela appen (säkerhet, tillgänglighet, kod), med Ultracode eller motsvarande. Inte tidigare.

## Spelregler
1. **Ett mål per session.** Sväller det, delar vi upp det.
2. **Plan är sanningen.** Vi bygger det som står under Nu/Näst i `plan.md`. Annat får vänta.
3. **Ny idé → `idebank`**, inte planen. Den flyttas in först när Daniel prioriterar den.
4. **Brief före bygge.** Ingen kod utan en brief med "Klart när". Mall nedan.
5. **Verifiera, lita inte.** Rapporter från Code kontrolleras mot repot innan steget stängs.
6. **Commit efter varje godkänd runda.** Push gör Daniel (eller Code lokalt).
7. **Kort text.** Bilder, tabeller och punktlistor före långa stycken. Fördjupa bara på begäran.
8. **Fas-koll.** Hör det till Fas 1+ flaggas det och byggs inte.

## Källor till sanning
- **Repot (`docs/`)** är mastern. Projektet i Claude är en spegel som Claude uppdaterar.
- `produkt.md` (vad), `design.md` (utseende), `plan.md` (när), `briefs/` (uppdrag), `designsystem.md` (komponentkatalog).

## Briefmall
```
# Brief NN — Titel
Mål:            en mening
Läs först:      filer
Gör:            numrerade steg
Gör INTE:       det som lockar men inte hör hit
Klart när:      mätbara kontroller (tsc, grep, Metro, visuellt)
Rapportera:     vad som gjordes, egna beslut, fynd utanför uppgiften
```

## Verktyg
Claude Design (visuellt), Claude Code i Cursor (kod), Claude (krav, granskning, dokument). Skills: Expo, React Native och Supabase (Fas 1) för Code. Design-skills för Claude.
