import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLLECTIONS } from '../data/collections';

const STORAGE_KEY = '@kroona/followedCollectionIds';

type FollowedCollectionsContextValue = {
  followedCollectionIds: string[];
  isFollowed: (id: string) => boolean;
  toggleFollowed: (id: string) => void;
};

const FollowedCollectionsContext = createContext<FollowedCollectionsContextValue | null>(null);

export function FollowedCollectionsProvider({ children }: { children: React.ReactNode }) {
  const [followedIds, setFollowedIds] = useState<Set<string>>(
    () => new Set(COLLECTIONS.map((c) => c.id))
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw !== null) {
          // Ett sparat värde finns redan (kan vara en tom lista om
          // användaren avföljt allt) — använd det, skriv inte över med default.
          setFollowedIds(new Set(JSON.parse(raw)));
        }
        // raw === null: inget sparat tidigare -> behåll default (alla följs).
      } catch (error) {
        console.warn('Kunde inte läsa följda samlingar från AsyncStorage', error);
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(followedIds))).catch(
      (error) => console.warn('Kunde inte spara följda samlingar till AsyncStorage', error)
    );
  }, [followedIds, isHydrated]);

  const toggleFollowed = (id: string) => {
    setFollowedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isFollowed = (id: string) => followedIds.has(id);

  const followedCollectionIds = useMemo(() => Array.from(followedIds), [followedIds]);

  return (
    <FollowedCollectionsContext.Provider
      value={{ followedCollectionIds, isFollowed, toggleFollowed }}
    >
      {children}
    </FollowedCollectionsContext.Provider>
  );
}

export function useFollowedCollections() {
  const context = useContext(FollowedCollectionsContext);
  if (!context) {
    throw new Error('useFollowedCollections måste användas inom en FollowedCollectionsProvider');
  }
  return context;
}
