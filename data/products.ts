import type { CatalogProduct } from '../types/catalog';
import { NEW_PRODUCTS } from './newProducts';
import { CATALOG_TOPUP } from './catalogTopup';
import { OFFERS } from './offers';
import { toCardProduct } from '../lib/cardProduct';
import type { Product } from '../types/product';

// Kanoniska produkter (brief 12): varan utan pris och skick. Pris, nytt och
// begagnat finns på erbjudandena i data/offers.ts.
export const CATALOG: CatalogProduct[] = [
  {
    id: '1',
    brand: 'J.Lindeberg',
    name: 'Slim Merino Crewneck',
    imageUrl: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400',
    sustainabilityScore: 4.2,
    isNewArrival: true,
    aspectRatio: 3 / 4,
    category: 'kläder',
    style: 'Minimalistisk',
  },
  {
    id: '2',
    brand: 'Filippa K',
    name: 'Relaxed Wool Blazer',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400',
    sustainabilityScore: 4.6,
    aspectRatio: 4 / 5,
    category: 'kläder',
    style: 'Minimalistisk',
  },
  {
    id: '3',
    brand: 'Weekday',
    name: 'Oversized Denim Jacket',
    imageUrl: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400',
    sustainabilityScore: 3.1,
    aspectRatio: 1 / 1,
    category: 'kläder',
    style: 'Urban',
  },
  {
    id: '4',
    brand: 'Our Legacy',
    name: 'Box Shirt Poplin',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400',
    sustainabilityScore: 3.8,
    aspectRatio: 3 / 4,
    category: 'kläder',
    style: 'Minimalistisk',
  },
  {
    id: '5',
    brand: 'J.Lindeberg',
    name: 'Tech Jersey Pants',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    sustainabilityScore: 4.0,
    isNewArrival: true,
    aspectRatio: 5 / 4,
    category: 'kläder',
    style: 'Sportig',
  },
  {
    id: '6',
    brand: 'Our Legacy',
    name: 'Wool Trousers',
    imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400',
    sustainabilityScore: 4.3,
    aspectRatio: 3 / 4,
    category: 'kläder',
    style: 'Minimalistisk',
  },
  ...NEW_PRODUCTS,
  ...CATALOG_TOPUP,
];

// Kortformatet som befintliga komponenter läser (price, isNew, isUsed),
// härlett från erbjudandena. Samma ordning och värden som före brief 12.
export const PRODUCTS: Product[] = CATALOG.map((p) => toCardProduct(p, OFFERS));
