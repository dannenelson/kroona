// Notiser (brief 64), dummy: listan kommer från data/notifications.ts och alla
// är olästa när appen startar. När Notiser öppnas markeras allt som läst och
// pricken på klockan försvinner. Läst-läget lagras inte (Fas 0, ingen backend):
// en omstart visar pricken igen, så att demot går att visa flera gånger.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { NOTIFICATIONS, type AppNotification } from '../data/notifications';

type NotificationsValue = {
  notifications: readonly AppNotification[];
  hasUnread: boolean;
  markAllRead: () => void;
};

const NotificationsContext = createContext<NotificationsValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [hasUnread, setHasUnread] = useState(NOTIFICATIONS.length > 0);
  const markAllRead = useCallback(() => setHasUnread(false), []);
  const value = useMemo(() => ({ notifications: NOTIFICATIONS, hasUnread, markAllRead }), [hasUnread, markAllRead]);
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications måste användas inuti <NotificationsProvider>');
  return ctx;
}
