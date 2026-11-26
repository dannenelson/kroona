# Rapport brief 66 – Hitta: fält-text och arkiv

## Inventering: vad som fanns
- **`app/(tabs)/find.tsx`:** rubrik, `AskBar` ("Fråga eller sök") och hjälpraden "Sök på ett ord, eller beskriv vad du behöver, till exempel en bröllopspresent." Därefter hyllorna Idéer för dig, Kategorier och Områden och stilar.
- **`app/search.tsx` (sökläget):** fältet "Fråga eller sök" och "Senaste sökningar" från `lib/recentSearches.ts`.
  - **`lib/recentSearches.ts`:** AsyncStorage `@kroona/recentSearches`, bara söktermer (strängar), högst 5, utan tid.
- **`app/dialog.tsx`:** meddelandena hölls bara i komponentens state (`ChatMessage`: id, roll `user`/`assistant`/`error`, text, `productIds`). **Inget sparades.** Params `query` (skickas automatiskt) och `scope`.
- **"Fortsätt där du var"** (`components/ContinueRow.tsx`, på Hem): ett **statiskt dummykort** "Vinterjacka, hållbar, runt 2000 kr" som öppnade en **tom** dialog.
  - `components/ContinueDialogRow.tsx` används inte längre, eftersom `ContinueRow` ersatte den i brief 43.
- **Lokal lagring:** AsyncStorage i varje context (följda, sparade, egna samlingar, personer, tema) med mönstret "läs vid start, skriv vid ändring".
- **`docs/ia-karta.md`:** "Chatthistorik/arkiv (Hitta) … ⬜".

## Gjort
1. **Texter på Hitta:**
   - Fältet: "Ställ en fråga eller sök".
   - Hjälpraden: "Sök efter en produkt eller berätta vad du behöver, till exempel en present till en kollega."
2. **Ett gemensamt arkiv** (`lib/archive.ts` och `context/ArchiveContext.tsx`), med AsyncStorage `@kroona/archive`, för både sökningar och dialoger:
   - **Sökning:** id, sökord och tid. Samma sökord flyttas upp i stället för att dubbleras.
   - **Dialog:** id, titel (första frågan), meddelanden (med produkter), scope och tid. Den sparas när den fått minst ett svar och uppdateras efter varje nytt svar.
   - Högst **50 av varje**. Äldst tas bort först.
   - **`lib/recentSearches.ts` är borttagen.** Sökläget visar nu de 5 senaste sökningarna ur arkivet, så det finns ingen dubbel lagring. Gamla söktermer läses in en gång.
3. **Dialogen** (`app/dialog.tsx`) kan återupptas med `id`. Hela historiken och avgränsningen läses in, och dialogen kan fortsätta. Att bara öppna en sparad dialog flyttar den inte upp i listorna, det gör bara nya meddelanden.
4. **Hyllan "Tidigare"** på Hitta, under Idéer för dig:
   - De 4 senaste posterna, dialoger och sökningar blandat, nyast först.
   - "Visa fler ›" leder till Arkiv.
   - Raden har ikon (`stars` för dialog, `search` för sökning), titel eller sökord och "Dialog · Idag", "Sökning · Igår" eller ett datum ("12 nov").
   - Ett tryck återupptar dialogen eller öppnar sökresultatet.
   - Hyllan döljs när arkivet är tomt.
5. **Arkiv** (`app/archive.tsx`, `components/ArchiveRow.tsx`):
   - Grupperat Idag, Igår och Tidigare, med pillarna Alla, Dialoger och Sökningar.
   - Långt tryck ger menyn Öppna eller Ta bort (`trash`).
   - "Rensa allt" med bekräftelse (systemets dialogruta).
   - Tomläge: "Inget här än. Dina sökningar och dialoger sparas här."
6. **Fortsätt där du var** visar den senast sparade dialogen och återupptar den. Bilden är den första produkten dialogen har visat.

## Beslut jag tog själv
- **Fortsätt-kortet för dialog döljs** när ingen dialog är sparad, i stället för att visa dummykortet. Ett kort som öppnar en tom dialog var felet som skulle bort. Hyllan visar då bara samlingskortet, eller döljs helt.
- **Sökningar sparas också i högst 50.** Briefen anger 50 för dialoger, och jag valde samma gräns för sökningarna.
- **Söklägets platshållare** är också "Ställ en fråga eller sök". Det är samma fält som tonar in från Hitta, så texten ska inte byta.
- **Tidsetiketten** är "Idag", "Igår" eller "12 nov". Raden visar också typen, "Dialog" eller "Sökning", för tydlighet bredvid ikonen.
- **Borttagning sker via långt tryck och meny,** inte svep. Det är samma mönster som övriga listor.
- **Rensa allt** bekräftas med systemets dialogruta (`Alert`). Det finns ingen egen bekräftelsekomponent.
- **Ikonen för tomläget** är `clock`. `history.svg` finns på disk men är otrackad och inte med i ikonregistret.

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK.
- **Simulatorn,** egen Metro på 8097, mörkt och ljust läge.
  - **Testdata:** två dialoger (en "Igår") och två sökningar lades in med tillfällig kod. Dialoger kräver annars riktiga anrop till Claude-API:et.
  - **Hitta:** nya texter och hyllan Tidigare med alla fyra, nyast först.
  - **Arkiv:** Idag och Igår, pillarna och Rensa allt.
  - **Återupptagen dialog:** "Present till en kollega under 500 kr" med svar och produktkort, och den flyttades inte upp.
  - **Omstart av appen:** posterna finns kvar, och Hem visar den senaste dialogen i Fortsätt där du var.
  - **Ta bort en post:** dialogen försvann ur Arkiv.
  - **Rensa allt:** tomläget, och hyllan Tidigare dold.
- **Fel som hittades och rättades:**
  - En återupptagen dialog öppnades först tom, eftersom state lästes innan variabeln fanns.
  - Att bara öppna en dialog flyttade upp den.
- **Inte tryckt med finger:** menyn med långt tryck, bekräftelsedialogen för Rensa allt och att skriva en ny fråga i en återupptagen dialog. Borttagning och rensning anropades med tillfällig kod. Simulatorn kan inte trycka.
- **Städat:**
  - Min Metro är stoppad och den tillfälliga koden återställd.
  - **Testdatan i arkivet är rensad.** Expo Gos lagring delas troligen med din server.
  - Temavalet är tillbaka på mörkt.
  - Din server på 8081 är orörd.

## Utanför scope (flaggat, inte byggt)
Synk mellan enheter, sök i historiken, namnge dialoger och delning (Fas 1+).
