import type { Product, ProductStyle } from '../types/product';
import { getProductsForCollection, getProductsForRetailer } from '../lib/catalog';
import { RETAILERS } from './retailers';
import { getPerson } from './people';

export type CollectionFilter =
  | { type: 'brand'; value: string }
  | { type: 'style'; value: ProductStyle }
  /** Utvalda produkter (varumärkens kollektioner, brief 29). */
  | { type: 'products'; ids: string[] };

/** Vem som kuraterat samlingen (brief 29): Kroona (teman), ett varumärke
 *  (kollektioner) eller en användare (egna samlingar, byggs senare). */
export type CollectionCurator = { kind: 'kroona' | 'retailer' | 'user'; id?: string };

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
  curator: CollectionCurator;
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
    curator: { kind: 'retailer', id: 'brand-j-lindeberg' },
  },
  {
    id: '4',
    kind: 'collection',
    name: 'Filippa K',
    tag: 'Varumärke',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
    filter: { type: 'brand', value: 'Filippa K' },
    curator: { kind: 'retailer', id: 'brand-filippa-k' },
  },
  {
    id: '2',
    kind: 'collection',
    defaultFollowed: true,
    name: 'Skandinavisk stil',
    tag: 'Tema',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    filter: { type: 'style', value: 'Skandinavisk' },
    curator: { kind: 'kroona' },
  },
  {
    id: '3',
    kind: 'collection',
    name: 'Urban stil',
    tag: 'Tema',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    filter: { type: 'style', value: 'Urban' },
    curator: { kind: 'kroona' },
  },
];

// Varumärkenas egna kollektioner (brief 29), visas på Partnerdetalj.
// DUMMYDATA (Fas 0): namn, bild och urval är påhittade för att visa pilot-
// partners; i Fas 1+ skapar varumärkena dem själva. Ligger utanför COLLECTIONS
// så att Hem, Flöde och följ-standarden är oförändrade.
export const RETAILER_COLLECTIONS: Collection[] = [
  {
    id: 'jl-golf',
    kind: 'collection',
    name: 'Golf och rörelse',
    tag: 'Kollektion',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    filter: { type: 'products', ids: ['5', '7', '47', '48', '50'] },
    curator: { kind: 'retailer', id: 'brand-j-lindeberg' },
  },
  {
    id: 'jl-merino',
    kind: 'collection',
    name: 'Merino och skjortor',
    tag: 'Kollektion',
    imageUrl: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400',
    filter: { type: 'products', ids: ['1', '49', '51'] },
    curator: { kind: 'retailer', id: 'brand-j-lindeberg' },
  },
  {
    id: 'fk-ull',
    kind: 'collection',
    name: 'Ull och stickat',
    tag: 'Kollektion',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400',
    filter: { type: 'products', ids: ['2', '8', '27', '53', '55'] },
    curator: { kind: 'retailer', id: 'brand-filippa-k' },
  },
  {
    id: 'fk-basplagg',
    kind: 'collection',
    name: 'Basplagg',
    tag: 'Kollektion',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
    filter: { type: 'products', ids: ['52', '54', '56'] },
    curator: { kind: 'retailer', id: 'brand-filippa-k' },
  },
];

// Personers publika samlingar (brief 37), visas på profilvyn och under
// "Populära samlingar" på Hem. DUMMYDATA (Fas 0): påhittade personer och urval.
export const PEOPLE_COLLECTIONS: Collection[] = [
  {
    id: 'pc-maja-ull',
    kind: 'collection',
    name: 'Vinterlook i ull',
    tag: 'Samling',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400',
    filter: { type: 'products', ids: ['2', '8', '27', '53', '55', '1'] },
    curator: { kind: 'user', id: 'p-maja' },
  },
  {
    id: 'pc-maja-fynd',
    kind: 'collection',
    name: 'Bästa begagnade fynden',
    tag: 'Samling',
    imageUrl: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400',
    filter: { type: 'products', ids: ['3', '4', '6', '9', '12'] },
    curator: { kind: 'user', id: 'p-maja' },
  },
  {
    id: 'pc-oskar-hem',
    kind: 'collection',
    name: 'Litet hem, smart förvaring',
    tag: 'Samling',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    filter: { type: 'products', ids: ['10', '11', '13', '14', '15'] },
    curator: { kind: 'user', id: 'p-oskar' },
  },
  {
    id: 'pc-sara-urban',
    kind: 'collection',
    name: 'Urban på budget',
    tag: 'Samling',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    filter: { type: 'products', ids: ['5', '7', '16', '17', '18'] },
    curator: { kind: 'user', id: 'p-sara' },
  },
];

/** Alla samlingar som kan öppnas i Samlingsdetalj. */
export const ALL_COLLECTIONS: Collection[] = [...COLLECTIONS, ...RETAILER_COLLECTIONS, ...PEOPLE_COLLECTIONS];

/**
 * Kuratorn som visas i "Av …" (brief 29, 37): Kroona, varumärkets namn eller
 * personens namn, med id för att kunna öppna Partnerdetalj respektive profil.
 */
export function getCurator(
  collection: Collection,
): { name: string; retailerId?: string; personId?: string } {
  const { curator } = collection;
  if (curator.kind === 'retailer' && curator.id) {
    const r = RETAILERS.find((x) => x.id === curator.id);
    if (r) return { name: r.name, retailerId: r.id };
  }
  if (curator.kind === 'user' && curator.id) {
    const p = getPerson(curator.id);
    if (p) return { name: p.name, personId: p.id };
  }
  return { name: 'Kroona' };
}

/** En persons publika samlingar (hyllan "Samlingar" på profilvyn). */
export function getPersonCollections(personId: string): Collection[] {
  return PEOPLE_COLLECTIONS.filter((c) => c.curator.kind === 'user' && c.curator.id === personId);
}

/** Ett varumärkes egna kollektioner (hyllan "Samlingar" på Partnerdetalj). */
export function getRetailerCollections(retailerId: string): Collection[] {
  return RETAILER_COLLECTIONS.filter((c) => c.curator.kind === 'retailer' && c.curator.id === retailerId);
}

/** Varumärkets äldre filtersamling i COLLECTIONS (t.ex. J.Lindeberg), om den finns. */
export function getBrandFilterCollection(retailerId: string): Collection | undefined {
  const brand = RETAILERS.find((r) => r.id === retailerId)?.brandName;
  return COLLECTIONS.find((c) => c.filter.type === 'brand' && c.filter.value === brand);
}

/** Återförsäljaren bakom en varumärkessamling (för att öppna Partnerdetalj). */
export function getRetailerIdForBrandCollection(collection: Collection): string | undefined {
  const { filter } = collection;
  if (filter.type !== 'brand') return undefined;
  return RETAILERS.find((r) => r.retailerType === 'brand' && r.brandName === filter.value)?.id;
}

/**
 * Varumärkets omslagsbild: `Retailer` har ingen egen bild, så varumärkes-
 * samlingens bild används om den finns, annars första produktens.
 */
export function getRetailerCoverImage(retailerId: string): string | undefined {
  return getBrandFilterCollection(retailerId)?.imageUrl ?? getProductsForRetailer(retailerId)[0]?.imageUrl;
}

/**
 * Nyckeln i följ-lagringen för ett varumärke (följ-målet `{ kind: 'retailer' }`).
 * Finns varumärkets äldre filtersamling används dess id, så att Partnerdetalj,
 * "Du följer" och Flöde visar samma läge; annars återförsäljarens id.
 */
export function getRetailerFollowKey(retailerId: string): string {
  return getBrandFilterCollection(retailerId)?.id ?? retailerId;
}

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
