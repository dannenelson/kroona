# Brief 64 – Profil, notiser och inställningar (dummy)

**Fas:** 0. **Mål (ett):** Gör ut sidorna bakom avataren och klockan, flytta in utvecklarsidan bland inställningarna och ge appen en riktig ljust/mörkt-växel. Inventera först `components/Header.tsx` (avatar, klocka), `app/components.tsx` (dev-sidan), `theme/` (hur ljust/mörkt väljs i dag, systemläge), `app/_layout.tsx`, `data/user.ts`, `app/profile/[id].tsx`. Rapportera vad som fanns.

## Gör
1. **Profil** (öppnas från avataren, glider in **från vänster**, stackskärm med tillbaka-knapp): avatar och namn (Daniel Nelson, DN), @handle, räknare (följer N, sparade N), och en lista med rader: **Sparade produkter**, **Mina samlingar**, **Inställningar**, **Hjälp** (död rad). Raderna är dummy och öppnar vad som finns (Sparat); resten visar en tom, snygg platshållare. Fylla med dummyinnehåll, inget backend.
2. **Notiser** (öppnas från klockan, glider in **från höger**): lista med 6–8 dummynotiser (ikon, rubrik, kort text, tid; t.ex. "Nordform har fått 3 nya produkter", "En samling du följer har uppdaterats"), grupperade Idag / Tidigare, och ett tomläge ("Inga notiser än"). Notisikonen får prick (`notification-filled`, med `currentColor`-prick, byt färgen i filen om den är hårdkodad) när det finns olästa, och pricken försvinner när sidan öppnats.
3. **Inställningar** (från Profil): sektioner **Utseende** med en riktig **växel Ljust / Mörkt / System** (segmentkontroll med ikonerna `sun`, `moon` och en textflik "System"; sparas lokalt och gäller direkt i hela appen), **Notiser** (dummyväxlar), **Om** (version) och **Utvecklare** med raden **Komponenter (dev)** som öppnar dagens dev-sida. Flytta in dev-sidan hit; den ska inte längre nås på annat sätt.
4. **Komponenter (dev), korten:** de tre korstorlekarna med samlingslogotyper ska visa innehållet **centrerat**. Vänsterställd text hör bara till liggande kort med enbart text (som "Fortsätt där du var"). Om sidans exempel avviker: rätta och rapportera hur du tolkade det.

## Utanför scope (flagga, bygg inte)
Riktiga notiser, inloggning, redigera profil, radera konto.

## Verifiering
tsc, Metro, simulator: öppna profil och notiser (rätt riktning), växla tema i alla tre lägen och starta om appen (valet behålls), dev-sidan via Inställningar. Rapport `docs/briefs/64-rapport.md`; uppdatera ia-karta.md och designsystem.md (tema, nya skärmar). Committa, inkl. briefen, och pusha.
