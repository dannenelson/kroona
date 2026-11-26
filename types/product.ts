export type ProductCategory = 'kläder' | 'möbler' | 'elektronik';

export type ProductStyle =
  | 'Minimalistisk'
  | 'Skandinavisk'
  | 'Urban'
  | 'Vintage'
  | 'Sportig'
  | 'Lyxig';

export type ClothingGender = 'dam' | 'herr' | 'unisex';
export type ClothingAgeGroup = 'ung' | 'vuxen' | 'senior';

export type FurnitureType =
  | 'stol'
  | 'soffa'
  | 'bord'
  | 'förvaring'
  | 'belysning'
  | 'matta'
  | 'textil'
  | 'dekor'
  | 'teknik';

import type { CatalogProduct } from './catalog';

/**
 * Kortformatet som befintliga komponenter och skärmar läser (brief 12):
 * den kanoniska produkten plus fält som härleds från erbjudandena.
 * Byggs av `toCardProduct` i lib/cardProduct.ts, inte för hand.
 */
export interface Product extends CatalogProduct {
  /** Lägsta nya pris, annars lägsta begagnade. */
  price: number;
  /** Märket "Nyhet" (= isNewArrival). */
  isNew?: boolean;
  /** Bara begagnat: produkten har inga nya erbjudanden. */
  isUsed?: boolean;
  /** Bakåtkompatibelt: samma som facts.material. */
  material?: string;
}
