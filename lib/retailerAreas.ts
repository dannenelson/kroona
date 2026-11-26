// Vilka områden ett företag finns i (brief 65), till raden under namnet på
// Partnerdetaljens hero, t.ex. "Möbler · Hemmakontor". Datan har inga områden
// per företag, så de härleds ur företagets produkter (getProductsForRetailer):
// 1. Kategorierna Kläder och Möbler som någon produkt tillhör.
// 2. "Begagnat" för andrahandstjänster.
// 3. Områdena (data/areas.ts) där minst en av företagets produkter ingår.
// Högst `limit` delar, i den ordningen.
import { AREAS } from '../data/areas';
import { CATEGORIES } from '../data/categories';
import { getProductsForArea, getProductsForRetailer, getRetailer } from './catalog';

export function getRetailerAreas(retailerId: string, limit = 3): string[] {
  const retailer = getRetailer(retailerId);
  if (!retailer) return [];
  const products = getProductsForRetailer(retailerId);
  const categories = CATEGORIES.filter((c) => c.id !== 'begagnat' && products.some(c.match)).map((c) => c.name);
  const used = retailer.retailerType === 'secondhand' ? ['Begagnat'] : [];
  const areas = AREAS.filter((a) => getProductsForArea(a, products).length > 0).map((a) => a.name);
  return [...categories, ...used, ...areas].slice(0, limit);
}
