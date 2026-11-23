import type { Product, ProductStyle } from '../types/product';
import { getProductsForCollection, getProductsForRetailer } from '../lib/catalog';
import { RETAILERS } from './retailers';
import { getPerson } from './people';
import { CATALOG } from './products';

// Samlingarnas omslag tas från en av produkternas bilder (brief 48).
const PRODUCTS_BY_ID: Record<string, string> = Object.fromEntries(CATALOG.map((p) => [p.id, p.imageUrl]));

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

const img = (id: string) => PRODUCTS_BY_ID[id];

export const COLLECTIONS: Collection[] = [
  {
    id: '1',
    kind: 'collection',
    defaultFollowed: true,
    name: 'J.Lindeberg',
    tag: 'Varumärke',
    imageUrl: img('6'),
    filter: { type: 'brand', value: 'J.Lindeberg' },
    curator: { kind: 'retailer', id: 'brand-j-lindeberg' },
  },
  {
    id: '4',
    kind: 'collection',
    name: 'Filippa K',
    tag: 'Varumärke',
    imageUrl: img('1'),
    filter: { type: 'brand', value: 'Filippa K' },
    curator: { kind: 'retailer', id: 'brand-filippa-k' },
  },
  {
    id: '2',
    kind: 'collection',
    defaultFollowed: true,
    name: 'Skandinavisk stil',
    tag: 'Tema',
    imageUrl: img('17'),
    filter: { type: 'style', value: 'Skandinavisk' },
    curator: { kind: 'kroona' },
  },
  {
    id: '3',
    kind: 'collection',
    name: 'Urban stil',
    tag: 'Tema',
    imageUrl: img('15'),
    filter: { type: 'style', value: 'Urban' },
    curator: { kind: 'kroona' },
  },
  // Kroonas redaktionella samlingar med logotyp (brief 48, logotyper i data/logos.ts).
  {
    id: 'k-smarta-hem',
    kind: 'collection',
    name: 'Smarta hem',
    tag: 'Tema',
    imageUrl: img('7'),
    filter: { type: 'products', ids: ['7', '4', '9', '2'] },
    curator: { kind: 'kroona' },
  },
  {
    id: 'k-gaming-deluxe',
    kind: 'collection',
    name: 'Gaming Deluxe',
    tag: 'Tema',
    imageUrl: img('9'),
    filter: { type: 'products', ids: ['9', '2', '7', '14'] },
    curator: { kind: 'kroona' },
  },
  {
    id: 'k-handla-hallbart',
    kind: 'collection',
    name: 'Handla hållbart',
    tag: 'Tema',
    imageUrl: img('16'),
    // De sju produkterna med högst hållbarhetspoäng (4,3–4,8).
    filter: { type: 'products', ids: ['17', '16', '14', '1', '4', '20', '8'] },
    curator: { kind: 'kroona' },
  },
  {
    id: 'k-second-hand',
    kind: 'collection',
    name: 'Second Hand',
    tag: 'Tema',
    imageUrl: img('19'),
    // Kläder som också finns begagnade.
    filter: { type: 'products', ids: ['1', '11', '13', '19', '10'] },
    curator: { kind: 'kroona' },
  },
  {
    id: 'k-second-life',
    kind: 'collection',
    name: 'Second Life',
    tag: 'Tema',
    imageUrl: img('16'),
    // Hemprodukter som också finns begagnade.
    filter: { type: 'products', ids: ['16', '14', '17', '2'] },
    curator: { kind: 'kroona' },
  },
];

