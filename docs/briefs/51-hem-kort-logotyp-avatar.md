# Brief 51 – Justering: mindre stora kort, större samlingslogotyper, större avatar

**Fas:** 0. **Mål (ett):** Tre mått efter Daniels granskning av brief 43, 47 och 46. Rör inget annat. Inventera först `theme/spacing.ts` (`portraitLarge`, logotypens `maxHeight`, `homeHeader.avatar`), `components/EditorialCard.tsx`, `components/Header.tsx` och `components/Avatar.tsx`.

## Gör
1. **Stora stående kort mindre:** 280 × 373 → **240 × 320** (3:4), radie 24 → **22**, titel 22 → **20**. Ca 1,5 kort syns på 390 bred skärm. Måtten ligger som tokens, så siffrorna ska gå att ändra på ett ställe. Gäller `portraitLarge` överallt (idag hyllan "Samlingar för dig"). Små stående, liggande och collagekort ändras inte.
2. **Samlingslogotyperna dubbelt så stora:** `maxHeight` 36 → **72** (logotypen ritas ca dubbelt så stor som nu). Bredden begränsas till ca **65 %** av kortets bredd på stora och liggande kort och **85 %** på små, det av de två som binder först. Undertiteln ligger kvar under. Kontrollera alla sex logotyper på alla tre korttyper, särskilt Handla Hållbart och Second Hand (smala skrivstilar) och Gaming Deluxe (tung), och att de inte krockar med kanten eller undertiteln. Rapportera slutvärdena.
3. **Större initialer i toppen:** avataren i Hem-toppen 32 → **40**, initialerna skalas upp med. Träffytan ska vara minst 44 × 44 (hitSlop om det behövs). Toppraden behåller höjd 44 och logotypen förblir centrerad.

## Utanför scope (flagga)
Att korten använder flera bilder som bakgrund (mixar och collage): Daniel ifrågasätter det och det avgörs separat, rör inte. Menyn (brief 50).

## Verifiering
tsc, Metro, simulator mörkt och ljust: Hem med de mindre korten, samlingslogotyperna på stora, små och liggande kort, avataren i toppen. Rapport: `docs/briefs/51-rapport.md`. Uppdatera `docs/design.md` och `docs/designsystem.md` (kortmått, logotypstorlek, avatar). Committa, inkl. briefen, och pusha.
