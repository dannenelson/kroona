# Ikonlista (mål-uppsättning)

*Skapad 2026-11-24 efter `docs/ikon-inventering.md`, uppdaterad 2026-11-25 (brief 57). Fas-taggar: **F0** = behövs i Fas 0, **F1+** = senare.*

**Status:**
- **i bruk** = ny ikon via `Icon`, används i appen.
- **fil finns** = SVG-fil i `assets/svg/icons/`, men appen använder fortfarande den gamla TSX-ikonen eller inget.
- **saknas** = ingen fil.

## Regler (beslutade i brief 57, se designsystem.md §17)
- Linjeikoner: 24 × 24-ruta, linje 1,5, runda ändar och hörn, `currentColor`. Filnamnet är ikonens namn.
- Den synliga linjen är 1,5 i alla storlekar (`icon.stroke`; `Icon` räknar om den).
- Fylld variant: `<namn>-filled.svg` om den finns, annars kodfyllning. Flikikoner: kontur inaktiv, fylld aktiv.
- Tryckyta minst 44 px. Tryckbara ikoner har `accessibilityLabel`; ikonen själv är dold för skärmläsare.
- Märkesikoner (SoMe) ritas inte i linjesystemet: officiella logotyper, enfärgade, `assets/svg/brands/`.

## 1. Gränssnittsikoner
| Grupp | Ikon | Fil | Fas | Status |
|---|---|---|---|---|
| Navigation | hem (flik) | `home` | F0 | i bruk (flikfältet, kontur + kodfylld) |
| Navigation | följer (flik) | `masonry` | F0 | i bruk (flikfältet, kontur + kodfylld) |
| Navigation | hitta (flik) | `find`, `find-filled` | F0 | i bruk (flikfältet) |
| Navigation | sparat (flik) | `folders`, `folders-filled` | F0 | i bruk (flikfältet) |
| Navigation | tillbaka | `back-arrow` | F0 | i bruk (alla tillbaka-knappar) |
| Navigation | stäng | `close` | F0 | fil finns (gamla `CloseIcon` i bruk) |
| Navigation | chevron höger | `chevron-right` | F0 | i bruk i "Visa fler ›" (14); övriga ställen gamla `ChevronIcon` |
| Navigation | chevron vänster, upp, ner | `chevron-left`, `chevron-up`, `chevron-down` | F0 | fil finns (vänster används inte för tillbaka) |
| Navigation | mer (tre punkter) | `more-horizontal`, `more-vertical` | F0 | fil finns |
| Sök och dialog | sök (förstoringsglas) | `search` | F0 | i bruk (sökläget, fältet i Sökresultat); idékortets förstoringsglas är gamla `FindIcon` |
| Sök och dialog | AI (stjärnor) | `stars` | F0 | i bruk ("Fråga om" i sökläget, bannern i Sökresultat, "Fråga om {kategori}", dialogens startskärm) |
| Sök och dialog | sök + stjärna (ej valt läge) | `find` | F0 | i bruk (fältet "Fråga eller sök" på Hem och Hitta) |
| Sök och dialog | mikrofon | `microphone` | F0 | i bruk (fältet) |
| Sök och dialog | skicka | `send` | F0 | i bruk (dialogens skicka-knapp) |
| Sök och dialog | filter | `filter` | F0 | fil finns, ingen plats i appen än |
| Åtgärder | följ (av/på) | – | F0 | saknas (gamla `FollowIcon` i bruk; `user-add` finns) |
| Åtgärder | spara (av/på) | `bookmark` | F0 | fil finns (kodfylld fungerar); gamla `BookmarkIcon` i bruk |
| Åtgärder | gilla | `heart` | F0 | fil finns (kodfylld fungerar) |
| Åtgärder | dela | `share` | F0 | fil finns (gamla `ShareIcon` i bruk) |
| Åtgärder | plus, check | `plus`, `check` | F0 | fil finns (gamla i bruk) |
| Åtgärder | redigera, radera | `edit`, `trash` | F1+ | fil finns |
| Status | varning, information (i) | `warning`, `info` | F0 | fil finns |
| Status | fel, klart | `error`, `done` | F1+ | fil finns |
| Länkar | extern länk | `link-external` | F0 | fil finns |
| Länkar | kopiera länk | `copy`, `link` | F1+ | fil finns |
| Övrigt | notis | `notification` | F0 | i bruk (Hem-toppen via `NotificationIcon`). Kodfylld variant tappar glappet mellan klocka och kläpp, se rapport 57 |
| Övrigt | inställningar, profil, kamera | `settings`, `user`, `camera` | F1+ | fil finns |
| Övrigt | vy: rader, kort | `list`, `grid`, `one-column-grid` | F0 | fil finns (gamla `ListIcon`/`GridIcon` i bruk) |
| Övrigt | lås (privat) | `lock` | F0 | fil finns (gamla `LockIcon` i bruk) |

Övriga filer i uppsättningen (inga planerade platser än): `ai-chat`, `arrow-up`, `calendar`, `chat`, `clock`, `document-1`, `document-2`, `document-add`, `flag`, `folder`, `folder-add`, `gift`, `image`, `image-add`, `layers`, `log-in`, `log-out`, `map-pin`, `maximize`, `message`, `moon`, `redo`, `refresh-1/2/3`, `shield`, `shopping-bag`, `slash`, `sorting`, `star`, `sun`, `tag`, `thumb-up`, `thumb-down`, `trend-neutral`, `trending-up`, `trending-down`, `undo`, `verified`, `verified-filled`, `wifi-off`.

## 2. Märkesikoner (SoMe)
Instagram, Pinterest, TikTok, Facebook, YouTube, X och LinkedIn: `assets/svg/brands/some-*.svg`, register `components/brandIconRegistry.ts`. **F1+**: inga SoMe-länkar i appen än.

## 3. Kroona-specifika
| Ikon | Fil | Status |
|---|---|---|
| hållbarhet (löv) | `leaf` | fil finns (gamla `LeafIcon` i bruk på produktkort) |
| betyg (stjärna) | `star` | fil finns (gamla fyllda `StarIcon` i bruk på produktkort) |
| begagnat, nytt | – | saknas |

## Öppet
- Övriga ikoner byts i en senare brief (se rapport 57 för vilka gamla TSX-ikoner som nu är oanvända).
- Följ (av/på) och notis (vald) saknar egen ritning.
