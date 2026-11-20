# Brief 35 – Sparat: omstrukturering

**Fas:** 0 (dummy, lokal lagring). **Mål (ett):** Bygg om Sparat-fliken enligt godkänd skiss "Kroona Sparat – ny struktur" och `docs/wireframes.md` §8. Ersätter brief 32:s upplägg.

Inventera först (saved.tsx, components/saved/, CollectionMosaic, contexts, Sheet, Button, Snackbar). Återanvänd, skriv inte om. Inga nya paket.

## 1. Header + flikar
- Titel "Sparat" (Familjen Grotesk) och **"+"** IconButton uppe till höger → öppnar befintligt Sheet-flöde "Skapa samling". Ta bort "Ny samling"-kortet helt.
- Text-tabs: **Mina samlingar | Följer** (TextTabs).

## 2. Mina samlingar
- Rad överst: **Gillade produkter** (hjärtikon i raised-ruta, antal produkter). Är en specialrad, INTE en samling. Ersätter "Alla sparade". Öppnar samma samlingsvy som idag (id `saved`) men med namnet "Gillade produkter". Byt `ALL_SAVED_NAME` och alla texter. Hjärtat sparar hit.
- Ta bort invarianten "produkt i samling finns även i Alla sparade". En produkt kan vara både gillad och i samling, men de är oberoende.
- Tunn avdelare, sedan egna samlingar.
- Rad: mosaikthumb 56 (r14), namn, undertext "Privat · N produkter" (lås-ikon 12 px) / "Publik · N produkter".
- Under tabs: vänster "N samlingar" (räknar bara egna), höger **vy-växlare** rader | kort (segmentkontroll, pill-bakgrund surface, aktiv raised). Default: rader. Val sparas i AsyncStorage.
- Kort-vy: 2 kolumner, kvadratisk mosaik-omslag r18, namn och undertext under. Gillade produkter först som kort med hjärta.
- Tryck → Samlingsdetalj (med zoom-transition som idag). Long-press → kontextmeny finns redan på samlingskort; om den saknas för rader, återanvänd samma komponent. Menyval nu: Öppna, Dela (snackbar "kommer snart"-beteende som idag). Redigera/radera = senare brief, bygg inte.
- Tomt läge (inga egna samlingar): kort text "Samla produkter du vill komma tillbaka till." + Button "Skapa samling" (wrap-bredd, aldrig full bredd).

## 3. Följer
- Inga stora kort. Sektioner med rubrik + "Visa alla" (visas bara vid >3):
  - **Varumärken**: rader med rund avatar 48, namn, undertext antal samlingar.
  - **Samlingar**: rader med mosaikthumb 48, namn, undertext "Av Kroona" / "Av <varumärke>".
  - **Områden**: rader (om data finns, annars dölj sektionen).
- Visa max 3 per sektion, "Visa alla" expanderar inline (ingen ny skärm).
- Tryck → Partnerdetalj / Samlingsdetalj. Long-press → kontextmeny med "Sluta följa".
- **Personer**: bygg INTE (Fas 1+). Flagga i rapporten att spec säger att användare inte följs och att ia-karta/spec behöver beslut.
- Tomt läge: "Det du följer samlas här." + Button "Utforska" (går till Hitta).

## 4. Allmänt
- Tokens från theme, inga hårdkodade färger. Mörkt/ljust. Minska rörelse respekteras. Kantsvep tillbaka oförändrat. Inga knappar i full bredd. Tryckfeedback via `useCardPress` där kort används.
- Befintligt känt fel (alla samlingar följda från start) rörs inte; nämn om det syns i Följer.

## 5. Dokument (uppdatera i repot)
`wireframes.md` §8 (markera byggd), `ia-karta.md`, `designsystem.md` (vy-växlare, listrad), `plan.md`, `produkt.md` (Gillade produkter ≠ samling). Nya idéer → `idebank.md`.

## 6. Utanför scope (flagga, bygg inte)
"Lägg till i samling"-sheet från produkt, snackbar vid sparande, redigera/döp om/radera samling, ta bort produkt ur samling, Personer.

## Verifiering
`tsc`, Metro-check, simulator. Lista vad som kräver telefon (long-press, svep). Rapport: `docs/briefs/35-rapport.md` (inkl. lista över Claude Project-dokument att spegla). Committa efter verifiering, inkl. briefen, och pusha.
