# Rapport brief 28: Samlingsdetalj

**Byggt:**
- Ny route `app/collection/[id].tsx`, registrerad i rotens BlankStack (`collectionScreenOptions`).
- Uppifrån:
  - cover 4:5 med namnet överlagt (`typography.display`, Familjen Grotesk, på foto-scrim);
  - samma toppkant som Produktdetalj (EdgeFade, TopBar i glas med tillbaka, titel som tonar in vid scroll);
  - metadata "N produkter · Kroona · Varumärke/Tema";
  - Följ/Följer (`Pill`);
  - text-flikar (`TextTabs`);
  - masonry (`ProductGrid` compact). Produkterna öppnar Produktdetalj med zoom.
- Innehållet under covern tonas in i slutet av övergången (direkt med Minska rörelse).
- Hela skärmen är en `Transition.ScrollView`.

**Rörelse:**
- Produktens options är parametriserade, inte kopierade: `hierarchyScreenOptions(group)` ger `productScreenOptions` (grupp `product`) och `collectionScreenOptions` (grupp `collection`).
- Samlingskortet (`PartnerCard` i `CollectionRow` på Hem) är tryckbart. Bilden har ett unikt boundary-id per kortinstans (`id_useId`, route-param `b`), samma mönster som ProductCard.

**Verifierat i simulatorn** (tillfälligt automatiskt tryck, borttaget):
- Tryck på J.Lindeberg zoomar upp samlingen ur kortet med Hem bakom.
- Skärmen visar cover, metadata, Följer, flikarna Alla · Minimalistisk · Sportig · Nytt och masonry.
- Djupet Hem → Samling → Produkt → Produkt och stängning steg för steg landar rätt varje gång, utan fel bakgrund.
- tsc, iOS-export och grep är gröna. Ingen debug-rest finns kvar.

**Kräver enhet:** swipe ned och kantswipe, zoom från produktkort i samlingens grid tillbaka till rätt kort, och ljust tema visuellt (bara tokens används).

**Beslut (invänd gärna):**
- **Flikar** härleds ur datan och visas aldrig tomma: Alla · kategori (bara om fler än en) · stil (bara för varumärkessamlingar med fler än en stil) · Nytt (om någon är ny).
- **Följ:** befintliga `FollowedCollectionsContext` (AsyncStorage). Ingen ny lagring.
- **Beskrivning:** hoppas över. `Collection` har inget sådant fält, och ingen ny datamodell.
- **Ingångar:** bara `CollectionRow` på Hem, eftersom den visar `data/collections.ts`. "Populära samlingar" (`CollectionCard`) är statiska dummy-kort utan samlingsdata och navigerar fortfarande ingenstans. Flödet har inga samlingskort.

**Flaggas, inte åtgärdat:**
- `wireframes.md` §3 säger att PartnerCard ska leda till Partnerdetalj, men på Hem används PartnerCard för samlingar (varumärke och tema). Det behöver redas ut när Partnerdetalj byggs.
- `FollowedCollectionsContext` följer alla samlingar som standard och ignorerar `defaultFollowed` i datan.
- "Populära samlingar" behöver riktig samlingsdata, eller egna samlingar (Fas 1), för att kunna öppnas.
