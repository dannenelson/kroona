import type { Product } from '../types/product';
import { PRODUCTS } from './products';
import { PRODUCT_IMAGES as I } from './productImages';
import { hasUsedOffer } from '../lib/catalog';

// Kategorier (brief 53, 54): Kläder, Möbler och Begagnat. Begagnat är ett
// skick, inte en produkttyp: alla produkter med ett begagnat erbjudande.
// Pillarna i kategorivyn härleds ur datan och visas bara om de ger träffar.
// Kläder saknar typ i datan (typ finns bara för möbler), så Kläder delas på kön.

export type CategoryId = 'klader' | 'mobler' | 'begagnat';

export interface CategoryPill {
  label: string;
  match: (p: Product) => boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  /** Kortbild på Hitta (ett enda foto). */
  image: string;
  match: (p: Product) => boolean;
  /** Pillar efter "Alla", i ordning. */
  pills: CategoryPill[];
}

const GENDER_LABEL = { dam: 'Dam', herr: 'Herr', unisex: 'Unisex' } as const;
const TYPE_LABEL: Record<NonNullable<Product['type']>, string> = {
  stol: 'Stolar',
  soffa: 'Soffor',
  bord: 'Bord',
  förvaring: 'Förvaring',
  belysning: 'Belysning',
  matta: 'Mattor',
  textil: 'Textil',
  dekor: 'Dekor',
  teknik: 'Teknik',
};

export const CATEGORIES: Category[] = [
  {
    id: 'klader',
    name: 'Kläder',
    image: I.blazerRed,
    match: (p) => p.category === 'kläder',
    pills: (Object.keys(GENDER_LABEL) as (keyof typeof GENDER_LABEL)[]).map((g) => ({
      label: GENDER_LABEL[g],
      match: (p) => p.gender === g,
    })),
  },
  {
    id: 'mobler',
    name: 'Möbler',
    image: I.chairArmchairWhite,
    match: (p) => p.category === 'möbler',
    pills: (Object.keys(TYPE_LABEL) as NonNullable<Product['type']>[]).map((t) => ({
      label: TYPE_LABEL[t],
      match: (p) => p.type === t,
    })),
  },
  {
    id: 'begagnat',
    name: 'Begagnat',
    image: I.chairRattan,
    match: (p) => hasUsedOffer(p.id),
    pills: [
      { label: 'Kläder', match: (p) => p.category === 'kläder' },
      { label: 'Möbler', match: (p) => p.category === 'möbler' },
    ],
  },
];

export const getCategory = (id: string | undefined) => CATEGORIES.find((c) => c.id === id);

export function getCategoryProducts(category: Category, products: readonly Product[] = PRODUCTS): Product[] {
  return products.filter(category.match);
}

/** "Alla" + de pillar som ger minst en träff i kategorin. */
export function getCategoryPills(category: Category, products: readonly Product[] = PRODUCTS): CategoryPill[] {
  const inCategory = getCategoryProducts(category, products);
  return [
    { label: 'Alla', match: () => true },
    ...category.pills.filter((pill) => inCategory.some(pill.match)),
  ];
}
