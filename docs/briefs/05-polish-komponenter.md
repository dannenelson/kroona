# Brief 05 — Polish av basskomponenterna (efter besiktning av brief 04)

**Mål:** Rätta det Daniel såg i Expo Go, och få långt tryck-menyn att kännas som iOS: animation, haptik och dra-för-att-välja.

**Läs först:** `CLAUDE.md`, `docs/design.md` §0 (nya punkten "Delight" och ändrad foto-glas-regel), `components/Glass.tsx`, `IconButton.tsx`, `Pill.tsx`, `ProductContextMenu.tsx`, `theme/glass.ts`. Presentera en plan i Plan Mode först.

## Gör
1. **Hårda kanter på IconButton och vissa pillar.** Det ser ut som att en wrapper klipper rundningen (rund form får raka kanter). Hitta orsaken (troligen `overflow: 'hidden'` + `BlurView` + `borderCurve`, eller en yttre vy utan samma radie) och rätta den i grunden, inte per komponent. Rapportera orsaken.
2. **Glas över foto i ljust tema ska vara ljust.** Nu är det mörkt i båda teman. Ljust tema: ljus glasfyllning (ca `rgba(255,255,255,.55–.70)`), blur ca 20, mörk ikon/text, ljus kant. Mörkt tema oförändrat. Kontrollera läsbarhet på både ljusa och mörka foton i `app/components.tsx` och rapportera. Ändra `design.md` §0/§3 (regeln "foto-overlayer fasta i båda teman" gäller nu bara scrim, inte glas).
3. **Långt tryck-meny, känsla:**
   - **Dra för att välja:** efter långt tryck kan fingret dras över menyraderna, raden under fingret markeras (pressed-yta), och släpper man väljs den. Släpper man utanför stängs menyn. Ingenting bakom menyn ska scrolla. Detta kräver troligen att gesten ligger kvar på kortet/ett rotlager i stället för en `Modal` (som avbryter touchen). Föreslå lösning i planen. Behöver du `react-native-gesture-handler` eller liknande: **fråga först**, lägg inte till paket själv.
   - **Haptik:** lätt vid öppning, `selection` när markeringen byter rad, `success` vid val. Använd `expo-haptics` (fråga först om det inte redan finns).
   - **Animation:** kortet lyfts med spring (skala 1,04, lift), menyn glider in och skalar från kortet, stängning är lika mjuk. Respektera reduce motion. Lägg varaktighet/spring i `theme/motion.ts`.
   - **Mindre blur:** bakgrunden blurras lätt (ungefär hälften av nuvarande) plus svag scrim.
4. Uppdatera `app/components.tsx` så ljust foto-glas och menyn går att testa. Verifiera: `npx tsc --noEmit`, iOS-export, grep att inga hex/fontstorlekar/spacing-siffror ligger utanför `theme/`. Commit (ingen push).

## Gör INTE
- Bygga skärmar, logik för Följ/Dela/Visa liknande, eller fler "delight"-effekter än haptik och menyn. Delight-principen är en riktning, inte en uppgift här.
- Lägga till paket utan att fråga.
- Röra typografi, spacing eller annat som inte nämns.

## Klart när
- Inga hårda kanter på glasknappar och pillar i båda teman.
- Ljust foto-glas är ljust och läsbart.
- Menyn har animation och haptik, går att dra-välja och ingenting bakom scrollar.
- tsc och export utan fel, commit finns.

## Rapportera kort
Orsaken till de hårda kanterna, vilken lösning du valde för dra-för-att-välja (och om ett paket krävdes), egna beslut och avvikelser, och vad Daniel ska känna efter på enhet (haptik går inte att se i dev-routen).
