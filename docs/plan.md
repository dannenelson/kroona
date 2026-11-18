# Kroona — Plan

*En sida. Svarar på "vad jobbar vi med nu, och vad kommer sen". Uppdateras när något ändras, aldrig med nya idéer (de går till `idebank`). Senast: 2026-11-17.*

## Mål för Fas 0 (bekräftat 2026-11-17)
Ett demo i telefonen som Daniel kan visa en pilotpartner och som håller i en 5-minuters genomgång av hela köpresan: **Hem → Produktdetalj → Samling → Sparat**, plus Hitta och Flöde.

**Klart när:** de fyra tabbarna och fyra detaljvyerna är byggda på 56 dummyprodukter, i både mörkt och ljust tema, utan att API-nyckeln ligger i klienten.

## Nu — ett aktivt spår åt gången
| # | Spår | Klart när |
|---|---|---|
| 0.1 | **Städa dokumenten** → tre levande dokument (Produkt, Design, Plan) | ✅ Skrivna och i repot. Kvar: arkivera gamla projektfiler, rätta minnet |
| 0.2 | **Färsk repo-inventering** | ✅ Klar 2026-11-17, se "Kodläge" nedan |
| 0.3 | **Designgrund** (tokens + komponenter, tvåskiktsmodell) | ✅ `design.md` skriven. Kvar: Claude Design-rebuild mot den |

## Kodläge (inventerat 2026-11-17, commit `2ce6ed6`)

| Yta | Specat | Designat | Byggt |
|---|---|---|---|
| Hem | ✅ | 🚧 | 🟡 Gammal stil: tio sektioner, filter utan logik. Ingen hälsningshero eller glas. |
| Flöde | ✅ | ⬜ | 🟡 Grundversion (`feed.tsx`, ProductGrid) |
| Hitta | ✅ | ⬜ | ✅ Fungerande chatt mot Claude API. Saknar länk till Produktdetalj, arkiv/ny chatt och tal. |
| Sparat | ✅ | ⬜ | 🟡 Platt "gilla"-lista. Inga egna samlingar. |
| Produktdetalj, Samling, Partner, Profil | ✅ | ⬜ | ⬜ Inga routes finns |
| Onboarding | parkerad | — | — |

**Fynd**
1. **Datamodellen är den gamla.** `Product` är ett erbjudande (pris och nytt/begagnat ligger på produkten). Retailer och Offer saknas. 56 produkter finns.
2. **Bara mörkt tema.** Ingen tema-provider, `userInterfaceStyle: dark`.
3. **Bra utgångsläge för tokens:** bara 4 hex och 13 rgba utanför `constants/`. 20 av filerna använder redan `Colors`/`Spacing`, så migreringen till `theme/` blir liten.
4. **Beroenden som saknas för designen:** `expo-blur` (glas) och Familjen Grotesk (Google Fonts-paket). UI-typsnitt blir Google Sans Flex (redan installerat, tillfällig grund). Animation (Reanimated/gestures) och `expo-image` är ej installerade och väntar tills en skärm behöver dem.
5. **TypeScript:** inga fel (`tsc --noEmit`).
6. **API-nyckeln ligger i klienten** (känd skuld). Modellnamnet i `claudeProxy.ts` (`claude-sonnet-5`) bör verifieras.
7. **Skräp att städa:** `CardShowcase.tsx` är oanvänd, `ClusterCard` är omonterad, `test.json` i roten, och splash har vit bakgrund i en mörk app.

## Näst — i den här ordningen
1a. ✅ **Tema** (`theme/`, typsnitt, migrering) — klart 2026-11-18, commit `d048031`. Besiktigas i Expo Go (mörkt och ljust).
1b. **Basskomponenter** (Glas, Pill, Kort, TopBar) på temat. Ta med två fynd från 1a:
    - Guld som ikon på ljus yta ger 2,57:1 (ikoner kräver 3:1). Använd `accentText` för ikoner i ljust tema.
    - Hero- och Partner-toningen slutar i solid mörk botten, vilket kan se ut som ett mörkt block i ljust läge. Avgörs visuellt.
2. **Datamodell i koden:** Produkt / Återförsäljare / Erbjudande (koden speglar troligen den gamla modellen)
3. **Produktdetalj** (mest efterfrågade luckan), sedan **Samlingsdetalj**
4. **Sparat** med egna samlingar (AsyncStorage)
5. **Hem** i ny design, sedan **Flöde** och **Hitta**
6. **Demo-redo:** API-nyckel bakom proxy, telefonbygge för visning

## Senare — Fas 1 och framåt (byggs inte i Fas 0)
Supabase-projekt och schema (collections, collection_items, follows) · konton · tracking och provision · första riktiga återförsäljaren · admin för handlare · DPP

## Öppna beslut
- [x] Mål och "klart när" bekräftade (2026-11-17)
- [ ] Hosting: Supabase i Fas 1, och proxyn för API-nyckeln i 0.6 eller tidigare?
- [ ] Schemajämförelse (researchloggen) före Fas 1

## Spelregler
1. **Ett spår åt gången.** Nytt spår startar när det gamla är klart eller uttryckligen pausat.
2. **Ny idé → idébanken**, inte hit. Den flyttas hit först när Daniel prioriterar den.
3. **Fas-koll:** hör det till Fas 1+? Flagga och bygg inte.
4. **Commit efter varje godkänd Code-runda** (tsc/Metro).
5. **Sidospårsfråga innan varje session:** "Står detta i Nu/Näst?" Om inte, fråga Daniel.
