# Rapport brief 51 – Justering: mindre stora kort, större samlingslogotyper, större avatar

## Inventering
- **Stort stående kort:** `editorialCard.portraitLarge` 280 × 373, `radius.editorialLarge` 24 och `typography.editorialLarge` 22/26. Alla läses av EditorialCards `portraitLarge` och används idag bara i "Samlingar för dig".
- **Samlingslogotyp:** `logo.largeShare` 0,6, `smallShare` 0,75 och `maxHeight` 36. EditorialCard ritar logotypen med bredden min(kortbredd × andel, maxHeight × 2) och höjden = bredd / 2 (filerna är 90 × 45).
- **Avatar:** `homeHeader.avatar` 32. `Avatar` väljer initialernas text efter storlek (body 15 för 32–63) och var inte tryckbar i Header.

## Gjort
1. **Stora stående kort:** **240 × 320** (3:4), radie **22**, titel **20/24**. Allt ligger som tokens på ett ställe var (`spacing.ts`, `radius.ts`, `typography.ts`). Ca 1,5 kort syns på 390–402 bred skärm. Små stående, liggande, mix- och kollagekort är oförändrade.
2. **Samlingslogotyper:** `maxHeight` **72**, `largeShare` **0,65** och `smallShare` **0,85**. Det som binder först gäller.

   | Kort | Bredd × höjd | Begränsas av |
   |---|---|---|
   | Stort (240) | **144 × 72** | höjden; 65 % hade gett 156 |
   | Liggande (320) | **144 × 72** | höjden; 65 % hade gett 208 |
   | Litet (150) | **127,5 × 64** | bredden 85 % |

   Det är dubbla ytan på stora och liggande kort (förut 72 × 36) och ca 1,8 × på små (förut 72 × 36, nu 127,5 × 64). Undertiteln ligger kvar under.
3. **Avatar i toppen:** **40** (förut 32).
   - Initialerna skalas upp till `headline` (17/22, förut body 15) via den nya propen `initialStyle` på `Avatar`. Övriga avatarer är oförändrade.
   - Avataren ligger i en `Pressable` med `hitSlop` 2, så träffytan blir 44 × 44. Trycket gör ingenting (ingen profilskärm för användaren än), samma som klockan.
   - Toppraden är kvar på 44 hög, och logotypen är fortfarande absolut centrerad.
- **Dev-sidans provyta** (`app/components.tsx`) visar nu alla sex samlingslogotyper på stort, litet och liggande kort.
- **Dokument:** `docs/design.md` (radietabellen, format och toppraden) och `docs/designsystem.md` (§16 EditorialCard, §18 samlingslogotyp och §10 avatar).

## Verifiering
- `tsc --noEmit` är grönt, och iOS-exporten (Metro-check) är grön.
- **Simulator iPhone 17, mörkt och ljust läge:**
  - **Hem:** avataren "DN" 40, logotypen centrerad och "Samlingar för dig" med ca 1,5 kort och den större Skandinavisk design-logotypen.
  - **Dev-sidan:** alla sex logotyper på alla tre korttyper, med tillfällig scroll och en tillfällig ordning för att få fram små och liggande kort (båda borttagna).
- **Logotyperna:**
  - Handla hållbart och Second Hand (skrivstil) samt Gaming Deluxe (tung) krockar inte med kanten eller undertiteln på någon korttyp.
  - Second Hands nedstapel i "d" kommer nära undertiteln men överlappar inte.
  - Skandinavisk design och Handla hållbart fyller nästan hela bredden på det lilla kortet, men logotypfilernas egen luft håller dem innanför kanten.
- **Testkoden är borttagen.** Min Metro är stängd, och Daniels server på 8081 är orörd.

## Flaggor (utanför scope, inte byggt)
- **Kort med flera bilder** (mixar och kollage) är orörda, enligt briefen. Det avgörs separat.
- Menyn (brief 50) är orörd.
- **Avataren har ingen destination**, eftersom användarens profilskärm saknas. Den är tryckbar men gör ingenting, som klockan.
- **Vid maxhöjd 72 blir logotypen på stort kort (240) 144 bred.** Det är bara 60 % av kortet, eftersom höjden binder först. Ska logotyperna bli ännu större på stora kort måste `maxHeight` höjas.
