// Egna samlingar (brief 32), samma mönster som SavedProductsContext och
// FollowedCollectionsContext: state i minnet, AsyncStorage som lagring.
// "Gillade produkter" (SavedProductsContext, hjärtat) är INTE en samling
// (brief 35): en produkt kan vara både gillad och i samlingar, oberoende.
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserCollection } from '../types/catalog';

const STORAGE_KEY = '@kroona/userCollections';

/** Id för "Gillade produkter" i routes (`/collection/saved`, samma vy som samlingar). */
export const ALL_SAVED_ID = 'saved';
export const ALL_SAVED_NAME = 'Gillade produkter';

type UserCollectionsContextValue = {
  userCollections: UserCollection[];
  getUserCollection: (id: string) => UserCollection | undefined;
  /** Skapar en tom samling och returnerar dess id. */
  createCollection: (name: string, visibility: UserCollection['visibility']) => string;
  /** Lägger till en produkt i en egen samling (oberoende av Gillade produkter).
   *  Används från "Lägg till i samling" (senare brief). */
  addProductToCollection: (collectionId: string, productId: string) => void;
  /** Tar bort en produkt ur en egen samling (Lägg till i samling, brief 36). */
  removeProductFromCollection: (collectionId: string, productId: string) => void;
};

const UserCollectionsContext = createContext<UserCollectionsContextValue | null>(null);

export function UserCollectionsProvider({ children }: { children: React.ReactNode }) {
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setCollections(JSON.parse(raw));
      } catch (error) {
        console.warn('Kunde inte läsa egna samlingar från AsyncStorage', error);
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(collections)).catch((error) =>
      console.warn('Kunde inte spara egna samlingar till AsyncStorage', error),
    );
  }, [collections, isHydrated]);

  const createCollection = (name: string, visibility: UserCollection['visibility']) => {
    // Avgränsare `_`, inte `:` (används i boundary-id:n, se ProductCard).
    // Tid + slumpdel, så att två samlingar skapade i samma millisekund inte krockar.
    const id = `uc_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    setCollections((prev) => [
      ...prev,
      { id, name: name.trim(), visibility, productIds: [], createdAt: new Date().toISOString() },
    ]);
    return id;
  };

  const addProductToCollection = (collectionId: string, productId: string) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId && !c.productIds.includes(productId)
          ? { ...c, productIds: [...c.productIds, productId] }
          : c,
      ),
    );
  };

  const removeProductFromCollection = (collectionId: string, productId: string) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId ? { ...c, productIds: c.productIds.filter((id) => id !== productId) } : c,
      ),
    );
  };

  const getUserCollection = (id: string) => collections.find((c) => c.id === id);

  return (
    <UserCollectionsContext.Provider
      value={{
        userCollections: collections,
        getUserCollection,
        createCollection,
        addProductToCollection,
        removeProductFromCollection,
      }}
    >
      {children}
    </UserCollectionsContext.Provider>
  );
}

export function useUserCollections() {
  const context = useContext(UserCollectionsContext);
  if (!context) {
    throw new Error('useUserCollections måste användas inom en UserCollectionsProvider');
  }
  return context;
}
