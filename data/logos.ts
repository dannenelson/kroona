// Logotyper (brief 47). DUMMYDATA: tillfälligt demomaterial i assets/dummy/,
// tillhör respektive varumärke och ska bytas eller tas bort före publik release
// (docs/produkt.md). Alla filer är SVG i 90 × 45-ram.
// - Återförsäljare: färg från filen (vit, röd eller rosa), ritas på en mörk
//   platta (BrandLogo, `overlay.logoPlate`).
// - Samlingar/områden: vita, ritas över foto i stället för titeln (EditorialCard).
import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';
import FilippaK from '../assets/dummy/logos/retailers/filippa-k.svg';
import Hm from '../assets/dummy/logos/retailers/hm.svg';
import Lindex from '../assets/dummy/logos/retailers/lindex.svg';
import NordicNest from '../assets/dummy/logos/retailers/nordic-nest.svg';
import RoyalDesign from '../assets/dummy/logos/retailers/royal-design.svg';
import GamingDeluxe from '../assets/dummy/logos/collections/gaming-deluxe.svg';
import HandlaHallbart from '../assets/dummy/logos/collections/handla-hallbart.svg';
import ScandinaviskDesign from '../assets/dummy/logos/collections/scandinavisk-design.svg';
import SecondHand from '../assets/dummy/logos/collections/second-hand.svg';
import SecondLife from '../assets/dummy/logos/collections/second-life.svg';
import SmartaHem from '../assets/dummy/logos/collections/smarta-hem.svg';

export type LogoComponent = FC<SvgProps>;

/** Logotypfilernas proportion (90 × 45). */
export const LOGO_ASPECT = 2;

/** Återförsäljare (retailer-id) → logotyp. */
export const RETAILER_LOGOS: Record<string, LogoComponent> = {
  'brand-filippa-k': FilippaK,
  'brand-hm': Hm,
  'brand-lindex': Lindex,
  'store-nordic-nest': NordicNest,
  'store-royal-design': RoyalDesign,
};

/**
 * Hur stor del av 90 × 45-ramen logotypens längsta synliga sida tar (brief 65),
 * uppmätt ur filernas banor. BrandLogo skalar ramen så att den synliga
 * logotypen blir lika stor oavsett hur mycket luft filen har.
 */
export const RETAILER_LOGO_FILL: Record<string, number> = {
  'brand-filippa-k': 0.59,
  'brand-hm': 0.5,
  'brand-lindex': 0.89,
  'store-nordic-nest': 0.72,
  'store-royal-design': 0.98,
};

/** Samling eller område (id) → vit logotyp som ersätter titeln på kort. */
export const COLLECTION_LOGOS: Record<string, LogoComponent> = {
  '2': ScandinaviskDesign, // Skandinavisk stil
  'k-smarta-hem': SmartaHem,
  'k-gaming-deluxe': GamingDeluxe,
  'k-handla-hallbart': HandlaHallbart,
  'k-second-hand': SecondHand, // ersätter området "Begagnad mode" (fanns inte, brief 48)
  'k-second-life': SecondLife,
};

/** Alla logotyper, för provytan på dev-sidan. */
export const ALL_RETAILER_LOGO_FILES: { name: string; Logo: LogoComponent }[] = [
  { name: 'Filippa K', Logo: FilippaK },
  { name: 'H&M', Logo: Hm },
  { name: 'Lindex', Logo: Lindex },
  { name: 'Nordic Nest', Logo: NordicNest },
  { name: 'Royal Design', Logo: RoyalDesign },
];
export const ALL_COLLECTION_LOGO_FILES: { name: string; Logo: LogoComponent }[] = [
  { name: 'Gaming Deluxe', Logo: GamingDeluxe },
  { name: 'Handla hållbart', Logo: HandlaHallbart },
  { name: 'Scandinavisk design', Logo: ScandinaviskDesign },
  { name: 'Second hand', Logo: SecondHand },
  { name: 'Second life', Logo: SecondLife },
  { name: 'Smarta hem', Logo: SmartaHem },
];
