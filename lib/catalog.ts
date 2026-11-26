// Urvalsfunktioner för datamodellen (brief 12). Rena funktioner: all data tas
// som argument med appens dummydata som standard, så att de går att testa med
// egna data. Produktlistor returneras i kortformatet (Product) som ProductCard läser.
import type { Area, IdeaFilter, Offer, OfferCondition, Retailer } from '../types/catalog';
import type { Product } from '../types/product';
import type { Collection } from '../data/collections';
import { PRODUCTS } from '../data/products';
import { OFFERS } from '../data/offers';
import { RETAILERS } from '../data/retailers';

export { toCardProduct } from './cardProduct';

const byPrice = (a: Offer, b: Offer) => a.price - b.price;

/** Erbjudanden för en produkt, valfritt filtrerade på skick och sorterade på pris. */
export function getOffers(
  productId: string,
  opts: { condition?: OfferCondition; sort?: 'price' } = {},
  offers: readonly Offer[] = OFFERS,
): Offer[] {
  const list = offers.filter(
    (o) => o.productId === productId && (!opts.condition || o.condition === opts.condition),
  );
  return opts.sort === 'price' ? [...list].sort(byPrice) : list;
}

/** "Köp hos": nya erbjudanden, sorterbara (default pris). */
export function getNewOffers(
  productId: string,
  sort: 'price' | 'none' = 'price',
  offers: readonly Offer[] = OFFERS,
): Offer[] {
  return getOffers(productId, { condition: 'new', sort: sort === 'price' ? 'price' : undefined }, offers);
}

/**
 * "Finns begagnad hos": begagnade erbjudanden grupperade per tjänst, med fast
 * prissortering (billigast först inom gruppen, grupperna efter sitt lägsta pris).
 */
export function getUsedOffersByService(
  productId: string,
  offers: readonly Offer[] = OFFERS,
  retailers: readonly Retailer[] = RETAILERS,
): { retailer: Retailer; offers: Offer[] }[] {
  const used = getOffers(productId, { condition: 'used', sort: 'price' }, offers);
  const groups = new Map<string, Offer[]>();
  for (const o of used) groups.set(o.retailerId, [...(groups.get(o.retailerId) ?? []), o]);
  return [...groups.entries()]
    .map(([retailerId, list]) => ({ retailer: retailers.find((r) => r.id === retailerId), offers: list }))
    .filter((g): g is { retailer: Retailer; offers: Offer[] } => g.retailer !== undefined)
    .sort((a, b) => a.offers[0].price - b.offers[0].price);
}

/** Alla bilder för en produkt: kanonisk bild först, sedan eventuella extra. */
export function getProductImages(product: { imageUrl: string; images?: string[] }): string[] {
  return [product.imageUrl, ...(product.images ?? [])];
}

/** Lägsta pris för en produkt, valfritt per skick. `undefined` om inget erbjudande finns. */

export function getLowestPrice(
  productId: string,
  condition?: OfferCondition,
  offers: readonly Offer[] = OFFERS,
): number | undefined {
  const prices = getOffers(productId, { condition }, offers).map((o) => o.price);
  return prices.length ? Math.min(...prices) : undefined;
}

/** Om produkten finns begagnad (för en signal på korten senare). */
export function hasUsedOffer(productId: string, offers: readonly Offer[] = OFFERS): boolean {
  return offers.some((o) => o.productId === productId && o.condition === 'used');
}

/** Återförsäljare efter id. */
export function getRetailer(
  retailerId: string,
  retailers: readonly Retailer[] = RETAILERS,
): Retailer | undefined {
  return retailers.find((r) => r.id === retailerId);
}

/**
 * Varumärkets profil (brief 65, tillägg): återförsäljaren av typen varumärke
 * vars `brandName` är produktens märke. Undefined om märket saknar profil.
 */
export function getRetailerForBrand(
  brand: string,
  retailers: readonly Retailer[] = RETAILERS,
): Retailer | undefined {
  return retailers.find((r) => r.retailerType === 'brand' && r.brandName === brand);
}

/**
 * Produkter för en återförsäljare: för ett varumärke alla produkter med det
 * märket, för en butik eller tjänst alla produkter den har erbjudanden på.
 */
export function getProductsForRetailer(
  retailerId: string,
  products: readonly Product[] = PRODUCTS,
  offers: readonly Offer[] = OFFERS,
  retailers: readonly Retailer[] = RETAILERS,
): Product[] {
  const retailer = getRetailer(retailerId, retailers);
  if (!retailer) return [];
  if (retailer.retailerType === 'brand') {
    return products.filter((p) => p.brand === retailer.brandName);
  }
  const ids = new Set(offers.filter((o) => o.retailerId === retailerId).map((o) => o.productId));
  return products.filter((p) => ids.has(p.id));
}

/** Produkter i en samling (varumärke, stil eller utvalda produkter). */
export function getProductsForCollection(
  collection: Collection,
  products: readonly Product[] = PRODUCTS,
): Product[] {
  const { filter } = collection;
  if (filter.type === 'products') return products.filter((p) => filter.ids.includes(p.id));
  return filter.type === 'brand'
    ? products.filter((p) => p.brand === filter.value)
    : products.filter((p) => p.style === filter.value);
}

/** Produkter i ett område: kategori, stilar och/eller möbeltyper (alla villkor som anges). */
export function getProductsForArea(area: Area, products: readonly Product[] = PRODUCTS): Product[] {
  return getProductsForFilter(area.filter, products);
}

/**
 * Produkter för ett urval (område eller idé, brief 53): alla villkor som anges
 * måste gälla. Pris är kortets pris (lägsta nya, annars lägsta begagnade).
 */
export function getProductsForFilter(filter: IdeaFilter, products: readonly Product[] = PRODUCTS): Product[] {
  const { category, styles, types, newOnly, maxPrice, material } = filter;
  const mat = material?.toLowerCase();
  return products.filter(
    (p) =>
      (!category || p.category === category) &&
      (!styles || styles.includes(p.style)) &&
      (!types || (p.type !== undefined && types.includes(p.type))) &&
      (!newOnly || !!p.isNew) &&
      (maxPrice === undefined || p.price <= maxPrice) &&
      (!mat || !!p.facts?.material?.toLowerCase().includes(mat)),
  );
}

/**
 * Liknande produkter, enkel regel: samma kategori krävs, sedan poäng för samma
 * stil och samma möbeltyp. Högst poäng först, stabil ordning vid lika.
 */
export function getSimilarProducts(
  productId: string,
  limit = 8,
  products: readonly Product[] = PRODUCTS,
): Product[] {
  const base = products.find((p) => p.id === productId);
  if (!base) return [];
  return products
    .filter((p) => p.id !== productId && p.category === base.category)
    .map((p, i) => ({
      p,
      i,
      score: (p.style === base.style ? 2 : 0) + (base.type && p.type === base.type ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.p);
}
