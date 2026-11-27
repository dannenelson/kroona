# 74 – Samlingens hero som företagsprofilens, antal följare, ⋯-meny

Fas 0. Dummydata, ingen riktig social funktion. Fyra delar, committa per del, tsc/Metro grönt. Skiss: Daniels handskrivna wireframe 2026-11-27 (tillbaka uppe till vänster, actions uppe till höger, rubrik/logotyp och "vad av vem" nere till vänster, Följ och antal följare nere till höger).

## Beslut bakom (Daniel, 2026-11-27)

- Samlingsdetaljens hero får samma uppbyggnad som företagsprofilens: innehållet ligger över bilden i underkant.
- Antal följare visas under Följ-knappen, på samlingar och företagsprofiler (ersätter "inget antal i hero", brief 65).
- Både samlingsdetalj och företagsprofil får en ⋯-meny uppe till höger. Menyn fylls på senare, börja med det som står nedan.
- Antalet är dummydata (riktig social funktion är Fas 1+). Det räknas upp med 1 när användaren själv följer.

## Inventera först

1. `components/ProfileHero.tsx` och hur Samlingsdetalj (`app/collection/[id].tsx`) och Partnerdetalj (`app/partner/[id].tsx`) använder den idag: vad som ligger i hero, vad som ligger under (raden "Av <kurator>", "Produkter · N").
2. Var TopBar-åtgärder ligger idag på de två sidorna (Dela m.m.) och vad som finns i meny för egna samlingar i Sparat (`AnchoredMenu`, brief 70).
3. Datamodellen: finns `followers` på `Person`; saknas det på `Retailer` och `Collection`.
Rapportera kort om något avviker.

## Del 1: Hero på Samlingsdetalj

Hero (samma höjd, parallax, toning som idag) med, längst ned över bilden:
- **Vänster:** samlingens logotyp (`COLLECTION_LOGOS`) eller titeln som text, högst två rader (`display`/titelstilen som idag), därunder raden "vad av vem" i `label` med `overlay.onPhotoMuted`:
  - Kroonas teman: "Tema av Kroona"
  - Företagets kollektioner: "Kollektion av <företag>"
  - Personers publika samlingar: "Samling av <namn>"
  - Egen privat samling: `lock` (12–14, samma färg som texten, 4–6 px före texten) + "Privat samling av dig"
  - Egen publik samling: "Publik samling av dig"
- **Höger:** Följ/Följer-pillen (glas, foto, som idag) och under den "<N> följare" i samma textstil som raden till vänster, så att antalets baslinje ligger på samma rad som "vad av vem". Egna samlingar: ingen Följ och inget antal.
- Titeln får aldrig gå in under Följ-blocket (begränsa bredden).
- Raden "vad av vem" är tryckbar och öppnar kuratorns profil (Partnerdetalj eller Profildetalj) som "Av …" gjorde. Egna samlingar och Kroona: inte tryckbar.
- Ta bort raden "Av <kurator>" och undertexten "Tema/Kollektion/Privat" under respektive i hero, nu när informationen ligger i raden ovan. "Produkter · N" och filterflikarna ligger kvar under hero.

## Del 2: Antal följare

- Lägg `followers` (dummy) på `Retailer` och `Collection`, markerat DUMMYDATA, realistiska och olika siffror (hundratal till några tusen; Kroonas teman störst). `Person.followers` finns redan.
- Visas som "1 240 följare" (svensk tusentalsavgränsare med hårt mellanslag) och "1 följare".
- Visat antal = dummysiffran + 1 om användaren följer, och siffran uppdateras direkt när man följer eller slutar följa (hero och, om det finns, andra ställen där antalet visas). Förvalt följda samlingar: dummysiffran är exklusive användaren, så de visar +1.
- Företagsprofilen (`ProfileHero`): antalet står under Följ-pillen längst ned till höger, på samma rad som områdesraden till vänster. Övrig hero oförändrad.
- Profildetaljen (person) rörs inte.

## Del 3: ⋯-meny uppe till höger

- Samlingsdetalj och Partnerdetalj får en ⋯-knapp (`more-horizontal`, glas som övriga topp-knappar) uppe till höger. Använd `AnchoredMenu` (brief 70).
- **Egen samling:** Byt namn, Redigera innehåll, Dela, Ta bort samling (samma val och samma flöden som i Sparat, återanvänd koden, inga dubbletter).
- **Andras samling och företagsprofil:** Dela (platshållare, snackbaren "Delning kommer senare") och Följ/Sluta följa <namn> (samma `useFollowToggle` som i brief 73, med snackbar, eftersom det är ett menyval). Menyn är medvetet kort och fylls på senare.
- Flytta ev. befintlig Dela-ikon i toppen in i menyn så att inte två Dela-ställen finns.

## Del 4: Dokument

Uppdatera design.md (hero), designsystem.md (§23: heron, antal följare, meny), wireframes.md §2 och §3, ia-karta.md och plan.md. Notera i produkt.md under Fas 1+ att följarantal är dummy i Fas 0.

## Gör inte

- Ingen riktig följarräkning, inga följarlistor (Fas 1+).
- Ingen ⋯ på Profildetalj för person.
- Rör inte produktgrid, flikar eller sektionerna under hero.

## Verifiering

tsc och Metro gröna. Skärmdumpar ljust och mörkt: Kroonatema ("Tema av Kroona"), företagskollektion, personsamling, egen privat samling (med lås), egen publik, och företagsprofilen med antal. Titel på två rader. Följ → antalet +1. ⋯-menyn på egen samling och på företagsprofil (nära skärmkant uppe).
