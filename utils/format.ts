/** 1995 → "1 995" (mellanslag som tusentalsavgränsare, design.md §4). */
export function formatPrice(price: number): string {
  return String(Math.round(price)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** 4.2 → "4,2" */
export function formatScore(score: number): string {
  return score.toFixed(1).replace('.', ',');
}

/** 1240 → "1 240 följare", 1 → "1 följare" (hårt mellanslag som tusentalsavgränsare, brief 74). */
export function formatFollowers(count: number): string {
  return `${String(Math.round(count)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}\u00A0följare`;
}
