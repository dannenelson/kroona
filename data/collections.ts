import { PRODUCTS } from './products';
import { Product, ProductStyle } from '../types/product';

export type CollectionFilter =
  | { type: 'brand'; value: string }
  | { type: 'style'; value: ProductStyle };

export interface Collection {
  id: string;
  name: string;
  tag: string;
  imageUrl: string;
  filter: CollectionFilter;
}

export const COLLECTIONS: Collection[] = [
  {
    id: '1',
    name: 'J.Lindeberg',
    tag: 'Varumärke',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    filter: { type: 'brand', value: 'J.Lindeberg' },
  },
  {
    id: '4',
    name: 'Filippa K',
    tag: 'Varumärke',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
    filter: { type: 'brand', value: 'Filippa K' },
  },
  {
    id: '2',
    name: 'Skandinavisk stil',
    tag: 'Tema',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    filter: { type: 'style', value: 'Skandinavisk' },
  },
  {
    id: '3',
    name: 'Urban stil',
    tag: 'Tema',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    filter: { type: 'style', value: 'Urban' },
  },
];

export function getCollectionProducts(collection: Collection): Product[] {
  const { filter } = collection;
  return filter.type === 'brand'
    ? PRODUCTS.filter((p) => p.brand === filter.value)
    : PRODUCTS.filter((p) => p.style === filter.value);
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
