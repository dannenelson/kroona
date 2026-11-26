// Arkiv (brief 66): sökningar och dialoger i AsyncStorage (lib/archive.ts).
// Lokalt på enheten i Fas 0; synk mellan enheter är Fas 1+.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ARCHIVE_STORAGE_KEY,
  LEGACY_RECENT_KEY,
  normalizeArchive,
  withDialog,
  withSearch,
  type ArchiveEntry,
  type ArchivedDialog,
} from '../lib/archive';

type ArchiveValue = {
  /** Nyast först. */
  entries: ArchiveEntry[];
  addSearch: (query: string) => void;
  saveDialog: (dialog: ArchivedDialog) => void;
  getDialog: (id: string) => ArchivedDialog | undefined;
  remove: (id: string) => void;
  clear: () => void;
  /** Sant när lagringen är inläst. */
  ready: boolean;
};

const ArchiveContext = createContext<ArchiveValue | null>(null);

function isEntry(x: unknown): x is ArchiveEntry {
  if (!x || typeof x !== 'object') return false;
  const e = x as Partial<ArchiveEntry>;
  return (e.kind === 'search' || e.kind === 'dialog') && typeof e.id === 'string' && typeof e.at === 'number';
}

export function ArchiveProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(ARCHIVE_STORAGE_KEY);
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          setEntries(normalizeArchive(Array.isArray(parsed) ? parsed.filter(isEntry) : []));
        } else {
          // Första gången: ta med söktermerna som Sökläget sparade tidigare (brief 53).
          const legacy = await AsyncStorage.getItem(LEGACY_RECENT_KEY);
          const terms: unknown = legacy ? JSON.parse(legacy) : [];
          if (Array.isArray(terms)) {
            const now = Date.now();
            let next: ArchiveEntry[] = [];
            terms
              .filter((t): t is string => typeof t === 'string')
              .reverse()
              .forEach((t, i) => (next = withSearch(next, t, now - (terms.length - i) * 1000)));
            setEntries(next);
          }
        }
      } catch (error) {
        console.warn('Kunde inte läsa arkivet', error);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(entries)).catch((error) =>
      console.warn('Kunde inte spara arkivet', error),
    );
  }, [entries, ready]);

  const addSearch = useCallback((query: string) => setEntries((prev) => withSearch(prev, query)), []);
  const saveDialog = useCallback((dialog: ArchivedDialog) => setEntries((prev) => withDialog(prev, dialog)), []);
  const remove = useCallback((id: string) => setEntries((prev) => prev.filter((e) => e.id !== id)), []);
  const clear = useCallback(() => setEntries([]), []);
  const getDialog = useCallback(
    (id: string) => entries.find((e): e is ArchivedDialog => e.kind === 'dialog' && e.id === id),
    [entries],
  );

  const value = useMemo(
    () => ({ entries, addSearch, saveDialog, getDialog, remove, clear, ready }),
    [entries, addSearch, saveDialog, getDialog, remove, clear, ready],
  );
  return <ArchiveContext.Provider value={value}>{children}</ArchiveContext.Provider>;
}

export function useArchive(): ArchiveValue {
  const ctx = useContext(ArchiveContext);
  if (!ctx) throw new Error('useArchive måste användas inuti <ArchiveProvider>');
  return ctx;
}
