# Brief 44 – Fliken Flöde byter namn till Följer

**Fas:** 0. **Mål (ett):** Flikens namn ändras från **Flöde** till **Följer**, överallt där det syns för användaren och i dokumenten. Inget annat. Kör efter brief 43 (eller före, de rör inte samma filer).

## Beslut
Daniel har godkänt "Följer". Skälet: Hem är rekommendationer, Följer är nyheter från det man följer, så namnen ska inte överlappa. **Menyikonerna ändras inte** (ikonfrågan är öppen; behåll nuvarande ikon, bara etiketten byts).

## Gör
- `components/CustomTabBar.tsx`: etikett 'Flöde' → 'Följer'.
- `app/(tabs)/_layout.tsx`: titel 'Flöde' → 'Följer'.
- Sök övriga användarsynliga strängar (grep "Flöde" i app/, components/, data/). Kommentarer i kod som beskriver fliken uppdateras till "Följer"; text om flöden i allmän mening ("flödesbilder") rörs inte.
- **Route och filnamn (`feed.tsx`, nyckeln `feed`) byts inte** i den här briefen, bara det användaren ser. Notera i rapporten om en omdöpning är värd en egen runda.
- Dokument (nuvarande): `docs/ia-karta.md`, `docs/produkt.md`, `docs/design.md`, `docs/designsystem.md`, `docs/wireframes.md`, `docs/plan.md`, `docs/process.md`, `docs/kroona_projektoversikt.md`. Äldre briefar och rapporter är historik och ändras inte.
- Observera att "Följer" redan är en sektion i Sparat. Flagga i rapporten var det kan bli otydligt för användaren (två ställen med samma namn), men ändra inget.

## Utanför scope (flagga)
Ikonbyte, flikens innehåll, Spec-dokumentet (docx, Claude uppdaterar projektkopian).

## Verifiering
tsc, simulator: flikfältet visar Hem, Följer, Hitta, Sparat i mörkt och ljust. Rapport: `docs/briefs/44-rapport.md`. Committa, inkl. briefen, och pusha.
