# Brief 42 – Sortering: alfabetisk som standard

**Fas:** 0. **Mål (ett):** Samlingar och följda listas alfabetiskt (svensk ordning) i stället för i skapande-/datamordning. Rör inget annat. Kör efter brief 41. Inventera först var listorna byggs (saved.tsx, components/saved/, lägg-till-steget i Spara i-kortet, Följer-sektionerna).

## Nuläge (verifierat av Claude)
- Egna samlingar lagras och visas i **skapandeordning** (nyast sist), ingen explicit sortering.
- Följer-sektionerna visar data-/följordning.

## Gör
- Gemensam hjälpfunktion (t.ex. `lib/sortByName.ts`) med svensk jämförelse: `Intl.Collator('sv', { sensitivity: 'base', numeric: true })`, så att Å, Ä, Ö hamnar sist och "Samling 2" kommer före "Samling 10". Verifiera på Hermes (iOS och Android); finns inte stöd, beskriv fallback i rapporten.
- Används i: **Mina samlingar** (rader och kort), **"Spara i"-kortet**, och Följer-sektionerna **Varumärken, Personer, Samlingar**.
- **"Gillade produkter" ligger alltid först** (fast, ej sorterad), därefter egna samlingar A–Ö. Gäller i Mina samlingar och i "Spara i"-kortet.
- Sorteringen sker vid visning, inte i lagringen (createdAt och lagringsordning rörs inte).
- "Visa alla" i Följer: de tre första visade är de tre första alfabetiskt.

## Utanför scope (flagga)
Hem-hyllor och kuraterade listor (ordnade medvetet), användarvald sortering (senast använd, manuell), sök i listor.

## Verifiering
tsc, iOS-export, simulator med samlingar som "Åre", "Ägg", "Bastu", "Samling 2", "Samling 10", "Önskelista". Rapport: `docs/briefs/42-rapport.md`. Uppdatera produkt.md (en rad: listor sorteras A–Ö, Gillade först). Committa, inkl. briefen, och pusha.
