# Rapport brief 44 – Fliken Flöde byter namn till Följer

## Gjort
- **Användarsynligt:**
  - Etiketten i flikfältet (`components/CustomTabBar.tsx`, `feed: 'Följer'`).
  - Flikens titel (`app/(tabs)/_layout.tsx`).
  - Skärmens rubrik i `app/(tabs)/feed.tsx`. Briefen nämnde den inte, men grep hittade den och den syns för användaren.
- **Kodkommentarer som syftar på fliken:** `components/ProductCard.tsx`, `data/collections.ts` (2 ställen) och `data/catalogTopup.ts`.
- **Dokument:**
  - `docs/ia-karta.md`, `docs/produkt.md`, `docs/design.md`, `docs/designsystem.md`, `docs/wireframes.md`, `docs/plan.md` och `docs/kroona_projektoversikt.md`.
  - `produkt.md` har en notering om att fliken hette Flöde fram till brief 44 och att route och fil fortfarande heter `feed`.
  - Rubriken i `wireframes.md` §6 lyder "Följer (tidigare Flöde)".
  - Den historiska meningen i `produkt.md` ("Tidigare: Hem känt, Flöde upptäckt …") behåller det gamla namnet.
- **Orört:**
  - Ikonen.
  - Route och fil (`feed`, `feed.tsx`).
  - Äldre briefar och rapporter.
  - `docs/process.md`: där står bara "Flödet" och "Flöden" i allmän mening (arbetsflöde, användarflöden), inte fliken.

## Verifiering
- `tsc --noEmit` är grönt.
- **Simulatorn** (egen Metro på 8097): flikfältet visar Hem, Följer, Hitta och Sparat i mörkt och ljust läge. Ljust läge sattes med tillfällig testkod som är borttagen.
- Min Metro är stängd. Daniels server på 8081 är orörd.

## Flaggor
- **Samma namn på två ställen:** fliken **Följer** och fliken **Följer** inuti Sparat (Mina samlingar | Följer) heter likadant.
  - Användaren kan undra vad som skiljer dem. Fliken är nyheter från det man följer, Sparats Följer är listan över vad man följer (hantera, sluta följa).
  - Det blir tydligast i Sparat, där två "Följer" syns samtidigt (flikfältet och den inre fliken).
  - Hem-hyllan "Du följer" finns inte längre (brief 43), så den krockar inte.
  - Förslag om det ska lösas: döp om den inre fliken i Sparat (t.ex. "Följda" eller "Du följer").
- **Route och fil:** att döpa om `feed` till `following` (fil, route och `CustomTabBar`-nyckeln) är värt en egen liten runda om koden ska matcha namnet. Det berör djuplänkar och `router.navigate`-anrop, så det bör göras separat.
- **Utanför scope:** ikonbyte (rutnätsikonen passar sämre till Följer), flikens innehåll (fortfarande grundversionen med ProductGrid) och Spec-dokumentet (docx).
