// Följer-flödet (brief 59), dummylogik utan backend. Pinterest-principen:
// det man följer och inspiration baserad på det blandas jämnt, i slumpad
// ordning som byts varje gång fliken öppnas och vid pull-to-refresh.
// Ingen källa visas på korten. Riktig rekommendation är Fas 1+.
import type { Area } from '../types/catalog';
import type { Product } from '../types/product';
import { AREAS } from '../data/areas';
import { ALL_COLLECTIONS, getPersonCollections } from '../data/collections';
import { PRODUCTS } from '../data/products';
import { getProductsForArea, getProductsForCollection, getProductsForRetailer, getRetailer } from './catalog';

/** Hur många kort flödet visar som mest (ingen oändlig scroll i Fas 0). */
export const FEED_LIMIT = 40;

/** Det man följer: nycklarna i följ-lagringen (samlingar, varumärken/butiker, områden) och personer. */
export type FollowState = { followedKeys: readonly string[]; followedPeopleIds: readonly string[] };

/** Följda områden, i följ-ordning (för pillarna). */
export function getFollowedAreas(followedKeys: readonly string[], areas: readonly Area[] = AREAS): Area[] {
  return followedKeys.map((k) => areas.find((a) => a.id === k)).filter((a): a is Area => !!a);
}

/** Om man följer något alls (annars visas tomläget). */
export function followsAnything({ followedKeys, followedPeopleIds }: FollowState): boolean {
  return followedKeys.length > 0 || followedPeopleIds.length > 0;
}

/**
 * (a) Produkter från allt man följer: samlingar (även varumärkens filtersamlingar),
 * varumärken och butiker (butiker via erbjudanden), områden och personers samlingar.
 */
export function getFollowedProducts({ followedKeys, followedPeopleIds }: FollowState): Product[] {
  const out = new Map<string, Product>();
  const add = (list: Product[]) => list.forEach((p) => out.set(p.id, p));
  for (const key of followedKeys) {
    const area = AREAS.find((a) => a.id === key);
    if (area) {
      add(getProductsForArea(area));
      continue;
    }
    const collection = ALL_COLLECTIONS.find((c) => c.id === key);
    if (collection) {
      add(getProductsForCollection(collection));
      continue;
    }
    if (getRetailer(key)) add(getProductsForRetailer(key));
  }
  for (const personId of followedPeopleIds) {
    getPersonCollections(personId).forEach((c) => add(getProductsForCollection(c)));
  }
  return [...out.values()];
}

/**
 * (b) Inspiration: produkter som inte kommer från en följd källa men delar
 * kategori, typ eller stil med något följt.
 */
export function getInspirationProducts(followed: readonly Product[], products: readonly Product[] = PRODUCTS): Product[] {
  const ids = new Set(followed.map((p) => p.id));
  const categories = new Set(followed.map((p) => p.category));
  const styles = new Set(followed.map((p) => p.style));
  const types = new Set(followed.map((p) => p.type).filter(Boolean));
  return products.filter(
    (p) => !ids.has(p.id) && (categories.has(p.category) || styles.has(p.style) || (!!p.type && types.has(p.type))),
  );
}

/** Liten deterministisk slump (mulberry32): samma frö ger samma ordning vid omritning. */
function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(list: readonly T[], rand: () => number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Nytt frö för en ny blandning (fliken öppnas, pull-to-refresh). */
export const newFeedSeed = () => Math.floor(Math.random() * 2 ** 31);

/**
 * Flödet: följt och inspiration var för sig i slumpad ordning, sedan blandade
 * jämnt (följt/inspiration turas om, med slumpad start), ingen produkt två gånger.
 * Det som blir över när den ena tar slut läggs sist.
 */
export function buildFollowFeed(state: FollowState, seed: number, limit = FEED_LIMIT): Product[] {
  const rand = random(seed);
  const followed = getFollowedProducts(state);
  const a = shuffle(followed, rand);
  const b = shuffle(getInspirationProducts(followed), rand);
  const out: Product[] = [];
  let takeA = rand() < 0.5;
  while ((a.length || b.length) && out.length < limit) {
    const next = (takeA && a.length) || !b.length ? a.shift() : b.shift();
    if (next) out.push(next);
    takeA = !takeA;
  }
  return out;
}

/** Bildproportioner i masonry (bredd / höjd): stående 3:4 och 2:3, 4:5, kvadrat. */
export const MASONRY_RATIOS = [3 / 4, 2 / 3, 4 / 5, 1] as const;

/**
 * Kortets bildproportion i masonry. Produktbildens egen proportion om den finns,
 * avrundad till närmaste tillåtna (liggande bilder blir kvadrat och beskärs);
 * annars en stabil proportion härledd från id (samma produkt, samma proportion).
 */
export function masonryRatio(product: Pick<Product, 'id' | 'aspectRatio'>): number {
  if (product.aspectRatio) {
    return MASONRY_RATIOS.reduce((best, r) =>
      Math.abs(r - product.aspectRatio!) < Math.abs(best - product.aspectRatio!) ? r : best,
    );
  }
  let h = 0;
  for (const ch of product.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return MASONRY_RATIOS[h % MASONRY_RATIOS.length];
}

/**
 * Lägger korten i två kolumner: varje nytt kort hamnar i den kolumn som för
 * tillfället är kortast (bildhöjd + en fast texthöjd per kort).
 */
export function layoutMasonry<T>(items: readonly T[], imageHeight: (item: T) => number, extra: number): [T[], T[]] {
  const cols: [T[], T[]] = [[], []];
  const heights = [0, 0];
  for (const item of items) {
    const i = heights[0] <= heights[1] ? 0 : 1;
    cols[i].push(item);
    heights[i] += imageHeight(item) + extra;
  }
  return cols;
}
