/** 1995 → "1 995" (mellanslag som tusentalsavgränsare, design.md §4). */
export function formatPrice(price: number): string {
  return String(Math.round(price)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** 4.2 → "4,2" */
export function formatScore(score: number): string {
  return score.toFixed(1).replace('.', ',');
}
