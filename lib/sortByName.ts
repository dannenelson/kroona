// Alfabetisk sortering i svensk ordning (brief 42): Å, Ä, Ö sist och tal i
// naturlig ordning ("Samling 2" före "Samling 10"), skiftlägesokänsligt.
// Sorteringen görs vid visning; lagringsordningen rörs inte.

let collator: Intl.Collator | null = null;
try {
  collator = new Intl.Collator('sv', { sensitivity: 'base', numeric: true });
} catch {
  collator = null;
}

// Reserv om Intl.Collator saknas: svenska bokstäver efter z, tal jämförs som tal.
const SWEDISH_TAIL: Record<string, string> = { å: '{', ä: '|', ö: '}' };
const fallbackKey = (s: string) =>
  s
    .toLocaleLowerCase()
    .replace(/[åäö]/g, (c) => SWEDISH_TAIL[c] ?? c)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

function fallbackCompare(a: string, b: string): number {
  const pa = fallbackKey(a).match(/\d+|\D+/g) ?? [];
  const pb = fallbackKey(b).match(/\d+|\D+/g) ?? [];
  for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
    const x = pa[i];
    const y = pb[i];
    const nx = /^\d/.test(x) ? Number(x) : NaN;
    const ny = /^\d/.test(y) ? Number(y) : NaN;
    const d = !Number.isNaN(nx) && !Number.isNaN(ny) ? nx - ny : x < y ? -1 : x > y ? 1 : 0;
    if (d !== 0) return d;
  }
  return pa.length - pb.length;
}

/** Jämför två namn i svensk ordning. */
export function compareNames(a: string, b: string): number {
  return collator ? collator.compare(a, b) : fallbackCompare(a, b);
}

/** Ny lista sorterad A–Ö på namn (originalet muteras inte). */
export function sortByName<T>(items: readonly T[], getName: (item: T) => string): T[] {
  return [...items].sort((x, y) => compareNames(getName(x), getName(y)));
}

/** Sant om Intl.Collator finns (för verifiering/rapport). */
export const hasIntlCollator = collator !== null;
