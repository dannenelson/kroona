// Senaste sökningar (brief 53): lagras lokalt, högst 5, nyaste först.
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@kroona/recentSearches';
const MAX = 5;

export async function loadRecentSearches(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string').slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export async function addRecentSearch(query: string): Promise<void> {
  const q = query.trim();
  if (!q) return;
  const prev = await loadRecentSearches();
  const next = [q, ...prev.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, MAX);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Lagringen är en bekvämlighet; misslyckas den visas bara inga senaste sökningar.
  }
}
