# Brief 66 – Hitta: fält-text och arkiv (tidigare sökningar och dialoger)

**Fas:** 0 (lokalt på enheten, ingen backend). **Mål (ett):** Förbättra texterna på Hitta och ge Hitta ett arkiv över tidigare dialoger och sökningar. Inventera först `app/(tabs)/find.tsx`, `app/search.tsx`, `lib/recentSearches.ts`, `app/dialog.tsx` (hur meddelanden hålls), `components/ContinueDialogRow.tsx`, lokal lagring som redan används (t.ex. för följda och sparade) och `docs/ia-karta.md` (raden "Chatthistorik/arkiv"). Rapportera vad som fanns.

## Gör
1. **Texter på Hitta-startsidan.** Platshållare i fältet: **"Ställ en fråga eller sök"**. Hjälpraden under fältet: **"Sök efter en produkt eller berätta vad du behöver, till exempel en present till en kollega."** (Daniel justerar texten vid behov.)
2. **Lagra dialoger lokalt.** Varje dialog sparas (id, första frågan som titel, meddelanden, tidpunkt, ev. scope) när den fått minst ett svar. Max 50 sparade; äldst tas bort först. Dialoger öppnas igen med hela historiken och kan fortsätta.
3. **Hyllan "Tidigare"** på Hitta-startsidan under Idéer för dig: de senaste 3–4 posterna (dialoger och sökningar blandat, nyast först), med "Visa fler ›" → **Arkiv**. Rad: ikon (`stars` = dialog, `search` = sökning), titel/sökord, kort tid ("Idag", "Igår", datum). Tryck öppnar dialogen (återupptar) eller resultatet.
4. **Arkiv** (`app/archive.tsx`): lista över allt, grupperat Idag / Igår / Tidigare. Flikar eller pillar **Alla / Dialoger / Sökningar**. Ta bort en post (svep eller meny med `trash`), och "Rensa allt" med bekräftelse. Tomläge: "Inget här än. Dina sökningar och dialoger sparas här."
5. **Koppla "Fortsätt där du var" på Hem** så att dialog-korten öppnar den sparade dialogen (i dag öppnas en tom). Rensa gärna dubbletter med Sökläget "Senaste" (använd samma lagring).

## Utanför scope (flagga, bygg inte)
Synk mellan enheter, sök i historik, namnge dialoger, delning (Fas 1+).

## Verifiering
tsc, Metro, simulator mörkt och ljust: skapa två dialoger och två sökningar, se dem i Tidigare och Arkiv, återuppta en dialog, ta bort en, rensa allt, starta om appen (posterna finns kvar). Rapport `docs/briefs/66-rapport.md`; uppdatera ia-karta.md (Arkiv, Fas 0 lokalt) och produkt.md. Committa, inkl. briefen, och pusha.
