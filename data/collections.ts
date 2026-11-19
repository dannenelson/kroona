import type { Product, ProductStyle } from '../types/product';
import { getProductsForCollection } from '../lib/catalog';

export type CollectionFilter =
  | { type: 'brand'; value: string }
  | { type: 'style'; value: ProductStyle };

export interface Collection {
  id: string;
  /** Följbar (brief 12): kind + id. */
  kind: 'collection';
  /** Förvald följd i demot (bara data, logiken byggs senare). */
  defaultFollowed?: boolean;
  name: string;
  tag: string;
  imageUrl: string;
  filter: CollectionFilter;
}

export const COLLECTIONS: Collection[] = [
  {
    id: '1',
    kind: 'collection',
    defaultFollowed: true,
    name: 'J.Lindeberg',
    tag: 'Varumärke',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    filter: { type: 'brand', value: 'J.Lindeberg' },
  },
  {
    id: '4',
    kind: 'collection',
    name: 'Filippa K',
    tag: 'Varumärke',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
    filter: { type: 'brand', value: 'Filippa K' },
  },
  {
    id: '2',
    kind: 'collection',
    defaultFollowed: true,
    name: 'Skandinavisk stil',
    tag: 'Tema',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    filter: { type: 'style', value: 'Skandinavisk' },
  },
  {
    id: '3',
    kind: 'collection',
    name: 'Urban stil',
    tag: 'Tema',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    filter: { type: 'style', value: 'Urban' },
  },
];

// Flyttad till lib/catalog.ts (brief 12). Behålls här som samma API, så att
// befintliga anrop fungerar oförändrade.
export function getCollectionProducts(collection: Collection): Product[] {
  return getProductsForCollection(collection);
}

// Hur många av en samlings produkter som är märkta isNew. Produktmodellen
// saknar helt ett datumfält (inget dateAdded/createdAt finns någonstans i
// katalogen), så det här är den bästa tillgängliga approximationen av
// "senast tillkommet innehåll" — en känd begränsning i datamodellen, inte
// ett förbiseende. Används för att sortera "Du följer" så samlingen med
// mest nytt innehåll visas först.
export function getCollectionNewCount(collection: Collection): number {
  return getCollectionProducts(collection).filter((p) => p.isNew).length;
}
