# Ikonlista (mål-uppsättning)

*Skapad 2026-11-24 efter `docs/ikon-inventering.md`, uppdaterad 2026-11-25 (brief 57 och 58). Alla ikoner i appen ritas nu med `Icon`; de gamla TSX-ikonerna är borttagna. Fas-taggar: **F0** = behövs i Fas 0, **F1+** = senare.*

**Status:**
- **i bruk** = ny ikon via `Icon`, används i appen.
- **fil finns** = SVG-fil i `assets/svg/icons/`, ingen plats i appen än.
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
| Navigation | stäng | `close` | F0 | i bruk (Sheet, bildvisaren, rensa-knappen i sökläget) |
| Navigation | chevron höger | `chevron-right` | F0 | i bruk ("Visa fler ›" 14; rader, banner, erbjudanden 16; menyraden "Öppna") |
| Navigation | chevron vänster, upp, ner | `chevron-left`, `chevron-up`, `chevron-down` | F0 | fil finns (vänster används inte för tillbaka) |
| Navigation | mer (tre punkter) | `more-horizontal`, `more-vertical` | F0 | fil finns (bara dev-sidans TopBar-exempel) |
| Sök och dialog | sök (förstoringsglas) | `search` | F0 | i bruk (sökläget, fältet i Sökresultat, idékorten) |
| Sök och dialog | AI (stjärnor) | `stars` | F0 | i bruk ("Fråga om" i sökläget, bannern och tom-knappen i Sökresultat, "Fråga om {kategori}", dialogens startskärm) |
| Sök och dialog | sök + stjärna (ej valt läge) | `find` | F0 | i bruk (fältet "Fråga eller sök" på Hem och Hitta) |
| Sök och dialog | mikrofon | `microphone` | F0 | i bruk (fältet) |
| Sök och dialog | skicka | `send` | F0 | i bruk (dialogens skicka-knapp) |
| Sök och dialog | filter | `filter` | F0 | fil finns, ingen plats i appen än |
| Åtgärder | följ (av/på) | `user-add` | F0 | i bruk i menyerna, samma ikon för Följ och Sluta följa; egen vald-variant saknas |
| Åtgärder | spara (av/på) | `bookmark` | F0 | i bruk (Produktdetalj, kontextmenyn, Gillade, SaveSheet), kodfylld när sparad |
| Åtgärder | gilla | `heart` | F0 | fil finns (bara dev-sidan), kodfylld fungerar |
| Åtgärder | dela | `share` | F0 | i bruk (Produktdetalj, menyer) |
| Åtgärder | plus, check | `plus`, `check` | F0 | i bruk (Ny samling, vald samling i SaveSheet) |
| Åtgärder | spara i samling | `folder-add` | F0 | i bruk (kontextmenyn) |
| Åtgärder | visa liknande | `layers` | F0 | i bruk (kontextmenyn) |
| Åtgärder | redigera, radera | `edit`, `trash` | F1+ | fil finns |
| Status | varning, information (i) | `warning`, `info` | F0 | fil finns |
| Status | fel, klart | `error`, `done` | F1+ | fil finns |
| Länkar | extern länk | `link-external` | F0 | fil finns |
| Länkar | kopiera länk | `copy`, `link` | F1+ | fil finns |
| Övrigt | notis | `notification`, `notification-filled` | F0 | i bruk (Hem-toppen via `NotificationIcon`, kontur). `notification-filled` (klocka med prick) finns men inget läge i appen använder den än; pricken har hårdkodad färg, se rapport 58 |
| Övrigt | inställningar, profil, kamera | `settings`, `user`, `camera` | F1+ | fil finns |
| Övrigt | vy: rader, kort | `list`, `grid`, `one-column-grid` | F0 | `list`, `grid` i bruk (Sparat); `one-column-grid` fil finns |
| Övrigt | lås (privat) | `lock` | F0 | i bruk (privata samlingar) |

Övriga filer i uppsättningen (inga planerade platser än): `ai-chat`, `arrow-up`, `calendar`, `chat`, `clock`, `document-1`, `document-2`, `document-add`, `flag`, `folder`, `folder-add`, `gift`, `image`, `image-add`, `layers`, `log-in`, `log-out`, `map-pin`, `maximize`, `message`, `moon`, `redo`, `refresh-1/2/3`, `shield`, `shopping-bag`, `slash`, `sorting`, `sun`, `tag`, `thumb-up`, `thumb-down`, `trend-neutral`, `trending-up`, `trending-down`, `undo`, `verified`, `verified-filled`, `wifi-off`.

## 2. Märkesikoner (SoMe)
Instagram, Pinterest, TikTok, Facebook, YouTube, X och LinkedIn: `assets/svg/brands/some-*.svg`, register `components/brandIconRegistry.ts`. **F1+**: inga SoMe-länkar i appen än.

## 3. Kroona-specifika
| Ikon | Fil | Status |
|---|---|---|
| hållbarhet (löv) | `leaf` | i bruk (produktkortets betygsrad) |
| betyg (stjärna) | `star` | i bruk, fylld (produktkortets betygsrad) |
| begagnat, nytt | – | saknas |

## Öppet
- Följ (vald/följer) saknar egen ritning; `user-add` används för både Följ och Sluta följa.
- `notification-filled.svg`: pricken är hårdkodad `#111111` (syns inte i mörkt läge) och klockans kontur är öppen vid pricken.
- Kodfyllning passar inte alla ikoner (rapport 58).
