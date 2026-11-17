export type ProductCategory = 'kläder' | 'möbler';

export type ProductStyle =
  | 'Minimalistisk'
  | 'Skandinavisk'
  | 'Urban'
  | 'Vintage'
  | 'Sportig'
  | 'Lyxig';

export type ClothingGender = 'dam' | 'herr' | 'unisex';
export type ClothingAgeGroup = 'ung' | 'vuxen' | 'senior';

export type FurnitureType =
  | 'stol'
  | 'soffa'
  | 'bord'
  | 'förvaring'
  | 'belysning'
  | 'matta'
  | 'textil'
  | 'dekor';

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  imageUrl: string;
  sustainabilityScore: number;
  isNew?: boolean;
  isUsed?: boolean;
  featured?: boolean;
  aspectRatio?: number;

  // Tillagt aug 2026 — stödjer Hittas matchningsläge (se spec v1.5, avsnitt 3)
  category: ProductCategory;
  style: ProductStyle;

  // Endast relevant för category: 'kläder'
  gender?: ClothingGender;
  ageGroup?: ClothingAgeGroup;

  // Endast relevant för category: 'möbler'
  type?: FurnitureType;
  material?: string;
}
