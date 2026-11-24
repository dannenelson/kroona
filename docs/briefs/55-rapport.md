# Rapport brief 55 – Hitta: tillbaka-knappen och sökikonen

## 1. Tillbaka hamnade på Hem
**Orsak:** flikarna (`(tabs)` i rot-stacken) hade `inactiveBehavior: 'pause'` i `tabsScreenOptions` (`components/product/productTransition.ts`).
- När **två eller fler** skärmar ligger ovanför flikarna blir de "inactive" i BlankStack. `pause` lägger dem då i en dold React `<Activity>`, som river alla effekter.
- React Navigation tolkar det som att flik-navigatorn försvann och nollställer dess tillstånd till bara Hem (`{ index: 0, routes: [index] }`).
- När man sedan backar ner till flikarna visas därför Hem.
- Ett enkelt push och tillbaka (Hitta → Möbler → tillbaka) gick rätt, eftersom flikarna då bara är "inert" (en skärm ovanför).
- Felet uppstod i två fall:
  - Hitta → lista → detalj (t.ex. Områden → Vintage) → tillbaka → tillbaka.
  - Sökläge → "Sök efter" → resultat. `router.replace` har tre scener i stacken under övergången, och flikarna pausas.
- Det gällde alla vägar med djup två eller mer, även utanför Hitta (t.ex. Hem → samling → produkt).

**Felsökning:**
- Navigeringstillståndet loggades efter varje steg: tillståndet var rätt direkt efter replace och nollställdes strax efter.
- Flik-layoutens effekter loggade "unmount" och sedan "mount".
- `backBehavior` och att undersidorna ligger i rot-stacken var inte orsaken. `router.replace` i sig var inte heller orsaken: stackens egen `replace` gav samma fel.

**Rättning:** `inactiveBehavior: 'keep'` för flikarna. De hålls monterade och syns ändå inte, eftersom `withDepthVisibility` redan sätter opacitet 0 på djup 2 och mer. Ingen annan kod är ändrad.

**Verifierat** med tillfällig autotryck-kod (inte committad). Den anropade flikfältets egen `onPress` och skärmarnas egna handlers, och navigeringstillståndet loggades vid slutet av varje kedja:
- **A:** Hitta → sökläge → "vardagsrum" → resultat → fältet (sök om) → "stolar" → tillbaka. Landar på **Hitta**.
- **B:** Hitta → Områden "Visa fler" → Vintage → tillbaka → tillbaka. Landar på **Hitta**.
- **C:** Hem → fältet → sökläge → "bord" → resultat → tillbaka. Landar på **Hem**.
- Före rättningen landade A och B på Hem.

## 2. Fel ikon i sökfältet
- `AskBar` har en ny prop `icon` (`'star'` standard, `'search'`). Sökresultat använder `'search'`, alltså förstoringsglaset i `textSecondary`.
- Sökläget (aktivt fält) hade redan förstoringsglaset. Det är kontrollerat och oförändrat.

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK.
- Simulatorn på egen port 8097, mörkt läge.
- Testkoden är borttagen. Min Metro är stoppad, och Daniels server på 8081 är orörd.

## Sett men inte ändrat
- **Hem-fältet har stjärnan.** Briefen säger att stjärnan bara hör till Hitta-startsidans fält och till "Fråga om". Ska Hem-fältet ha förstoringsglaset?
- **Prestanda:** med `keep` är flikarna aktiva i bakgrunden även på djup två eller mer. Det märktes inte i simulatorn. Blir det tungt på enheten är alternativet att behålla `pause` och spara flikarnas tillstånd på annat sätt.
- **Gamla kommentarer:** `docs/design.md` och spik-kommentaren i `app/_layout.tsx` nämner fortfarande att flikarna "behåller sin senaste bild ('pause')". Kommentaren i `_layout.tsx` är inte uppdaterad, eftersom briefen säger att inget annat ska röras.
