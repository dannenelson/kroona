import type { Offer } from '../types/catalog';

// Erbjudanden (brief 12, omgjorda i brief 48): Produkt ↔ Återförsäljare. Nytt och
// begagnat ligger här, inte på produkten. DUMMYDATA (Fas 0): varje produkt har minst
// ett nytt erbjudande, nio har även begagnat (två som auktion) och fyra hemprodukter
// säljs av både Nordic Nest och Royal Design, så att jämförelsen visar något.
// Begagnat är alltid billigare än nytt. Länkar är dummy (example.com).
export const OFFERS: Offer[] = [
  { id: 'o1-1', productId: '1', retailerId: 'brand-filippa-k', price: 1495, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/filippa-k/1' },
  { id: 'o1-2', productId: '1', retailerId: 'sh-aterbruket', price: 650, condition: 'used', conditionNote: 'Mycket gott skick', pricing: 'fixed', stock: 'in_stock', shipping: 'Skickas eller hämtas i Uppsala (demo)', url: 'https://example.com/aterbruket/1' },
  { id: 'o2-1', productId: '2', retailerId: 'store-royal-design', price: 1290, condition: 'new', stock: 'in_stock', shipping: 'Leverans 1–3 dagar, Sverige (demo)', url: 'https://example.com/royal-design/2' },
  { id: 'o2-2', productId: '2', retailerId: 'sh-aterbruket', price: 650, condition: 'used', conditionNote: 'Gott skick', pricing: 'fixed', stock: 'in_stock', shipping: 'Skickas eller hämtas i Uppsala (demo)', url: 'https://example.com/aterbruket/2' },
  { id: 'o3-1', productId: '3', retailerId: 'brand-weekday', price: 1199, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/weekday/3' },
  { id: 'o4-1', productId: '4', retailerId: 'store-nordic-nest', price: 2495, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 499 kr, Norden (demo)', url: 'https://example.com/nordic-nest/4' },
  { id: 'o4-2', productId: '4', retailerId: 'store-royal-design', price: 2395, condition: 'new', stock: 'few_left', shipping: 'Leverans 1–3 dagar, Sverige (demo)', url: 'https://example.com/royal-design/4' },
  { id: 'o5-1', productId: '5', retailerId: 'brand-hm', price: 699, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/hm/5' },
  { id: 'o6-1', productId: '6', retailerId: 'brand-j-lindeberg', price: 1895, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/j-lindeberg/6' },
  { id: 'o7-1', productId: '7', retailerId: 'store-nordic-nest', price: 2290, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 499 kr, Norden (demo)', url: 'https://example.com/nordic-nest/7' },
  { id: 'o7-2', productId: '7', retailerId: 'store-royal-design', price: 2190, condition: 'new', stock: 'in_stock', shipping: 'Leverans 1–3 dagar, Sverige (demo)', url: 'https://example.com/royal-design/7' },
  { id: 'o8-1', productId: '8', retailerId: 'brand-lindex', price: 499, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/lindex/8' },
  { id: 'o9-1', productId: '9', retailerId: 'store-nordic-nest', price: 2490, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 499 kr, Norden (demo)', url: 'https://example.com/nordic-nest/9' },
  { id: 'o10-1', productId: '10', retailerId: 'brand-hm', price: 199, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/hm/10' },
  { id: 'o10-2', productId: '10', retailerId: 'sh-aterbruket', price: 89, condition: 'used', conditionNote: 'Använd, fina spår', pricing: 'fixed', stock: 'in_stock', shipping: 'Skickas eller hämtas i Uppsala (demo)', url: 'https://example.com/aterbruket/10' },
  { id: 'o11-1', productId: '11', retailerId: 'brand-filippa-k', price: 2995, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/filippa-k/11' },
  { id: 'o11-2', productId: '11', retailerId: 'sh-budrummet', price: 1200, condition: 'used', conditionNote: 'Mycket gott skick', pricing: 'auction', stock: 'in_stock', shipping: 'Skickas av säljaren efter avslutad auktion (demo)', url: 'https://example.com/budrummet/11' },
  { id: 'o12-1', productId: '12', retailerId: 'brand-j-lindeberg', price: 1695, condition: 'new', stock: 'few_left', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/j-lindeberg/12' },
  { id: 'o13-1', productId: '13', retailerId: 'brand-lindex', price: 899, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/lindex/13' },
  { id: 'o13-2', productId: '13', retailerId: 'sh-aterbruket', price: 399, condition: 'used', conditionNote: 'Gott skick', pricing: 'fixed', stock: 'in_stock', shipping: 'Skickas eller hämtas i Uppsala (demo)', url: 'https://example.com/aterbruket/13' },
  { id: 'o14-1', productId: '14', retailerId: 'store-royal-design', price: 6995, condition: 'new', stock: 'in_stock', shipping: 'Leverans 1–3 dagar, Sverige (demo)', url: 'https://example.com/royal-design/14' },
  { id: 'o14-2', productId: '14', retailerId: 'sh-aterbruket', price: 3900, condition: 'used', conditionNote: 'Mycket gott skick', pricing: 'fixed', stock: 'in_stock', shipping: 'Skickas eller hämtas i Uppsala (demo)', url: 'https://example.com/aterbruket/14' },
  { id: 'o15-1', productId: '15', retailerId: 'brand-weekday', price: 1499, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/weekday/15' },
  { id: 'o16-1', productId: '16', retailerId: 'store-nordic-nest', price: 4995, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 499 kr, Norden (demo)', url: 'https://example.com/nordic-nest/16' },
  { id: 'o16-2', productId: '16', retailerId: 'sh-budrummet', price: 2400, condition: 'used', conditionNote: 'Använd, fina spår', pricing: 'auction', stock: 'in_stock', shipping: 'Skickas av säljaren efter avslutad auktion (demo)', url: 'https://example.com/budrummet/16' },
  { id: 'o17-1', productId: '17', retailerId: 'store-nordic-nest', price: 4495, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 499 kr, Norden (demo)', url: 'https://example.com/nordic-nest/17' },
  { id: 'o17-2', productId: '17', retailerId: 'store-royal-design', price: 4695, condition: 'new', stock: 'out_of_stock', shipping: 'Leverans 1–3 dagar, Sverige (demo)', url: 'https://example.com/royal-design/17' },
  { id: 'o17-3', productId: '17', retailerId: 'sh-budrummet', price: 2600, condition: 'used', conditionNote: 'Gott skick', pricing: 'fixed', stock: 'in_stock', shipping: 'Skickas av säljaren efter avslutad auktion (demo)', url: 'https://example.com/budrummet/17' },
  { id: 'o18-1', productId: '18', retailerId: 'brand-filippa-k', price: 2195, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/filippa-k/18' },
  { id: 'o19-1', productId: '19', retailerId: 'brand-lindex', price: 799, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 500 kr, Sverige (demo)', url: 'https://example.com/lindex/19' },
  { id: 'o19-2', productId: '19', retailerId: 'sh-aterbruket', price: 349, condition: 'used', conditionNote: 'Mycket gott skick', pricing: 'fixed', stock: 'in_stock', shipping: 'Skickas eller hämtas i Uppsala (demo)', url: 'https://example.com/aterbruket/19' },
  { id: 'o20-1', productId: '20', retailerId: 'store-nordic-nest', price: 5995, condition: 'new', stock: 'in_stock', shipping: 'Fri frakt över 499 kr, Norden (demo)', url: 'https://example.com/nordic-nest/20' },
  { id: 'o20-2', productId: '20', retailerId: 'store-royal-design', price: 5795, condition: 'new', stock: 'few_left', shipping: 'Leverans 1–3 dagar, Sverige (demo)', url: 'https://example.com/royal-design/20' },
];
