import type { Area } from '../types/catalog';

// Områden (brief 12): kategori eller stil med kurerat innehåll. Följbara
// (kind + id); `defaultFollowed` pekar ut förvalda följda i demot (används senare).
export const AREAS: Area[] = [
  {
    id: 'area-hemmakontor',
    kind: 'area',
    name: 'Hemmakontor',
    description: 'Stolar, bord, ljus och förvaring för att arbeta hemma.',
    filter: { category: 'möbler', types: ['stol', 'bord', 'belysning', 'förvaring', 'teknik'] },
    defaultFollowed: true,
  },
  {
    id: 'area-skandinavisk-stil',
    kind: 'area',
    name: 'Skandinavisk stil',
    description: 'Ljust, enkelt och funktionellt, i kläder och hem.',
    filter: { styles: ['Skandinavisk'] },
  },
  {
    id: 'area-mjukt-hem',
    kind: 'area',
    name: 'Mjukt hem',
    description: 'Fåtöljer, textilier och dekor som gör rummet varmare.',
    // Brief 48: katalogen saknar textil, matta och dekor, så fåtöljerna (stol) bär området.
    filter: { category: 'möbler', types: ['stol', 'textil', 'matta', 'dekor'] },
    defaultFollowed: true,
  },
  {
    id: 'area-vardagsuniform',
    kind: 'area',
    name: 'Vardagsuniform',
    description: 'Avskalade plagg som går att bära varje dag.',
    filter: { category: 'kläder', styles: ['Minimalistisk'] },
  },
  {
    id: 'area-utomhusklart',
    kind: 'area',
    name: 'Utomhusklart',
    description: 'Plagg för rörelse och väder.',
    filter: { category: 'kläder', styles: ['Sportig'] },
  },
  {
    // Brief 53: Hittas grid "Områden och stilar" har sex kort.
    id: 'area-vintage',
    kind: 'area',
    name: 'Vintage',
    description: 'Mocka, rotting och former som håller över tid.',
    filter: { styles: ['Vintage'] },
  },
];
