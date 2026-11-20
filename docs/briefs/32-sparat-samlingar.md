# Brief 32: Sparat, del 1 (egna samlingar + Följer)

Fas 0. Kör autonomt (auto mode). Rapport till `docs/briefs/32-rapport.md`. Committa (inkl. briefen) och pusha efter verifiering (tsc + iOS-export). Inga debug-rester, döda inte Daniels Expo-server. Inventera befintliga filer först (skriv inte över).

## Beslutat (Daniel, 2026-11-20)
- Namnet är **samling** (kod: `collection`) genomgående. Inget nytt ord för användarens samlingar eller varumärkens kollektioner.
- **Instagram-modellen:** ett tryck på spara-knappen sparar i en generell, alltid-existerande samling **"Alla sparade"** (ersätter "Gilla"; systemsamling: kan inte raderas eller döpas om, ligger alltid först). Egna samlingar är delmängder av den. (Ikonen, hjärta eller bokmärke, avgörs i designgenomgången. Rör den inte nu.)
- Omslag på egna samlingar = **mosaik av de fyra första produkterna**. I framtiden ska man kunna ladda upp eget omslag (som Spotify-spellistor): bygg inte det nu, men lägg det i `docs/idebank.md`.
- "Följer" visas som **segment överst i Sparat: Samlingar | Följer**.

## Scope (bara del 1)
1. **Datamodell + lagring (AsyncStorage, lokalt):** `UserCollection { id, name, visibility: 'private' | 'public', productIds: string[], createdAt }`. Ny context/hook (t.ex. `UserCollectionsContext`) i samma stil som `SavedProductsContext`/`FollowedCollectionsContext`. Kurator `{kind:'user', id:'me'}` ("Av dig"). "Alla sparade" = befintliga `SavedProductsContext` (behåll dess API och beteende, byt bara namn/etikett från Gilla). En produkt i en egen samling ska också finnas i Alla sparade (invarianten gäller när del 2 lägger till produkter; skriv hjälpfunktionen nu).
2. **Sparat-fliken** (`app/(tabs)/saved.tsx`, wireframe §8): header "Sparat" med "Ny samling"-åtgärd · textflik-segment (design.md §11) **Samlingar | Följer**.
   - *Samlingar:* 2 kolumner. Alla sparade först, sedan egna, "Ny samling"-kort sist. Kort: mosaikomslag (1–4 bilder, tomt = neutral yta), namn, antal produkter, lås/publik-markering. Återanvänd kortspråk, tryckrespons (`useCardPress`) och kontextmeny där det passar. Tom Alla sparade = tom-vy som idag.
   - *Följer:* varumärken och samlingar man följer (befintlig följ-lagring), återanvänd `PartnerCard`/samlingskort i grid, med kontextmenyns Sluta följa. Tom-vy om inget följs.
3. **Ny samling:** liten sheet/lager i designsystemets stil med namn och Privat/Publik. Skapar och lagrar. Ingen ny paketberoende utan Daniels godkännande, fråga i rapporten om något krävs.
4. **Samlingsdetalj för egna samlingar och Alla sparade:** `collection/[id]` ska kunna öppna dessa (id `saved` för Alla sparade, annars användarsamlingens id). Visa: omslag/mosaik eller enkel header, namn, metadata ("N produkter · Av dig · Privat/Publik"), masonry av produkterna, tom-vy. **Ingen** Följ-knapp för egna. Redigera, döp om, radera, flytta produkter och "spara i samling" från produkt är **del 2**, bygg inte det nu.
5. Rörelsen: öppna från Sparat-kort med samma zoom och djup som övriga detaljvyer (återanvänd delade transition-options). Mörkt/ljust tema, tokens, Minska rörelse. Ingen backend, ingen tracking.

## Utanför scope (flagga, bygg inte)
Spara i samling från produkt, redigera/radera/döp om, egna omslagsbilder, delning, Hem/Flöde.

## Dokument (repo docs är master)
Uppdatera `docs/wireframes.md` §8, `docs/ia-karta.md`, `docs/produkt.md` (Alla sparade, UserCollection, kurator "Av dig"), `docs/design.md`, `docs/plan.md`, och lägg idén om eget omslag i `docs/idebank.md`. Lista i rapporten vad som ska speglas i Claude Project-dokumenten.

## Definition klar
Sparat visar Alla sparade + egna samlingar + Ny samling, och segmentet Följer. Ny samling kan skapas och överlever omstart. Tryck på en samling öppnar Samlingsdetalj med zoom och rätt innehåll. Rapporten redovisar alla beslut.
