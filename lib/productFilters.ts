// Delade produktfilter (brief 59): Följers pillar (Alla, Kläder, Möbler,
// Begagnat och följda områden). Skrivna för att kunna återanvändas av Hems
// pillar senare (de rörs inte än). Rena funktioner, all data som argument.
import type { Area, Offer } from '../types/catalog';
import type { Product } from '../types/product';
import { AREAS } from '../data/areas';
import { OFFERS } from '../data/offers';
import { getProductsForArea, hasUsedOffer } from './catalog';

export type ProductFilter =
  | { kind: 'all' }
  | { kind: 'category'; category: Product['category'] }
  | { kind: 'used' }
  | { kind: 'area'; areaId: string };

/** En pill: etikett och filter. */
export type FilterOption = { label: string; filter: ProductFilter };

/** De fasta pillarna, i ordning. */
export const BASE_FILTER_OPTIONS: readonly FilterOption[] = [
  { label: 'Alla', filter: { kind: 'all' } },
  { label: 'Kläder', filter: { kind: 'category', category: 'kläder' } },
  { label: 'Möbler', filter: { kind: 'category', category: 'möbler' } },
  { label: 'Begagnat', filter: { kind: 'used' } },
];

/** Fasta pillar + en pill per område (t.ex. de följda), i den ordning områdena ges. */
export function filterOptionsWithAreas(areas: readonly Area[]): FilterOption[] {
  return [
    ...BASE_FILTER_OPTIONS,
    ...areas.map((a) => ({ label: a.name, filter: { kind: 'area', areaId: a.id } as const })),
  ];
}

/**
 * Om en produkt matchar filtret. Begagnat = har begagnat erbjudande (samma regel
 * som Sökresultat och kategorin Begagnat); område = områdets urval.
 */
export function matchesFilter(
  product: Product,
  filter: ProductFilter,
  areas: readonly Area[] = AREAS,
  offers: readonly Offer[] = OFFERS,
): boolean {
  switch (filter.kind) {
    case 'all':
      return true;
    case 'category':
      return product.category === filter.category;
    case 'used':
      return hasUsedOffer(product.id, offers);
    case 'area': {
      const area = areas.find((a) => a.id === filter.areaId);
      return !!area && getProductsForArea(area, [product]).length > 0;
    }
  }
}

/** Produkterna som matchar filtret, i samma ordning. */
export function filterProducts(
  products: readonly Product[],
  filter: ProductFilter,
  areas: readonly Area[] = AREAS,
  offers: readonly Offer[] = OFFERS,
): Product[] {
  return products.filter((p) => matchesFilter(p, filter, areas, offers));
}
