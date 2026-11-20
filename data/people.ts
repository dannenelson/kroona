import type { Person } from '../types/catalog';

// Personer man kan följa (brief 37). DUMMYDATA (Fas 0): påhittade personer,
// inga konton. Riktig social funktion (konton, feed, notiser) är Fas 1+.
export const PEOPLE: Person[] = [
  {
    id: 'p-maja',
    kind: 'person',
    name: 'Maja Lind',
    handle: 'majalind',
    bio: 'Samlar tidlösa plagg och begagnade fynd. Mest ull, linne och jordnära färger.',
    initial: 'ML',
    followers: 1240,
  },
  {
    id: 'p-oskar',
    kind: 'person',
    name: 'Oskar Berg',
    handle: 'oskarberg',
    bio: 'Inreder små ytor. Skandinaviskt, funktionellt och gärna andra hand.',
    initial: 'OB',
    followers: 860,
  },
  {
    id: 'p-sara',
    kind: 'person',
    name: 'Sara Nilsson',
    handle: 'saranilsson',
    bio: 'Urban stil på budget. Delar det jag faktiskt använder.',
    initial: 'SN',
    followers: 2310,
  },
  {
    id: 'p-ali',
    kind: 'person',
    name: 'Ali Haddad',
    handle: 'alihaddad',
    bio: 'Löpning, friluft och kläder som håller länge.',
    initial: 'AH',
    followers: 540,
  },
  {
    id: 'p-elin',
    kind: 'person',
    name: 'Elin Ek',
    handle: 'elinek',
    bio: 'Minimalism i garderob och hem.',
    initial: 'EE',
    followers: 3080,
  },
];

export function getPerson(id: string): Person | undefined {
  return PEOPLE.find((p) => p.id === id);
}
