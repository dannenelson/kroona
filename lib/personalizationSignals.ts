import { COLLECTIONS } from '../data/collections';
import { Product, ProductStyle } from '../types/product';

// Delad "vad vet vi om användaren"-logik. Extraherad ur MixRow.tsx (raderna
// "Skapat för dig"/"Veckans mix") så att HeroRow.tsx kan återanvända exakt
// samma rankningssignal utan att duplicera den. Ren extraktion — beteendet
// i MixRow.tsx är oförändrat mot innan.
export type MixSignal =
  | { type: 'brand'; value: string }
  | { type: 'style'; value: ProductStyle };

export function signalKey(signal: MixSignal): string {
  return `${signal.type}:${signal.value}`;
}

// "Kända" signaler = unionen av följda samlingars filter + distinkta
// varumärken/stilar bland sparade produkter, deduplicerat.
export function getKnownSignals(
  followedCollectionIds: string[],
  savedProducts: Product[]
): MixSignal[] {
  const followedSignals: MixSignal[] = COLLECTIONS.filter((c) =>
    followedCollectionIds.includes(c.id)
  ).map((c) => c.filter);
  const savedBrandSignals: MixSignal[] = savedProducts.map((p) => ({ type: 'brand', value: p.brand }));
  const savedStyleSignals: MixSignal[] = savedProducts.map((p) => ({ type: 'style', value: p.style }));

  const byKey = new Map<string, MixSignal>();
  for (const signal of [...followedSignals, ...savedBrandSignals, ...savedStyleSignals]) {
    byKey.set(signalKey(signal), signal);
  }
  return Array.from(byKey.values());
}
