import type { Retailer } from '../types/catalog';
import { CERTIFICATIONS } from './certifications';

// Återförsäljare (brief 12, gallrade i brief 48). DUMMYDATA (Fas 0): varumärken
// har sina riktiga namn men bara platshållartext (inga sakpåståenden om riktiga
// bolag); Nordic Nest och Royal Design används som hembutiker i demot;
// andrahandstjänsterna är påhittade. Varje återförsäljare har minst en produkt.
// Hem- och teknikprodukternas märken (Sonora, Ljusverket, Ekens Verkstad,
// Nordform) är påhittade och har ingen egen återförsäljarsida: de säljs via butikerna.
// Hållbarhet (brief 69): bara på de påhittade andrahandstjänsterna, så att inga
// påståenden görs om riktiga bolag. Återbruket har allt, Budrummet bara index,
// övriga inget (ingen hållbarhetssektion).
const demoBrand = (name: string) => ({
  description: `Demotext: beskrivning av ${name} läggs in tillsammans med varumärket.`,
  values: 'Demotext: värdegrund läggs in tillsammans med varumärket.',
});
const demoStore = (name: string) => ({
  description: `Demotext: ${name} används som hembutik i Fas 0-demot. Beskrivningen läggs in tillsammans med butiken.`,
  values: 'Demotext: värdegrund läggs in tillsammans med butiken.',
});

export const RETAILERS: Retailer[] = [
  {
    id: 'brand-j-lindeberg',
    followers: 2860, // DUMMYDATA
    kind: 'retailer',
    name: 'J.Lindeberg',
    retailerType: 'brand',
    brandName: 'J.Lindeberg',
    ...demoBrand('J.Lindeberg'),
    presence: { online: true, stores: [] },
    initial: 'JL',
    defaultFollowed: true,
  },
  {
    id: 'brand-filippa-k',
    followers: 3410, // DUMMYDATA
    kind: 'retailer',
    name: 'Filippa K',
    retailerType: 'brand',
    brandName: 'Filippa K',
    ...demoBrand('Filippa K'),
    presence: { online: true, stores: [] },
    initial: 'FK',
    defaultFollowed: true,
  },
  {
    id: 'brand-weekday',
    followers: 2140, // DUMMYDATA
    kind: 'retailer',
    name: 'Weekday',
    retailerType: 'brand',
    brandName: 'Weekday',
    ...demoBrand('Weekday'),
    presence: { online: true, stores: [] },
    initial: 'W',
  },
  {
    id: 'brand-hm',
    followers: 4870, // DUMMYDATA
    kind: 'retailer',
    name: 'H&M',
    retailerType: 'brand',
    brandName: 'H&M',
    ...demoBrand('H&M'),
    presence: { online: true, stores: ['Stockholm', 'Göteborg', 'Malmö'] },
    initial: 'HM',
  },
  {
    id: 'brand-lindex',
    followers: 1930, // DUMMYDATA
    kind: 'retailer',
    name: 'Lindex',
    retailerType: 'brand',
    brandName: 'Lindex',
    ...demoBrand('Lindex'),
    presence: { online: true, stores: ['Göteborg', 'Stockholm'] },
    initial: 'L',
  },
  {
    id: 'store-nordic-nest',
    followers: 1560, // DUMMYDATA
    kind: 'retailer',
    name: 'Nordic Nest',
    retailerType: 'store',
    ...demoStore('Nordic Nest'),
    presence: { online: true, stores: [] },
    initial: 'NN',
  },
  {
    id: 'store-royal-design',
    followers: 1280, // DUMMYDATA
    kind: 'retailer',
    name: 'Royal Design',
    retailerType: 'store',
    ...demoStore('Royal Design'),
    presence: { online: true, stores: [] },
    initial: 'RD',
  },
  {
    id: 'sh-aterbruket',
    followers: 412, // DUMMYDATA
    kind: 'retailer',
    name: 'Återbruket',
    retailerType: 'secondhand',
    description: 'Påhittad andrahandstjänst för Fas 0. Ingen riktig verksamhet.',
    values: 'Demotext: värdegrund saknas (påhittad aktör).',
    presence: { online: true, stores: ['Uppsala'] },
    initial: 'ÅB',
    // DUMMYDATA (brief 69): påhittad hållbarhet för en påhittad aktör.
    sustainabilityIndex: 4.4,
    certifications: [CERTIFICATIONS.svanen, CERTIFICATIONS.oekoTex],
    initiatives: [
      { id: 'ab-retur', title: 'Återtag av kläder', description: 'Lämna kläder i butiken, de säljs vidare.' },
      { id: 'ab-frakt', title: 'Klimatneutral frakt', description: 'Cykelbud i Uppsala, övrigt kompenserat.' },
      { id: 'ab-lagning', title: 'Lagning på plats', description: 'Enklare lagning innan varorna säljs.' },
    ],
  },
  {
    id: 'sh-budrummet',
    followers: 268, // DUMMYDATA
    kind: 'retailer',
    name: 'Budrummet',
    retailerType: 'secondhand',
    description: 'Påhittad andrahandstjänst för Fas 0. Ingen riktig verksamhet.',
    values: 'Demotext: värdegrund saknas (påhittad aktör).',
    presence: { online: true, stores: [] },
    initial: 'BR',
    // DUMMYDATA (brief 69): bara index, för att visa en kort hållbarhetssektion.
    sustainabilityIndex: 3.7,
  },
];
