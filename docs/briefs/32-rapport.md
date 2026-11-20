# Rapport brief 32: Sparat, del 1

**Byggt:**
- **Datamodell och lagring:** `UserCollection { id, name, visibility, productIds, createdAt }` i `types/catalog.ts`. Ny `UserCollectionsContext` med AsyncStorage (`@kroona/userCollections`), i samma stil som de befintliga. Den har `createCollection` och `addProductToCollection`, som också sparar produkten i Alla sparade (invarianten, för del 2). "Alla sparade" är `SavedProductsContext` oförändrad, med route-id `saved`.
- **Sparat** (`app/(tabs)/saved.tsx`):
  - Header "Sparat" + "Ny samling", segmentet Samlingar | Följer (text-flikar).
  - Samlingar: Alla sparade, egna samlingar och "Ny samling" i 2 kolumner. Kortet är `components/saved/UserCollectionCard`, med mosaikomslag `components/CollectionMosaic`, namn, antal och Privat/Publik. Det har `useCardPress` och zoom till Samlingsdetalj.
  - Följer: PartnerCard (ny `width`-prop) för följda samlingar och varumärken, med kontextmenyns Sluta följa. Tom-vy om inget följs.
- **Ny samling:** `components/saved/NewCollectionSheet` med inbyggd `Modal` (inget nytt paket) och namn + Privat/Publik.
- **Samlingsdetalj** löser `saved`, egna samlingar och kuraterade samlingar till samma vy:
  - Egna och Alla sparade: mosaik som cover, "Av dig", "N produkter · Privat/Publik", ingen Följ, tom-vy.
  - Kuraterade: som förut.

**Verifierat i simulatorn** (tillfällig testkod, borttagen):
- lagret Ny samling;
- skapad samling "Vinterlook" med 3 produkter i gridden;
- Samlingsdetalj för den och för Alla sparade;
- segmentet Följer;
- att samlingen finns kvar efter omstart av appen.

tsc, iOS-export och grep är gröna. Zoomen från korten och gesterna kräver enhet. Simulatorns lagring innehåller nu testsamlingen "Vinterlook" och tre sparade produkter (påverkar inte din telefon).

**Beslut (invänd gärna):**
- Metadata i Samlingsdetalj har samma två rader som kuraterade samlingar ("Av dig" på egen rad, sedan "N produkter · Privat/Publik"). Briefens "N produkter · Av dig · Privat" är alltså fördelat på två rader, för att likna övriga.
- Alla sparade markeras Privat i detaljvyn men har ingen markering på kortet (systemsamling).
- Egna samlingskort har ingen kontextmeny än, eftersom de enda meningsfulla valen (döp om, radera) hör till del 2.
- Följer visar också varumärken som följs direkt via Partnerdetalj. Därför flyttades omslagslogiken till `getRetailerCoverImage` (delas med Partnerdetalj).
- Tom-vyn för Alla sparade behåller dagens text ("Tryck på hjärtat …"), eftersom ikonvalet inte ska röras nu.
- Inget nytt paket behövdes.

**Flaggas, inte åtgärdat:** spara i samling från produkt, redigera/döp om/radera, eget omslag (i `docs/idebank.md`), delning. Följer visar alla samlingar som följda från början (den kända följ-standarden).

**Spegla i Claude Project-dokumenten (Spec/Sammanställning):**
- "Gilla" heter nu "Alla sparade" (systemsamling, Instagram-modellen). Egna samlingar är delmängder, och namnet är *samling* genomgående.
- Datamodellen `UserCollection` med kurator "Av dig" (`{ kind: 'user', id: 'me' }`).
- Sparat har segmentet Samlingar | Följer, och omslaget är en mosaik av fyra produkter.
- Eget omslag ligger i idébanken.
- Del 2 (spara i samling, redigera/radera) återstår.
