// Följda personer (brief 37), samma mönster som FollowedCollectionsContext men
// egen AsyncStorage-nyckel och TOM från start (ingen förvald följning).
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@kroona/followedPeopleIds';

type FollowedPeopleContextValue = {
  followedPeopleIds: string[];
  isFollowingPerson: (id: string) => boolean;
  toggleFollowPerson: (id: string) => void;
};

const FollowedPeopleContext = createContext<FollowedPeopleContextValue | null>(null);

export function FollowedPeopleProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setIds(JSON.parse(raw));
      })
      .catch((error) => console.warn('Kunde inte läsa följda personer från AsyncStorage', error))
      .finally(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids)).catch((error) =>
      console.warn('Kunde inte spara följda personer till AsyncStorage', error),
    );
  }, [ids, isHydrated]);

  const value = useMemo<FollowedPeopleContextValue>(
    () => ({
      followedPeopleIds: ids,
      isFollowingPerson: (id) => ids.includes(id),
      toggleFollowPerson: (id) =>
        setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    }),
    [ids],
  );

  return <FollowedPeopleContext.Provider value={value}>{children}</FollowedPeopleContext.Provider>;
}

export function useFollowedPeople() {
  const context = useContext(FollowedPeopleContext);
  if (!context) throw new Error('useFollowedPeople måste användas inom en FollowedPeopleProvider');
  return context;
}
