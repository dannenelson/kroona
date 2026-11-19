import type { CatalogProduct, Offer } from '../types/catalog';
import type { Product } from '../types/product';

/**
 * Adapter (brief 12): härleder det gamla kortformatet från produkt + erbjudanden,
 * så att befintliga komponenter och skärmar fungerar oförändrade.
 *  - price  = lägsta nya pris, annars lägsta begagnade
 *  - isUsed = inga nya erbjudanden (bara begagnat)
 *  - isNew  = isNewArrival (märket "Nyhet")
 * Ingen import av data här, så att data/products.ts kan använda den utan cykel.
 */
export function toCardProduct(product: CatalogProduct, offers: readonly Offer[]): Product {
  const own = offers.filter((o) => o.productId === product.id);
  const newPrices = own.filter((o) => o.condition === 'new').map((o) => o.price);
  const usedPrices = own.filter((o) => o.condition === 'used').map((o) => o.price);
  const price = newPrices.length ? Math.min(...newPrices) : usedPrices.length ? Math.min(...usedPrices) : 0;
  const card: Product = { ...product, price };
  if (product.isNewArrival) card.isNew = true;
  if (newPrices.length === 0 && usedPrices.length > 0) card.isUsed = true;
  if (product.facts?.material) card.material = product.facts.material;
  return card;
}
