// Mjuka bindestreck (U+00AD) i kort-titlar: långa sammansatta ord får brytas
// på sammansättningsgränsen, med bindestreck, i stället för mitt i ordet.
// Ett mjukt bindestreck syns bara när raden faktiskt bryts där.
//
// Fas 0: avstavningspunkterna är satta för hand för titlarna i dummydatan
// (områden och samlingar som visas med titel på kort). Ingen automatisk
// avstavning; blir innehållet levande (Fas 1+) behövs en riktig lösning
// (ordlista eller avstavningsbibliotek, eller avstavning i backend).

export const SOFT_HYPHEN = '­';

/** Ord → avstavningspunkter (markerade med "-"), sammansättningsgränser. */
const HYPHENATION: Record<string, string> = {
  // Områden (data/areas.ts)
  Hemmakontor: 'Hemma-kontor',
  Skandinavisk: 'Skandi-navisk',
  Vardagsuniform: 'Vardags-uniform',
  Utomhusklart: 'Utomhus-klart',
  // Samlingar (data/collections.ts)
  Höstgarderob: 'Höst-garderob',
  Sommarfavoriter: 'Sommar-favoriter',
  Vardagsrummet: 'Vardags-rummet',
  Designklassiker: 'Design-klassiker',
};

/** Lägger in mjuka bindestreck i de ord som har avstavningspunkter. Övrig text orörd. */
export function softHyphenate(text: string): string {
  return text
    .split(' ')
    .map((word) => HYPHENATION[word]?.split('-').join(SOFT_HYPHEN) ?? word)
    .join(' ');
}
