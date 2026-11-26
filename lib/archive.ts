// Arkiv (brief 66): tidigare sökningar och dialoger, lokalt på enheten (Fas 0,
// ingen backend eller synk). En gemensam lagring: Hittas hylla "Tidigare",
// Arkiv, Sökläget "Senaste" och "Fortsätt där du var" på Hem läser härifrån.
// Ersätter lib/recentSearches.ts (brief 53, bara 5 söktermer).

/** Ett meddelande i en sparad dialog (samma form som dialogens egna). */
export type ArchivedMessage = {
  id: string;
  role: 'user' | 'assistant' | 'error';
  text: string;
  productIds?: string[];
};

export type ArchivedSearch = { kind: 'search'; id: string; query: string; at: number };
export type ArchivedDialog = {
  kind: 'dialog';
  id: string;
  /** Första frågan. */
  title: string;
  messages: ArchivedMessage[];
  scope?: string;
  /** Senast uppdaterad (sorteringen och tiden i listorna). */
  at: number;
};
export type ArchiveEntry = ArchivedSearch | ArchivedDialog;

/** Högst så många av varje sort; äldst tas bort först. */
export const ARCHIVE_MAX = 50;

export const ARCHIVE_STORAGE_KEY = '@kroona/archive';
/** Sökläget lagrade tidigare bara söktermer här (brief 53); läses in en gång. */
export const LEGACY_RECENT_KEY = '@kroona/recentSearches';

/** Unikt id även för poster som skapas i samma millisekund. */
const uniqueId = (prefix: string, now: number) => `${prefix}-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Nyast först, högst ARCHIVE_MAX av varje sort, inga dubbletter av id. */
export function normalizeArchive(entries: readonly ArchiveEntry[]): ArchiveEntry[] {
  const seen = new Set<string>();
  const sorted = [...entries]
    .sort((a, b) => b.at - a.at)
    .filter((e) => (seen.has(e.id) ? false : (seen.add(e.id), true)));
  let searches = 0;
  let dialogs = 0;
  return sorted.filter((e) => (e.kind === 'search' ? ++searches : ++dialogs) <= ARCHIVE_MAX);
}

/** Lägger till en sökning överst; samma sökord (oavsett skiftläge) flyttas upp i stället för att dubbleras. */
export function withSearch(entries: readonly ArchiveEntry[], query: string, now = Date.now()): ArchiveEntry[] {
  const q = query.trim();
  if (!q) return [...entries];
  const rest = entries.filter((e) => !(e.kind === 'search' && e.query.toLowerCase() === q.toLowerCase()));
  return normalizeArchive([{ kind: 'search', id: uniqueId('s', now), query: q, at: now }, ...rest]);
}

/** Sparar eller uppdaterar en dialog (samma id ersätts). */
export function withDialog(entries: readonly ArchiveEntry[], dialog: ArchivedDialog): ArchiveEntry[] {
  return normalizeArchive([dialog, ...entries.filter((e) => e.id !== dialog.id)]);
}

/** Dagsgrupp för listorna: Idag, Igår eller Tidigare. */
export type ArchiveDay = 'today' | 'yesterday' | 'earlier';

function startOfDay(t: number) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function archiveDay(at: number, now = Date.now()): ArchiveDay {
  const today = startOfDay(now);
  if (at >= today) return 'today';
  if (at >= today - 24 * 60 * 60 * 1000) return 'yesterday';
  return 'earlier';
}

const MONTHS = ['jan', 'feb', 'mars', 'apr', 'maj', 'juni', 'juli', 'aug', 'sep', 'okt', 'nov', 'dec'];

/** Kort tid: "Idag", "Igår" eller datum ("12 nov"). */
export function archiveTimeLabel(at: number, now = Date.now()): string {
  const day = archiveDay(at, now);
  if (day === 'today') return 'Idag';
  if (day === 'yesterday') return 'Igår';
  const d = new Date(at);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}
