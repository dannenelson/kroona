// Lokal sökning (brief 53), utan backend. Texten delas upp i ord (gemener,
// småord bort). En produkt matchar om VARJE ord finns i namn, märke, typ,
// kategori, stil eller material, direkt, via en enkel böjning (stolar → stol)
// eller via synonymlistan (data/searchSynonyms.ts). Sortering: fler ord som
// träffar i namnet först, annars katalogens ordning.
import { PRODUCTS } from '../data/products';
import { SEARCH_STOPWORDS, SEARCH_SYNONYMS } from '../data/searchSynonyms';
import { AREAS } from '../data/areas';
import { COLLECTIONS, RETAILER_COLLECTIONS } from '../data/collections';
import type { Product } from '../types/product';

// Vanliga svenska och engelska böjningsändelser (plural, "svarta"), längst först.
const SUFFIXES = ['arna', 'erna', 'orna', 'ar', 'er', 'or', 'na', 'a', 's'];
const MIN_STEM = 3;

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9åäöéü]+/)
    .filter((w) => w.length > 0 && !SEARCH_STOPWORDS.has(w));
}

/** Ordet, dess enkla grundformer och synonymerna: någon av dem ska finnas i texten. */
function variants(word: string): string[] {
  const out = new Set<string>([word]);
  for (const s of SUFFIXES) {
    if (word.endsWith(s) && word.length - s.length >= MIN_STEM) out.add(word.slice(0, -s.length));
  }
  for (const v of [...out]) for (const syn of SEARCH_SYNONYMS[v] ?? []) out.add(syn);
  return [...out];
}

function haystack(p: Product): string {
  return [p.name, p.brand, p.type, p.category, p.style, p.facts?.material]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function searchProducts(text: string, products: readonly Product[] = PRODUCTS): Product[] {
  const words = tokenize(text);
  if (words.length === 0) return [];
  const wordVariants = words.map(variants);
  return products
    .map((p, i) => {
      const hay = haystack(p);
      const name = p.name.toLowerCase();
      const all = wordVariants.every((vs) => vs.some((v) => hay.includes(v)));
      const inName = wordVariants.filter((vs) => vs.some((v) => name.includes(v))).length;
      return { p, i, all, inName };
    })
    .filter((x) => x.all)
    .sort((a, b) => b.inName - a.inName || a.i - b.i)
    .map((x) => x.p);
}

// Sökförslag (brief 53): möbeltyper, områden och samlingsnamn. Bara förslag
// som själva ger träffar tas med, så att ett förslag aldrig leder till en tom lista.
const TYPE_TERMS = ['Stolar', 'Bord', 'Belysning', 'Teknik', 'Förvaring', 'Soffor', 'Mattor', 'Textil', 'Dekor'];

// Räknas fram första gången (katalogen är statisk i Fas 0).
let terms: string[] | null = null;
function suggestionTerms(): string[] {
  if (terms) return terms;
  const all = [...TYPE_TERMS, ...AREAS.map((a) => a.name), ...COLLECTIONS.map((c) => c.name), ...RETAILER_COLLECTIONS.map((c) => c.name)];
  const seen = new Set<string>();
  terms = all.filter((t) => {
    const key = t.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return searchProducts(t).length > 0;
  });
  return terms;
}

/** Upp till `limit` förslag som matchar texten; de som börjar med texten först. */
export function searchSuggestions(text: string, limit = 4): string[] {
  const q = text.trim().toLowerCase();
  if (!q) return [];
  const scored = suggestionTerms()
    .map((t) => {
      const l = t.toLowerCase();
      const score = l.startsWith(q) ? 2 : l.split(/\s+/).some((w) => w.startsWith(q)) ? 1 : l.includes(q) ? 0.5 : 0;
      return { t, score };
    })
    .filter((x) => x.score > 0 && x.t.toLowerCase() !== q);
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.t);
}
