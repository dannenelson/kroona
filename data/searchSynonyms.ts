// Sökord som inte står på produkterna (brief 53, lib/search.ts). Ett sökord
// matchar en produkt om ordet själv ELLER något av alternativen nedan finns i
// produktens text (namn, märke, typ, kategori, stil, material). Rumsord pekar
// på möbeltyper; svenska ord pekar på de engelska produktnamnen (även färger,
// eftersom katalogen saknar färgfält). DUMMYDATA (Fas 0), gemener.
export const SEARCH_SYNONYMS: Record<string, readonly string[]> = {
  // Rum och behov
  vardagsrum: ['stol', 'soffa', 'bord', 'belysning', 'teknik'],
  kontor: ['stol', 'bord', 'belysning', 'teknik', 'förvaring'],
  hemmakontor: ['stol', 'bord', 'belysning', 'teknik', 'förvaring'],
  sovrum: ['belysning', 'textil', 'förvaring', 'fåtölj', 'armchair'],
  hem: ['möbler'],
  inredning: ['möbler'],
  present: ['teknik', 'belysning', 'bag', 'tote', 'sunglasses', 'poncho'],
  smart: ['teknik'],
  smarta: ['teknik'],
  // Saker
  lampa: ['belysning', 'pendant'],
  lampor: ['belysning', 'pendant'],
  fåtölj: ['armchair', 'lounge chair'],
  stolar: ['stol', 'chair'],
  soffbord: ['coffee table'],
  skor: ['sneaker', 'boots'],
  sneakers: ['sneaker'],
  kängor: ['boots'],
  stövlar: ['boots'],
  väska: ['bag', 'tote', 'backpack', 'daypack'],
  väskor: ['bag', 'tote', 'backpack', 'daypack'],
  ryggsäck: ['backpack', 'daypack'],
  hörlurar: ['headphones'],
  högtalare: ['speaker'],
  kavaj: ['blazer'],
  jacka: ['blazer', 'poncho'],
  solglasögon: ['sunglasses'],
  glasögon: ['sunglasses'],
  stickat: ['knit'],
  // Färger
  svart: ['black'],
  röd: ['red'],
  vit: ['white'],
  blå: ['navy'],
  brun: ['saddle', 'oak', 'suede'],
  mässing: ['brass'],
};

/** Småord som inte avgränsar sökningen. */
export const SEARCH_STOPWORDS: ReadonlySet<string> = new Set([
  'och', 'i', 'till', 'för', 'en', 'ett', 'med', 'på', 'av', 'under', 'kr', 'stil', 'inom',
]);
