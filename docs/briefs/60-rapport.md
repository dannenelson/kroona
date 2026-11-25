# Rapport brief 60 – Betyg på produkter

## Inventering: vad som redan fanns
- **`ProductCard`:** ritade redan `star` (fylld), betyget och antalet `(n)` före `leaf` och hållbarheten, men bara om `rating` fanns. Raden hade `flexWrap: 'wrap'`, så den kunde brytas. Antalet är i `textTertiary` och betyget i `textSecondary`.
- **Datan:** varken `CatalogProduct` eller `Product` hade `rating`/`reviewCount`. Bara dev-sidan skickade betyg (`DEMO_RATING`).
- **`toCardProduct`:** sprider hela produkten (`{ ...product, price }`), så nya fält följer med.
- **Alla platser sprider produkten** (`{...p}`) in i `ProductCard`, så ingen behövde ändras:
  - `ProductGrid`: Sökresultat, Kategori, Område, Samling, Partner, dialogen.
  - `RecommendedProductsRow` på Hem.
  - Följer (masonry och en kolumn).
  - Liknande på Produktdetalj.
- **Dialogens produktkort** går via `ProductGrid` och `ProductCard`, så de visar betyg automatiskt.
- **Produktdetalj:** faktalistan under rubriken "Hållbarhet" började med Hållbarhetsindex. `formatScore` ger svensk decimal.

## Gjort
1. **Data:**
   - `rating?` och `reviewCount?` finns på `CatalogProduct` och följer med till `Product`.
   - 18 produkter har påhittade värden: betyg 3,8–4,9, antal 12–846.
   - **`5` (Red Runner Sneaker) och `13` (Suede Ankle Boots) saknar betyg** med avsikt.
2. **Produktkort:**
   - Raden radbryts inte längre (`nowrap`, `overflow: hidden`).
   - Om lövgruppen inte får plats på kortet utelämnas antalet `(n)`. Kortet mäter raden och lövgruppens slut.
   - Stil, färger och storlekar är oförändrade.
3. **Produktdetalj:**
   - Raden **"Betyg"** ligger direkt ovanför "Hållbarhetsindex", med värdet "4,6 av 5 (128 omdömen)" ("1 omdöme" i singular).
   - Produkter utan betyg får ingen rad.
4. **Formatering:** `formatScore`, samma som för hållbarhet.
5. **`docs/design.md`:** kortregeln om radbrytning och antal är tillagd under Betyg.

## Verifiering
- `npx tsc --noEmit`: OK. Metro på egen port 8097: buntar utan fel.
- **Simulatorn, mörkt och ljust läge:**
  - **Masonry i Följer:** kort med betyg ("★ 4,4 (23) · 🍃 4,8") och utan (Red Runner, Suede Ankle Boots: bara löv), på en rad.
  - **Sökresultat "skor":** kort med och utan betyg.
  - **Produktdetalj Fringe Knit Poncho:** "Betyg 4,6 av 5 (128 omdömen)" ovanför Hållbarhetsindex.
  - **Produktdetalj Suede Ankle Boots:** ingen betygsrad.
- **Smala kort:** på korten i Följer (ca 175) och Hem-raden "Kanske intressant" (140) räcker bredden för det längsta antalet "(846)" enligt beräkning. Att antalet faktiskt utelämnas har jag inte sett, eftersom inget kort är smalt nog i dag.
- Min Metro är stoppad, och din server på 8081 är orörd.

## Frågor och flaggor
- **"Betyg" ligger under rubriken "Hållbarhet"** på Produktdetalj, eftersom faktalistan bor där. Ska rubriken bli något bredare, till exempel "Betyg och hållbarhet", eller ska betyget ligga för sig?
- **Utanför scope (inte byggt):** omdömen i text, att lämna betyg, sortering och filter på betyg, riktig data.
