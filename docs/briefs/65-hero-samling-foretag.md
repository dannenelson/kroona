# Brief 65 – Hero på samlings- och företagsprofiler: parallax och ny layout

**Fas:** 0. **Mål (ett):** Gör herobilderna levande och företagsprofilen roligare. Inventera först `app/collection/[id].tsx`, `app/partner/[id].tsx`, de komponenter som ritar hero, toning och logotyp-cirkel, `PartnerCard`, `data/logos.ts`, `data/retailers.ts`, `data/areas.ts`. Rapportera vad som fanns.

## Gör
1. **Parallax** på hero i **Samlingsdetalj** och **Partnerdetalj** (inte på produkter): bilden rör sig långsammare än innehållet vid scroll (ca 0,5×) och skalas lätt vid överscroll uppåt. Använd Reanimated; ingen jank, fungerar mörkt och ljust.
2. **Företagsprofil, layout.** Lägre hero (ca 60 % av dagens höjd) och **svagare toning** (mjukare och kortare gradient, text ska fortfarande vara läsbar). Innehållet ligger på toningen:
   - **Vänster:** rad 1 = **rund logotyp + namn**; rad 2 = **vilka områden** företaget finns i (t.ex. "Möbler · Hemmakontor").
   - **Höger:** knappen **Följ**, **linjerad i botten** med innehållet till vänster.
   - **Ta bort** antal produkter från herotexten.
3. **Antal** samlingar och produkter visas i stället **under hero, vid respektive rubrik/hylla** ("Samlingar · 4", "Produkter · 36"), i dämpad text, så att antalet står i relation till det det räknar.
4. **Logotypen i profilcirkeln** (på hero, i `PartnerCard` och där cirkeln används) ska vara **större** inuti cirkeln: logotypens längsta sida fyller ca 60 % av cirkelns diameter (i dag mindre), centrerad, `contain`.

## Utanför scope
Nya hyllor, riktiga områden per företag om datan saknar det (härled ur företagets produkters kategorier/typer och rapportera hur).

## Verifiering
tsc, Metro, simulator mörkt och ljust: scrolla båda sidorna, överscroll, minst tre olika företag (en med mörk, en med ljus logotyp, en butik/andrahand). Rapport `docs/briefs/65-rapport.md`; uppdatera designsystem.md och ia-karta.md. Committa, inkl. briefen, och pusha.
