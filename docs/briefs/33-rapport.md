# Rapport brief 33: Sheet, Button och Snackbar

**Underlag:** designskissen lästes (artboards `SheetSkapa` och `SheetSparad`). Mått och copy är följda och översatta till tokens.

**Byggt:**
- **`components/Sheet.tsx`** (`SheetProvider` på rotnivå + `useSheet()`): helskärmslager utan RN Modal, med blur (`menuBackdropIntensity`) + `scrim` som kontextmenyn.
  - Mini-stack `open/push/pop/close`. Headern har glasknapp (X i första steget, chevron i senare) och centrerad titel.
  - Steg = `{ title, render, swipeToClose? }` med `<SheetContent footer>`, där CTA:n följer med tangentbordet.
  - Stängs med X, Androids bakåt och swipe ned.
  - Tokens: `motion.sheet` (in 280, ut 220, stigning 24, stegbyte 220/24). Minska rörelse ger bara tonning.
  - Steget "Lägg till i samling" kan läggas till som ett nytt `SheetStep` utan ändringar i Sheet.
- **`components/Button.tsx`:** primary (ljus yta) och secondary (`pressed`), cta ≥ 56 eller compact 36, wrap-content och centrerad, med `useCardPress`, haptik, disabled och valfri ikon. Tokens i `control`.
- **Skapa samling** (`components/saved/CreateCollectionStep.tsx`): namn (autofokus, max 40), "Håll samlingen privat" (på) med hjälptext, och "Spara". Efter sparning stängs Sheet och snackbaren "<namn> skapades · Visa" visas. "+" (ny `PlusIcon`) i Sparats header och "Ny samling"-kortet öppnar det.
- **`components/Snackbar.tsx`** (`useSnackbar().show({ text, thumbUri?, action? })`) ersätter Toast helt. Radie 20, menu-blur, glaskant, skugga, bredd efter innehåll (max 350), miniatyr 40, text 15/500 och åtgärd som compact-Button. Den ligger ovanför flikfältet eller 40 px från botten, en i taget, i 4 s, kan svepas bort och har haptik `success`. Tokens: `motion.snackbar` och `snackbar`.
- **Migrerat:** erbjudanderadens "Du skulle nu gå till …" och PartnerCards Dela. **Nytt:** spara via produktkortets meny och Spara-knappen ger "<produkt> sparades i Alla sparade · Visa" (`hooks/useToggleSaved`).
- **Borttaget:** `components/Toast.tsx`, `components/saved/NewCollectionSheet.tsx`, `toastDuration`/`toastSlide` och Sparats Pill "Ny samling".

**Verifierat i simulatorn** (tillfällig testkod, borttagen):
- tomt lager med autofokus och Spara inaktiv ovanför tangentbordet;
- ifyllt namn gör Spara aktiv;
- Spara skapar "Hemmabio" (Privat), stänger lagret och visar "Hemmabio skapades · Visa" ovanför flikfältet;
- push ger tillbaka-chevron.

tsc och iOS-export är gröna. Swipe ned, snackbarens svep och åtgärden Visa kräver enhet.

**Beslut och avvikelser:**
- **Toggle:** systemets `Switch`, inget nytt paket. Inga nya paket behövdes.
- **Snackbarens toning med Minska rörelse:** opacitet sätts på blurrens förälder, vilket kan ge en kort glitch i glaset under toningen. Utan Minska rörelse glider den bara.
- **Snackbar vid spara** är nytt, inte en migrering. Briefen listar spara och Gilla som bekräftelser.
- **"Ny samling"-kortet i gridden är kvar,** eftersom omstruktureringen är nästa brief. "+" finns nu i headern.
- **Fältets kant** (1,5) är ett kommenterat lokalt värde från skissen, ingen token.

**Flaggas:**
- Swipe ned i Sheet krockar med framtida steg som har skrollande lista. Sådana steg sätter `swipeToClose: false`.
- iOS har ingen kantswipe-tillbaka i Sheet (bara X/chevron och swipe ned).
- Produktmenyns Dela, Följ varumärke och Visa liknande gör fortfarande ingenting.

**Spegla i Claude Project-dokumenten:**
- Regeln att knappar aldrig är fullbredd (CTA-pill ≥ 56, primär ljus, sekundär tonad).
- Sheet för miniflöden, och Snackbar som enda bekräftelsekomponent.
- Sparats nya struktur: Mina samlingar | Följer, Gillade produkter som specialrad (inte en samling), rader/kort-växlare, Följer i sektioner med "Visa alla", Personer i Fas 1+, och "+" i stället för Ny samling-kortet.
