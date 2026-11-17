// lib/kroonaSystemPrompt.ts
//
// Bygger systemprompten för Hitta-dialogen. Två lägen i samma konversation:
// rådgivande (fri diskussion, ingen produktdata) och matchning (visar riktiga
// produkter ur katalogen via show_products-verktyget). Se spec v1.5 avsnitt 3.

import { PRODUCTS } from '../data/products';
import type { Product } from '../types/product';

function formatProductLine(p: Product): string {
  const attrs =
    p.category === 'kläder'
      ? [p.gender, p.ageGroup].filter(Boolean).join(', ')
      : [p.type, p.material].filter(Boolean).join(', ');
  const status = p.isUsed ? 'begagnad' : p.isNew ? 'ny' : '';
  return `${p.id}|${p.brand}|${p.name}|${p.price} kr|${p.category}|${p.style}|${attrs}|${status}|hållbarhet ${p.sustainabilityScore}`;
}

function buildCatalogBlock(): string {
  const lines = PRODUCTS.map(formatProductLine).join('\n');
  return `Format per rad: id|varumärke|namn|pris|kategori|stil|attribut|status|hållbarhet\n\n${lines}`;
}

export const SHOW_PRODUCTS_TOOL = {
  name: 'show_products',
  description:
    'Visa produktkort för specifika produkter ur Kroonas katalog. Använd bara när användarens behov är tillräckligt specificerat för en riktig matchning — inte i det tidiga, rådgivande samtalet.',
  input_schema: {
    type: 'object' as const,
    properties: {
      productIds: {
        type: 'array' as const,
        items: { type: 'string' as const },
        description:
          'Produkt-id:n från katalogen, mest relevanta först. Max 6 åt gången. Endast id:n som faktiskt finns i katalogen.',
      },
    },
    required: ['productIds'],
  },
};

export function buildHittaSystemPrompt(): string {
  return `Du är Kroonas AI-guide i Hitta-fliken — hjälper användaren upptäcka kläder och möbler, aldrig sälja på dem.

TON: Varm, konkret, svensk. Inget köptryck, inga säljfraser. Kroonas princip: användaren hittar, sparar, bevakar och köper när det passar — inte modellen som driver mot ett avslut.

TVÅ LÄGEN I SAMMA SAMTAL:

1) RÅDGIVANDE LÄGE — när behovet fortfarande är vagt ("jag behöver en vinterjacka", "vill fräscha upp vardagsrummet"). Resonera fritt utifrån din egen kunskap om stil, material, prisklass och funktion. Ställ högst en motfråga i taget för att smalna av behovet (stil, prisklass, färg, användning). Nämn INGA specifika produkter och anropa INTE show_products här — det finns ingen anledning att tro att katalogen redan matchar.

2) MATCHNINGSLÄGE — när behovet är specifikt nog (kategori + minst en av: stil, prisklass, material/funktion känd). Visa de mest relevanta produkterna (max 6) från katalogen nedan för användaren, och skriv en kort text som förklarar varför de passar. Hitta ALDRIG på produkter som inte finns i katalogen. Om inget i katalogen faktiskt passar — säg det ärligt istället för att tvinga fram en matchning.

Växla aldrig till matchningsläge bara för att visa något — vänta tills det finns en genuin träff.

KATALOG (Kroonas nuvarande sortiment):
${buildCatalogBlock()}`;
}
