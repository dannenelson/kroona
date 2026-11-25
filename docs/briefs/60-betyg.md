# Brief 60 – Betyg på produkter (dummydata och visning)

**Fas:** 0. **Mål (ett):** Visa kundbetyg på produkter bredvid hållbarhetsindexet. `ProductCard` kan redan rita betyg (stjärna + betyg + antal) men produktdatan saknar fälten, så det syns inte. Inventera först `types/catalog.ts`, `types/product.ts`, `lib/cardProduct.ts`, `data/products.ts`, `components/ProductCard.tsx` (raden `ratings`), `app/product/[id].tsx` (rad "Hållbarhetsindex") och alla ställen som bygger produktkort (Hem-hyllor, ProductGrid, Följer, Sökresultat, Kategori- och Områdesvyer, Sparat), och rapportera om något av dem inte skickar vidare betyget.

## Gör
1. **Data.** Lägg till `rating?: number` (0–5, en decimal) och `reviewCount?: number` på `CatalogProduct` (följer med till `Product` via `toCardProduct`). Fyll alla 20 produkter i `data/products.ts` med påhittade, varierade värden: betyg mellan 3,8 och 4,9, antal omdömen mellan ca 12 och 900. **Låt två produkter sakna betyg helt** (så att fallet utan betyg syns).
2. **Produktkort.** Se till att betyget når kortet överallt (spridning av produkten räcker oftast). Raden under priset visar redan `star` (fylld) + betyg + (antal) följt av `leaf` + hållbarhetsindex, i samma dämpade färg och storlek. Rör inte stil eller layout, men kontrollera att raden inte bryts på smala kort (masonry i Följer, 169 breda) och att antalet kortas eller utelämnas om det inte får plats, hellre än att radbrytas.
3. **Produktdetalj.** Lägg raden **"Betyg"** direkt ovanför "Hållbarhetsindex" i faktalistan, med värdet "4,6 av 5 (128 omdömen)". Produkter utan betyg: visa ingen betygsrad (inget "0" eller "saknas").
4. **Formatering.** Svensk decimal (komma), samma `formatScore` som hållbarhet.

## Utanför scope (flagga, bygg inte)
Omdömen i text, att kunna lämna betyg, sortera eller filtrera på betyg, betyg i dialogens produktkort om de inte redan går via samma komponent (rapportera), riktig data.

## Verifiering
tsc, Metro, simulator mörkt och ljust: ett kort med betyg, ett utan, masonry i Följer, produktkort i Hitta-resultat, Produktdetalj. Rapport: `docs/briefs/60-rapport.md` (kort). Uppdatera `docs/design.md`/`docs/designsystem.md` om kortregeln ändras, annars bara nämn i rapporten. Committa, inkl. briefen, och pusha.
