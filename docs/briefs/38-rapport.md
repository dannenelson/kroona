# Rapport brief 38: Justering av Lägg till i samling och Gilla

**Byggt:**
1. **CTA i Lägg till i samling:** "Klar" är primär (stänger lagret, snackbar enligt brief 36), och "+ Skapa ny samling" är sekundär. Båda är wrap-breda. Ryms de inte på en rad staplas de centrerat med Klar överst (`row-reverse` + `wrap`), vilket är fallet på 402 pt. Utan samlingar: bara "Skapa ny samling", primär. Cirklar och X fungerar som förut.
2. **Sticky CTA i `SheetContent`, generellt** (också Skapa samling):
   - CTA-ytan ligger fast nederst, och innehållet skrollar bakom.
   - Innehållet tonas ut med en alfamask (`control.sheetFadeHeight` 48). Masken har ingen färg, så den genomskinliga slöjan syns igenom utan band.
   - Bakom CTA:n ligger blur via `EdgeFade` med en ny variant `clear` (bara blurlager, ingen färgtoning).
   - Skrollande innehåll får bottenmarginal via `useSheetFooterInset()` (CTA-yta + toning), och listan i Lägg till i samling använder den.
   - Ingen rörelse, så Minska rörelse påverkas inte.
3. **Gilla:** produktmenyn och knappen på Produktdetalj visar hjärta (tomt/fyllt) och "Gilla"/"Gillad". Snackbaren är "<produkt> gillades · Visa" (→ Gillade produkter), och ingen visas vid borttagning. "Spara i samling" behåller bokmärke-plus. Dokumenten är uppdaterade: design.md §0 och Produktdetalj, produkt.md, wireframes.md och designsystem.md.

**Verifierat i simulatorn** (tillfällig testkod, borttagen):
- lagret med nio samlingar: listan tonas ut bakom CTA-ytan, Klar överst och Skapa ny samling sekundär under;
- produktvyn visar hjärta + "Gillad" bredvid bokmärke-plus, och snackbaren "Slim Merino Crewneck gillades · Visa".

tsc och iOS-export är gröna.

**Kräver telefon:** att sista raden kan skrollas fri från CTA:n (simulatorn kunde inte scrolla programmatiskt), blurens känsla bakom CTA:n, ljust tema och tangentbordet i Skapa samling.

**Rättat utanför de tre punkterna:** egna samlingars id var bara tidsstämpel, så två samlingar skapade i samma millisekund fick samma id (upptäckt i testet). Id:t har nu ett slumpsuffix. Simulatorns testsamlingar rensades.

**Flaggas:**
- Följ på en samling som skapats av en person kopplas idag till samlingen, inte personen. Daniel noterade detta, och det tas i UX-genomgången.
- Utvecklarsidan (`app/components.tsx`) visar fortfarande bokmärkesikoner som exempel.

**Spegla i Claude Project:** hjärta = Gilla (snabbspar, "Gilla"/"Gillad", snackbar "<produkt> gillades"), bokmärke-plus = Spara i samling. Lägg till i samling har Klar som primär och Skapa ny samling som sekundär. Sheet har sticky CTA med utskrollande, tonat innehåll.