// Varumärkenas och butikernas egna kollektioner (brief 29, omgjorda i brief 48),
// visas på Partnerdetalj. DUMMYDATA (Fas 0): namn och urval är påhittade; i Fas 1+
// skapar återförsäljarna dem själva. Bara kollektioner med minst 2 produkter.
export const RETAILER_COLLECTIONS: Collection[] = [
  {
    id: 'jl-sneakers',
    kind: 'collection',
    name: 'Sneakers',
    tag: 'Kollektion',
    imageUrl: img('12'),
    filter: { type: 'products', ids: ['6', '12'] },
    curator: { kind: 'retailer', id: 'brand-j-lindeberg' },
  },
  {
    id: 'fk-host',
    kind: 'collection',
    name: 'Höstgarderob',
    tag: 'Kollektion',
    imageUrl: img('1'),
    filter: { type: 'products', ids: ['1', '11', '18'] },
    curator: { kind: 'retailer', id: 'brand-filippa-k' },
  },
  {
    id: 'fk-vaskor',
    kind: 'collection',
    name: 'Väskor',
    tag: 'Kollektion',
    imageUrl: img('11'),
    filter: { type: 'products', ids: ['11', '18'] },
    curator: { kind: 'retailer', id: 'brand-filippa-k' },
  },
  {
    id: 'wd-urban',
    kind: 'collection',
    name: 'Urban vardag',
    tag: 'Kollektion',
    imageUrl: img('15'),
    filter: { type: 'products', ids: ['3', '15'] },
    curator: { kind: 'retailer', id: 'brand-weekday' },
  },
  {
    id: 'hm-sommar',
    kind: 'collection',
    name: 'Sommarfavoriter',
    tag: 'Kollektion',
    imageUrl: img('5'),
    filter: { type: 'products', ids: ['5', '10'] },
    curator: { kind: 'retailer', id: 'brand-hm' },
  },
  {
    id: 'lx-host',
    kind: 'collection',
    name: 'Höst i stan',
    tag: 'Kollektion',
    imageUrl: img('19'),
    filter: { type: 'products', ids: ['19', '13', '8'] },
    curator: { kind: 'retailer', id: 'brand-lindex' },
  },
  {
    id: 'nn-vardagsrum',
    kind: 'collection',
    name: 'Vardagsrummet',
    tag: 'Kollektion',
    imageUrl: img('17'),
    filter: { type: 'products', ids: ['17', '20', '4', '16'] },
    curator: { kind: 'retailer', id: 'store-nordic-nest' },
  },
  {
    id: 'rd-klassiker',
    kind: 'collection',
    name: 'Designklassiker',
    tag: 'Kollektion',
    imageUrl: img('14'),
    filter: { type: 'products', ids: ['14', '20', '4'] },
    curator: { kind: 'retailer', id: 'store-royal-design' },
  },
];

// Personers publika samlingar (brief 37, omgjorda i brief 48), visas på profilvyn
// och under "Populära samlingar" på Hem. DUMMYDATA (Fas 0): påhittade personer och urval.
export const PEOPLE_COLLECTIONS: Collection[] = [
  {
    id: 'pc-maja-ull',
    kind: 'collection',
    name: 'Höstlook i ull och mocka',
    tag: 'Samling',
    imageUrl: img('1'),
    filter: { type: 'products', ids: ['1', '13', '19', '11'] },
    curator: { kind: 'user', id: 'p-maja' },
  },
  {
    id: 'pc-maja-fynd',
    kind: 'collection',
    name: 'Bästa begagnade fynden',
    tag: 'Samling',
    imageUrl: img('16'),
    filter: { type: 'products', ids: ['16', '14', '10', '13'] },
    curator: { kind: 'user', id: 'p-maja' },
  },
  {
    id: 'pc-oskar-hem',
    kind: 'collection',
    name: 'Litet hem, stora favoriter',
    tag: 'Samling',
    imageUrl: img('17'),
    filter: { type: 'products', ids: ['17', '20', '4', '7'] },
    curator: { kind: 'user', id: 'p-oskar' },
  },
  {
    id: 'pc-sara-urban',
    kind: 'collection',
    name: 'Urban på budget',
    tag: 'Samling',
    imageUrl: img('3'),
    filter: { type: 'products', ids: ['3', '10', '15', '5'] },
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
 * "Du följer" och Följer visar samma läge; annars återförsäljarens id.
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
