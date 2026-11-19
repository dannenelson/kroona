# Brief 07 — Tryck och lyft av kort, och menyns stängning

**Mål:** Rätta tre saker Daniel känt på enhet efter brief 06. Inga skärmar, inga nya paket.

**Läs först:** `CLAUDE.md`, `theme/motion.ts`, `components/ProductCard.tsx`, `components/ProductContextMenu.tsx`. Presentera en plan i Plan Mode först.

## Daniels observationer
1. **Tryck krymper för mycket, särskilt stora bilder.** Skalan 0,96 är relativ, så stora kort tappar många pixlar.
2. **Vid öppning av menyn ska bilden bli något större än originalstorleken** (zoomas in). Idag blir den ibland inte det, eftersom lyftskalan räknas mot en maxbredd och kan landa under 1. Undantag: den största korttypen (L) får lyftas minst.
3. **Vid stängning går bilden först ner till tryckt storlek och sedan till originalstorlek** (två steg). Han tror att det är två separata bilder. Han vill att den inzoomade bilden går tillbaka direkt till storleken den hade på canvasen.

## Gör
1. **Tryck i pixlar, inte procent.** Skalan beräknas från kortets bredd så att krympningen är ungefär densamma i pixlar (t.ex. ca 6–8 px totalt) men aldrig mer än 0,96 och aldrig mindre än ca 0,985 på L. Parametrar som tokens i `theme/motion.ts` (`pressInsetPx`, `pressScaleMin`, `pressScaleMax`). Gäller ProductCard; knappar och pillar kan behålla sin skala om de ser bra ut.
2. **Lyftskala:** alltid ≥ 1,04 för S och M, och för L minst 1,02 (så att den ändå känns lyft). Räkna aldrig skalan som `lyftbredd / originalbredd` om den kan bli < 1. Om bilden inte ryms på skärmen vid skala > 1, flytta den inåt i stället för att krympa. Värden som tokens.
3. **Stängning, ett enda steg:**
   - Hitta orsaken. Misstanke: `measure`/`measureInWindow` vid stängning mäter originalet medan det fortfarande har tryck-skalan (0,96) applicerad, eller tryck-animationens `pressOut` körs när gesten slutar, så kopian landar på 0,96 och originalet fjädrar sedan till 1. Kontrollera också om kopian och originalet laddar bilden separat (olika källa/cache) så att det syns som två bilder.
   - Lösning: när menyn öppnas, nollställ originalets tryck-skala till 1 utan animation och starta ingen `pressOut`-fjäder. Mät originalets layout utan transform (eller beräkna target från layout, inte från transformerad mätning). Kopian animeras direkt från lyftet till målstorlek 1 på originalets plats, utan mellansteg. När animationen är klar: byt kopia mot original i samma frame (som nu).
   - Använd exakt samma bildkälla och cache för kopian som för originalet (samma `uri`/källa, samma komponent), så ingen ny laddning eller blinkning sker. Rapportera hur det löstes.
4. **Märket (Nyhet/Begagnad)** på kortet ska följa med kopian under lyftet, så det inte försvinner och dyker upp vid bytet. Gör det bara om det är enkelt, annars rapportera.
5. Uppdatera `app/components.tsx` så S, M och L kan jämföras (tryck, lyft, stängning). Verifiera: `npx tsc --noEmit`, iOS-export, grep att inga hex/fontstorlekar/spacing-siffror ligger utanför `theme/`. Commit (ingen push).

## Gör INTE
- Ändra glas, menyns utseende, typografi eller andra komponenter. Inga nya paket. Ingen toppkant (kommer i brief 08).

## Klart när
- Tryck krymper ungefär lika många pixlar på S, M och L, och märkbart mindre på L än idag.
- Lyft gör bilden större än originalet på S och M (och lite på L).
- Stängning går i ett steg tillbaka till originalstorlek, utan två bilder och utan hopp.
- tsc och export utan fel, commit finns.

## Rapportera kort
Orsaken till tvåstegsstängningen, vilka skalor som blev (tryck och lyft per korttyp), egna beslut och avvikelser, och vad Daniel ska känna efter på enhet.
