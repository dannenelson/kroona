// "Så räknar vi" (brief 70): dummyuppdelning av ett hållbarhetsindex i fyra
// delposter. DUMMYDATA i Fas 0: ingen riktig beräkning eller verifiering.
// Delposterna härleds stabilt ur indexet och ett frö (produktens/företagets id)
// och justeras så att medelvärdet, avrundat till en decimal, är exakt indexet.

export type IndexPart = { label: string; score: number; text: string };

const PARTS: readonly { label: string; text: string }[] = [
  { label: 'Material', text: 'Andel återvunnet eller certifierat material.' },
  { label: 'Tillverkning', text: 'Energi, kemikalier och arbetsvillkor i produktionen.' },
  { label: 'Transport', text: 'Fraktsätt och avstånd från tillverkning till lager.' },
  { label: 'Företagets redovisning', text: 'Hur öppet företaget redovisar sin hållbarhet.' },
];

/** Förskjutningar som summerar till 0 (variation mellan delposterna). */
const PATTERNS: readonly number[][] = [
  [0.4, -0.3, 0.2, -0.3],
  [-0.2, 0.5, -0.4, 0.1],
  [0.3, 0.1, -0.5, 0.1],
  [-0.4, -0.1, 0.3, 0.2],
  [0.2, -0.4, 0.1, 0.1],
];

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number) => Math.min(5, Math.max(1, n));

function hash(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/** Medelvärdet avrundat till en decimal, som indexet visas. */
export const meanOf = (parts: readonly IndexPart[]) =>
  round1(parts.reduce((sum, p) => sum + p.score, 0) / parts.length);

export function indexBreakdown(index: number, seed: string): IndexPart[] {
  const target = round1(index);
  const offsets = PATTERNS[hash(seed) % PATTERNS.length];
  const scores = offsets.map((o) => round1(clamp(target + o)));
  // Justera i steg om 0,1 (den delpost som har mest utrymme) tills medelvärdet stämmer.
  for (let guard = 0; guard < 100 && round1(scores.reduce((a, b) => a + b, 0) / scores.length) !== target; guard++) {
    const up = scores.reduce((a, b) => a + b, 0) / scores.length < target;
    const i = up
      ? scores.indexOf(Math.min(...scores.filter((s) => s < 5)))
      : scores.indexOf(Math.max(...scores.filter((s) => s > 1)));
    if (i < 0) break;
    scores[i] = round1(scores[i] + (up ? 0.1 : -0.1));
  }
  return PARTS.map((p, i) => ({ ...p, score: scores[i] }));
}
