import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTS } from '../data/products';
import { Product } from '../types/product';

const STORAGE_KEY = '@kroona/savedProductIds';

type SavedProductsContextValue = {
  savedProducts: Product[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
};

const SavedProductsContext = createContext<SavedProductsContextValue | null>(null);

export function SavedProductsProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setSavedIds(new Set(JSON.parse(raw)));
        }
      } catch (error) {
        console.warn('Kunde inte läsa sparade produkter från AsyncStorage', error);
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(savedIds))).catch(
      (error) => console.warn('Kunde inte spara produkter till AsyncStorage', error)
    );
  }, [savedIds, isHydrated]);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isSaved = (id: string) => savedIds.has(id);

  const savedProducts = useMemo(
    () => PRODUCTS.filter((product) => savedIds.has(product.id)),
    [savedIds]
  );

  return (
    <SavedProductsContext.Provider value={{ savedProducts, isSaved, toggleSaved }}>
      {children}
    </SavedProductsContext.Provider>
  );
}

export function useSavedProducts() {
  const context = useContext(SavedProductsContext);
  if (!context) {
    throw new Error('useSavedProducts måste användas inom en SavedProductsProvider');
  }
  return context;
}
