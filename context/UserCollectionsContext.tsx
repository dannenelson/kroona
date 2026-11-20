// Egna samlingar (brief 32), samma mönster som SavedProductsContext och
// FollowedCollectionsContext: state i minnet, AsyncStorage som lagring.
// "Alla sparade" är SavedProductsContext (systemsamling, alltid först), och
// egna samlingar är delmängder av den (se addProductToCollection).
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserCollection } from '../types/catalog';
import { useSavedProducts } from './SavedProductsContext';

const STORAGE_KEY = '@kroona/userCollections';

/** Id för systemsamlingen "Alla sparade" i routes (`/collection/saved`). */
export const ALL_SAVED_ID = 'saved';
export const ALL_SAVED_NAME = 'Alla sparade';

type UserCollectionsContextValue = {
  userCollections: UserCollection[];
  getUserCollection: (id: string) => UserCollection | undefined;
  /** Skapar en tom samling och returnerar dess id. */
  createCollection: (name: string, visibility: UserCollection['visibility']) => string;
  /** Lägger till en produkt i en egen samling och säkerställer att den också
   *  finns i "Alla sparade" (invarianten). Används från del 2 (spara i samling). */
  addProductToCollection: (collectionId: string, productId: string) => void;
};

const UserCollectionsContext = createContext<UserCollectionsContextValue | null>(null);

export function UserCollectionsProvider({ children }: { children: React.ReactNode }) {
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { isSaved, toggleSaved } = useSavedProducts();

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
    const id = `uc_${Date.now().toString(36)}`;
    setCollections((prev) => [
      ...prev,
      { id, name: name.trim(), visibility, productIds: [], createdAt: new Date().toISOString() },
    ]);
    return id;
  };

  const addProductToCollection = (collectionId: string, productId: string) => {
    if (!isSaved(productId)) toggleSaved(productId);
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId && !c.productIds.includes(productId)
          ? { ...c, productIds: [...c.productIds, productId] }
          : c,
      ),
    );
  };

  const getUserCollection = (id: string) => collections.find((c) => c.id === id);

  return (
    <UserCollectionsContext.Provider
      value={{ userCollections: collections, getUserCollection, createCollection, addProductToCollection }}
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
