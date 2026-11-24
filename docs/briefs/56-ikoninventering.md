# Brief 56 – Ikoninventering (ingen kodändring)

**Fas:** 0. **Mål (ett):** Kartlägg alla ikoner i appen så att vi kan göra ett systematiskt ikonbyte. **Ändra ingen app-kod.** Skriv bara rapporten `docs/ikon-inventering.md`.

## Gör
1. Gå igenom `assets/svg/icons/`, `assets/icons/` (gamla TSX), `components/` (t.ex. NotificationIcon, SegmentedIcons, CustomTabBar) och alla `app/`-skärmar. Hitta även ikoner som är **ritade direkt i skärmar** (inline `Svg`/`Path`, tecken som ›, →, ✕ eller emoji i text).
2. Skriv en tabell, en rad per ikon: **namn · fil eller plats · används i (skärmar/komponenter) · storlekar som används · linjetjocklek (stroke) · SVG eller TSX · färgas med currentColor/tema eller hårdkodad · har aktivt läge (fylld) eller inte**.
3. Lista för sig: ikoner som saknar tryckyta på minst 44 px, ikoner utan `accessibilityLabel`, och ikoner med avvikande linjetjocklek eller ruta jämfört med övriga.
4. Lista **ikoner som saknas** jämfört med denna lista (finns de inte, skriv "saknas"): sök, stjärna (AI), sök+stjärna (kombinerad), mikrofon, tillbaka, stäng, chevron, följ, spara, dela, filter, mer, notis, hem, följer, hitta, sparat, skicka, check, plus.
5. Avsluta med en kort bild av hur ikoner laddas i dag (komponenter, tema, `currentColor`) och vad som måste ändras för en enda `Icon`-komponent med namn och storlek. Föreslå, bygg inte.

## Utanför scope
All kodändring, ritning av nya ikoner, byte av ikoner.

## Verifiering
Inget byggs. Committa rapporten och briefen och pusha.
