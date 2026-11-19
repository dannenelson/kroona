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
  filter: {
    category?: ProductCategory;
    styles?: ProductStyle[];
    types?: FurnitureType[];
  };
  defaultFollowed?: boolean;
}

/** Något som kan följas. Bara data i Fas 0-steget, logiken byggs senare. */
export type FollowTarget = { kind: 'retailer' | 'collection' | 'area'; id: string };
