# Brief 58 – Byt resterande ikoner till Icon-systemet och städa bort de gamla

**Fas:** 0. **Mål (ett):** Alla ikoner i appen ritas med `Icon` (brief 57). Inga gamla TSX-ikoner ska användas när du är klar, och de oanvända tas bort. Inventera först `docs/ikon-inventering.md`, `docs/briefs/57-rapport.md`, alla importer från `assets/icons/`, `IconButton.tsx`, `SegmentedIcons.tsx` och `app/components.tsx` (dev-sidan). Rapportera vad som fanns.

## Mappning (gammal ikon → `Icon name`)
| Gammal | Ny | Anmärkning |
|---|---|---|
| BookmarkIcon (+ `_filled`) | `bookmark` (`filled` när sparad) | |
| StarIcon, betyget på `ProductCard` | `star` med `filled`, 12 | |
| StarIcon, AI | `stars` | alla kvarvarande, även tom-knappen "Fråga om ”ord”" i Sökresultat |
| MicIcon | `microphone` | |
| BackIcon | `back-arrow` | alla kvarvarande |
| CloseIcon | `close` | rensa-knappen i sökläget (12) behåller sin cirkel |
| ChevronIcon | `chevron-right` | även bannern i Sökresultat, rader i `categories`, `OfferRow`, menyn "Öppna" i `PartnerCard`/`ProfileCard`/Sparat |
| FollowIcon | `user-add` | används för både "Följ" och "Sluta följa" som i dag; flagga om det ser fel ut för varumärken |
| ShareIcon | `share` | |
| PlusIcon | `plus` | |
| CheckIcon | `check` | |
| SimilarIcon | `layers` | "Visa liknande" |
| ListIcon / GridIcon | `list` / `grid` | `SegmentedIcons` |
| LockIcon | `lock` | |
| LeafIcon | `leaf` | |
| "Spara i samling" (menyraden) | `folder-add` | om raden i dag har plus; annars `plus` |
| IdeaCards förstoringsglas | `search` | |
| NotificationIcon | redan `notification` | om `notification-filled.svg` finns i `assets/svg/icons/` används den för vald/har notiser; annars rör inget |

## Gör
1. Byt alla användningar enligt tabellen. Lägg ikonen i `IconButton` via en `name`-prop (behåll gamla propen tills inget längre använder den, ta sedan bort den). Ikonstorlekar och färger som i dag; linjen blir 1,5 px synlig (systemets standard), och små ikoner (12) får vara 1,5 också.
2. Kontextmenyn (`ProductContextMenu`), menyerna i `PartnerCard`, `ProfileCard` och Sparat, produktkortets betygsrad (löv, stjärna), delaknappen i Produktdetalj och Gillade-rutan ska alla vara nya.
3. **Ta bort** de gamla TSX-filerna i `assets/icons/` och de gamla SVG-källfilerna där (`bookmark.svg`, `feed.svg` m.fl.) när inget längre importerar dem. Dev-sidans ikoner (Heart, Menu, Archive, NewChat) ersätts av en rutnätssektion som visar **alla ikoner i registret** med namn, i 24 och fylld/ofylld, så att systemet kan granskas där.
4. Pilen `→` i den oanvända `DiscoveryPreviewCard`: rör inte, nämn bara.
5. `rg "assets/icons"` ska ge noll träffar efteråt (utom ev. docs).

## Utanför scope (flagga, bygg inte)
Nya ikoner i nya funktioner (filter-knapp, redigera, kamera m.fl. finns i registret men får inga ställen än), animation mellan kontur och fylld, SoMe-länkar.

## Verifiering
tsc, Metro, simulator mörkt och ljust: gå igenom kontextmenyn på produktkort, Produktdetalj (dela, spara, hållbarhet), Gillade och Sparat (list/grid), menyerna (Följ, Dela, Öppna), sökläget och Sökresultat. Rapportera ikoner som blir fel fyllda eller ser konstiga ut. Rapport: `docs/briefs/58-rapport.md`. Uppdatera `docs/ikonlista.md` (status) och `docs/designsystem.md` §17. Committa, inkl. briefen, och pusha.
