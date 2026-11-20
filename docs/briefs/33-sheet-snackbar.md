# Brief 33: Sheet-komponent, Skapa samling och Snackbar

Fas 0. Kör autonomt (auto mode). Rapport till `docs/briefs/33-rapport.md`. Committa (inkl. briefen) och pusha efter verifiering (tsc + iOS-export). Inga debug-rester, döda inte Daniels Expo-server. Inventera befintliga filer först (skriv inte över). Ny paketberoende kräver Daniels godkännande, fråga i rapporten.

## Underlag
Designskiss (Claude Design): "Kroona Sparat – ny struktur", https://claude.ai/artifact/4AkBhvKpTFNt4EPu8xtkbS. Skärmarna 4–6 (sheet-flödet och snackbaren) gäller den här briefen. Skiss och beskrivning nedan gäller; om du inte kan öppna skissen, bygg efter texten.

## Beslutat (Daniel, 2026-11-20)
- **Sheet** = ett återanvändbart helskärmslager (ingen RN `Modal`, samma lagerprincip som `ProductContextMenu`): blur + scrim bakom, innehåll ovanpå, så att man skymtar skärmen under. Rymmer **miniflöden** (flera steg med tillbaka), t.ex. Lägg till i samling → Skapa ny samling → Spara.
- **Knappar är aldrig fullbreddsrader** (utom i listor). CTA = pill som följer sitt innehåll, centrerad, **minst 56 px hög**, textstorlek ca 17/600. Primär = ljus yta (`textPrimary`-inverterad), sekundär = tonad yta. Gäller hela appen framöver; lägg regeln i designsystemet.
- **Snackbar** ersätter små toasts och bekräftelseskärmar: "<produkt> sparades i <samling>" med valfri åtgärd (t.ex. **Visa**). Samma komponent används för alla bekräftelser (spara via kontextmeny, Gilla, skapa samling, Dela-platshållare, erbjudanderadens "Du skulle nu gå till …").

## Scope
1. **`Sheet`** (provider på rotnivå + hook, t.ex. `useSheet()`): 
   - Öppna/stäng med animation (fade + lätt stigande, tokens i `theme/motion.ts`, Minska rörelse = bara tonning). Blur och scrim som kontextmenyn (använd dess token-värden, hitta inte på nya).
   - Mini-stack: `push(step)`, `pop()`, `close()`. Header: stängknapp (X) i första steget, tillbaka (chevron) i senare, titel centrerad, glasknapp 44 px med skugga som övriga glasknappar. Byte mellan steg med enkel slide/fade (tokens).
   - Tangentbord: innehållet ska inte täckas, CTA följer med.
   - Stäng via X och bakåt-gest; swipe ned stänger helskärmslagret om det inte krockar med skrollande lista (annars hoppa över och flagga).
   - API ska göra det enkelt att senare lägga steget "Lägg till i samling" (sökfält + lista + "Skapa ny samling") utan att ändra Sheet. Bygg **inte** det steget nu.
2. **`Button`** (om ingen finns, annars utöka): variant `primary`/`secondary`, storlek ≥ 56 px, wrap-content, pressrespons via `useCardPress`/press-tokens, disabled-läge, valfri ikon. Ersätt de CTA:er som byggs i den här briefen. Rör inte andra befintliga knappar utöver det som krävs.
3. **Skapa samling** som Sheet-flöde (ersätter lagret från brief 32 som öppnas av "Ny samling"/"+" i Sparat): fält "Namn på samlingen" (autofokus, max 40 tecken, Spara inaktiv om tomt), rad med toggle "Håll samlingen privat" (på som standard) och hjälptext "Bara du ser den. En publik samling kan andra se och följa.", CTA "Spara". Skapar via `UserCollectionsContext`. Därefter stängs Sheet och en Snackbar visar "<namn> skapades" med åtgärden **Visa** (öppnar samlingen).
4. **`Snackbar`** (provider + hook, t.ex. `useSnackbar().show({ text, thumbUri?, action?: { label, onPress } })`): ersätter `components/Toast.tsx` helt, migrera alla användningar. Utseende: rundad (radie ca 20) yta med blur i `menu`-ton och hårlinjekant, skugga, **bredd följer innehållet** (max ca 350), valfri miniatyr 40 px (radie 10) till vänster, text 15/500, åtgärd som pill-knapp (36 px hög) till höger. Läge: centrerad, ovanför flikfältet när det syns, annars 40 px från botten. En i taget (ny ersätter gammal). Visas ca 4 s, kan svepas bort nedåt, haptik som övrig feedback. Animation in/ut med tokens, Minska rörelse = tonning. Tillgänglig (`accessibilityLiveRegion`/role status).
5. Rensa oanvänd kod (gamla Ny samling-lagret, Toast). Ingen backend, ingen tracking. Mörkt och ljust tema, tokens för allt.

## Utanför scope (flagga, bygg inte)
Steget "Lägg till i samling" och spara-från-produkt, redigera/döp om/radera, omstrukturering av Sparat-fliken (rader/kort-växlare, Gillade produkter, Följer-sektioner), Personer (Fas 1+), eget omslag.

## Dokument (repo docs är master)
Uppdatera `docs/design.md` och `docs/designsystem.md` (Sheet, Snackbar, Button, regeln om knappar utan full bredd). Uppdatera `docs/wireframes.md` §8 till den nya Sparat-strukturen (Daniel godkände skissen 2026-11-20): flikar **Mina samlingar | Följer**; "Gillade produkter" som egen specialrad (inte en samling, hjärtat sparar dit, produkt kan vara både gillad och i samling); samlingar som rader (standard) eller kort (växlare); Följer i sektioner (Varumärken, Samlingar, Områden, **Personer = Fas 1+**, kräver konton) med "Visa alla"; "+" uppe till höger ersätter "Ny samling"-kortet. Lägg uppdaterad status i `docs/plan.md` och `docs/ia-karta.md` (Sparat-omstruktureringen är nästa brief). Lista i rapporten vad som ska speglas i Claude Project-dokumenten.

## Definition klar
"+" i Sparat öppnar Sheet med Skapa samling, namn + privat-toggle + stor wrap-CTA, Spara skapar samlingen, Sheet stängs, Snackbar visar "<namn> skapades · Visa". Alla gamla toasts är Snackbars. Sheet-komponenten kan återanvändas för flera steg. Rapporten redovisar beslut och avvikelser.
