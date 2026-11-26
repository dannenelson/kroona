// Notiser (brief 64). DUMMYDATA (Fas 0): inga riktiga notiser eller push.
// Tiden är en färdig etikett, grupperingen (Idag / Tidigare) är satt för hand.
import type { IconName } from '../components/Icon';

export type AppNotification = {
  id: string;
  icon: IconName;
  title: string;
  text: string;
  /** Visad tid, t.ex. "09:12" eller "I går". */
  time: string;
  group: 'today' | 'earlier';
};

export const NOTIFICATIONS: readonly AppNotification[] = [
  {
    id: 'n1',
    icon: 'shopping-bag',
    title: 'Nordform har fått 3 nya produkter',
    text: 'Fåtöljer och ljus inredning, nytt i veckan.',
    time: '09:12',
    group: 'today',
  },
  {
    id: 'n2',
    icon: 'folder',
    title: 'En samling du följer har uppdaterats',
    text: 'Skandinavisk stil har 2 nya produkter.',
    time: '08:40',
    group: 'today',
  },
  {
    id: 'n3',
    icon: 'tag',
    title: 'Lägre pris på en sparad produkt',
    text: 'Double-breasted Blazer finns nu begagnad från 349 kr.',
    time: '07:55',
    group: 'today',
  },
  {
    id: 'n4',
    icon: 'user-add',
    title: 'Maja Lind har en ny samling',
    text: 'Höstlook i ull och mocka, 4 produkter.',
    time: 'I går',
    group: 'earlier',
  },
  {
    id: 'n5',
    icon: 'stars',
    title: 'Ditt flöde har nya förslag',
    text: 'Vi har hittat mer i din stil i Följer.',
    time: 'I går',
    group: 'earlier',
  },
  {
    id: 'n6',
    icon: 'leaf',
    title: 'Handla hållbart: veckans urval',
    text: 'Begagnat och certifierat, utvalt av Kroona.',
    time: 'Mån',
    group: 'earlier',
  },
  {
    id: 'n7',
    icon: 'shopping-bag',
    title: 'Filippa K har fått 2 nya produkter',
    text: 'Väskor och höstgarderob.',
    time: 'Sön',
    group: 'earlier',
  },
];
