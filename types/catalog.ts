// Datamodell Fas 0 (brief 12): Produkt / Återförsäljare / Erbjudande.
// Låst beslut (docs/produkt.md): nytt/begagnat är en egenskap hos Erbjudandet,
// inte hos Produkten. Se docs/produkt.md "Datamodell (Fas 0, konkret)".
import type {
  ClothingAgeGroup,
  ClothingGender,
  FurnitureType,
  ProductCategory,
  ProductStyle,
} from './product';

/** Fakta om varan, alla valfria. Visas neutralt (hållbarhet dömer aldrig). */
export interface ProductFacts {
  material?: string;
  madeIn?: string;
  certification?: string;
}

/** Själva varan, oberoende av var den säljs. Inget pris och inget skick. */
export interface CatalogProduct {
  id: string;
  brand: string;
  name: string;
  /** Kanonisk bild. */
  imageUrl: string;
  aspectRatio?: number;
  featured?: boolean;
  sustainabilityScore: number;
  /** Kundbetyg 0–5 med en decimal (brief 60). Saknas = inget betyg visas. */
  rating?: number;
  /** Antal omdömen bakom betyget. */
  reviewCount?: number;
  /** Märket "Nyhet": nytillkommen i katalogen. Inte skick (det ligger på Erbjudandet). */
  isNewArrival?: boolean;
  /** Fler bilder utöver `imageUrl` (lightboxen, brief 19). */
  images?: string[];
  category: ProductCategory;
  style: ProductStyle;
  // Bara kläder
  gender?: ClothingGender;
  ageGroup?: ClothingAgeGroup;
  // Bara möbler
  type?: FurnitureType;
  facts?: ProductFacts;
}

export type RetailerType = 'brand' | 'store' | 'secondhand';

/** Certifikat (brief 69): namn, valfri utfärdare och en rads förklaring. */
export interface Certification {
  id: string;
  name: string;
  issuer?: string;
  description: string;
}

/** Hållbart initiativ (brief 69): kort titel och en rads beskrivning. */
export interface SustainabilityInitiative {
  id: string;
  title: string;
  description: string;
}

/** Den som säljer eller står bakom varumärket. Det man följer och det Partnerdetalj visar. */
export interface Retailer {
  id: string;
  kind: 'retailer';
  name: string;
  retailerType: RetailerType;
  /** För typ 'brand': varumärkesnamnet som produkterna har i `brand`. */
  brandName?: string;
  description: string;
  values: string;
  presence: { online: boolean; stores: string[] };
  /** Initial(er) som logotyp tills riktiga logotyper finns. */
  initial: string;
  /** Förvald följd i demot (bara data, logiken byggs senare). */
  defaultFollowed?: boolean;
  /** Hållbarhetsindex 1–5, samma skala som produkternas `sustainabilityScore` (brief 69). */
  sustainabilityIndex?: number;
  /** Certifikat (brief 69). */
  certifications?: Certification[];
  /** Hållbara initiativ (brief 69). */
  initiatives?: SustainabilityInitiative[];
}

export type OfferCondition = 'new' | 'used';
/** Prisläge för begagnat: "Fast pris" eller "Auktion, bud från". */
export type OfferPricing = 'fixed' | 'auction';
export type OfferStock = 'in_stock' | 'few_left' | 'out_of_stock';

/** Koppling Produkt ↔ Återförsäljare: var och hur varan kan köpas. */
export interface Offer {
  id: string;
  productId: string;
  retailerId: string;
  /** Pris i kr. För auktion: lägsta bud. */
  price: number;
  condition: OfferCondition;
  /** Bara begagnat. */
  conditionNote?: string;
  /** Bara begagnat. */
  pricing?: OfferPricing;
  stock: OfferStock;
  /** Geografi och frakt, som text. */
  shipping: string;
  /** Länk ut (dummy i Fas 0). */
  url: string;
}

/** Område: kategori eller stil med kurerat innehåll (t.ex. Hemmakontor). */
export interface Area {
  id: string;
  kind: 'area';
  name: string;
  description: string;
  filter: AreaFilter;
  defaultFollowed?: boolean;
}

/** Ett områdes urval: alla villkor som anges måste gälla. */
export interface AreaFilter {
  category?: ProductCategory;
  styles?: ProductStyle[];
  types?: FurnitureType[];
}

/**
 * Färdig sökning (brief 53, data/ideas.ts): samma form som områdets urval,
 * plus nyheter, maxpris (lägsta pris i kortformatet) och material (delsträng).
 */
export interface IdeaFilter extends AreaFilter {
  newOnly?: boolean;
  maxPrice?: number;
  material?: string;
}

/** Något som kan följas. Bara data i Fas 0-steget, logiken byggs senare. */
export type FollowTarget = { kind: 'retailer' | 'collection' | 'area' | 'person'; id: string };

/** Användarens egen samling (brief 32), lagras lokalt (AsyncStorage) i Fas 0.
 *  Kurator `{ kind: 'user', id: 'me' }` ("Av dig"). En delmängd av "Alla sparade". */
export interface UserCollection {
  id: string;
  name: string;
  visibility: 'private' | 'public';
  productIds: string[];
  /** ISO-tid. */
  createdAt: string;
}

/** En person man kan följa (brief 37). Fas 0: dummydata, inga konton. */
export interface Person {
  id: string;
  kind: 'person';
  name: string;
  /** Utan @. */
  handle: string;
  bio: string;
  /** Initial(er) som avatar tills riktiga bilder finns. */
  initial: string;
  /** Antal följare (dummy). */
  followers: number;
}
