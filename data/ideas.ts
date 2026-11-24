import type { IdeaFilter } from '../types/catalog';
import { PRODUCT_IMAGES as I } from './productImages';

// Idéer för dig (brief 53): färdiga sökningar på Hitta. Tryck öppnar
// Sökresultat direkt (ingen dialog). `filter` har samma form som områdenas
// (data/areas.ts) plus nyheter, maxpris och material. Varje idé ger minst
// två träffar i dummykatalogen. DUMMYDATA (Fas 0).
export interface Idea {
  id: string;
  title: string;
  image: string;
  filter: IdeaFilter;
}

export const IDEAS: Idea[] = [
  {
    // Smarta hem-samlingen är teknik och belysning; nyheterna där är högtalaren och pendlarna.
    id: 'idea-smarta-hem-nyheter',
    title: 'Nyheter inom Smarta hem',
    image: I.speakerSmart,
    filter: { category: 'möbler', types: ['teknik', 'belysning'], newOnly: true },
  },
  {
    // Briefens "Stickat i ull" gav en träff (ponchon); ersatt med läder (fyra träffar).
    id: 'idea-lader',
    title: 'Klassiskt i läder',
    image: I.bagSaddle,
    filter: { category: 'kläder', material: 'läder' },
  },
  {
    // Briefens "Belysning under 2 000 kr" gav noll träffar (en lampa, 2 395 kr); ersatt.
    id: 'idea-presenter-1000',
    title: 'Presenter under 1 000 kr',
    image: I.sunglasses,
    filter: { maxPrice: 1000 },
  },
];

export const getIdea = (id: string | undefined) => IDEAS.find((i) => i.id === id);
