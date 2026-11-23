# Brief 47 – Företagslogotyper och samlingslogotyper (tillfälliga)

**Fas:** 0. **Mål (ett):** Visa riktiga SVG-logotyper för återförsäljare/varumärken och för Kroonas/redaktionella samlingar på de ställen i appen där de hör hemma, så att demon får känsla. Logotyperna är tillfälliga. Kör efter brief 45. Inventera först `components/Avatar.tsx`, `PartnerCard.tsx`, `DiscoverBrandsRow.tsx`, `EditorialCard.tsx`, `app/partner/`, `data/retailers.ts`, `data/collections.ts` och `data/areas.ts`.

## Material (Daniel lagt i `assets/Temp/`, verifierat av Claude)
Alla är SVG i 90 × 45-ram med transparent bakgrund. **De beter sig olika:**
- `logotyper/`: **FilippaK, NodicNest (sic), RoyalDesign är vita**. **H&M är röd, Lindex rosa.** Vita logotyper syns inte på ljus yta.
- `samlingar/`: alla sex är **vita** (GamingDeluxe, HandlaHållbart, ScandinaviskDesign, SecondHand, SecondLife, SmartaHem), gjorda för att ligga över foto.
- `assets/kroona.svg` rörs inte här (brief 45).

## Gör
1. **Flytta och döp om** (vanlig mv, filerna är ännu inte spårade av git och läggs till med git add; ASCII-namn, rätta stavfelet): `assets/dummy/logos/retailers/{filippa-k,hm,lindex,nordic-nest,royal-design}.svg` och `assets/dummy/logos/collections/{gaming-deluxe,handla-hallbart,scandinavisk-design,second-hand,second-life,smarta-hem}.svg`. Ta bort tomma `assets/Temp/logotyper` och `samlingar`. `Temp/produkter` rörs inte (brief 48). Prefixet `dummy/` markerar att filerna ersätts före publik release.
2. **Register:** `data/logos.ts` med `RETAILER_LOGOS` (retailer-id → SVG-komponent) och `COLLECTION_LOGOS` (samlings- eller områdes-id → SVG-komponent). Nu: `brand-filippa-k` → filippa-k; samlingen "Skandinavisk stil" (id '2') → scandinavisk-design; området "Begagnad mode" → second-hand. De övriga logotyperna (H&M, Lindex, Nordic Nest, Royal Design, Second Life, Gaming Deluxe, Handla Hållbart, Smarta Hem) registreras med de id:n brief 48 kommer att skapa; lämna dem som kommenterade rader med TODO 48 tills data finns.
3. **Återförsäljare, ritning:** logotypen ritas på en **mörk platta** med samma färg i båda lägena (ny token `logoPlate`, t.ex. #1F2227) med 1 px kant, eftersom tre av logotyperna är vita. Cirkelavatar (76 på Hem) med logotypen på ca 60 % av bredden, proportionen bevarad; Filippa K bryts i två rader av filen själv och ska rymmas. Saknas logotyp: dagens initialavatar. Bygg som `components/BrandLogo.tsx` (eller utöka Avatar) som tar `retailerId` och `size`.
4. **Återförsäljare, var:** Hem "Fler i din stil" (cirklarna), Partnerdetaljens huvud, och varumärkeskortet (`PartnerCard` variant `brand`, där logotypen ersätter namnet om den finns, namnet blir tillgänglighetsetikett). Varumärkesrader i Sparat → Följer om de har avatar idag. Inventera och lista i rapporten vad du rört.
5. **Samlingslogotyper, ritning:** på `EditorialCard` (och kollagekort om de används för Kroona-samlingar) ersätter den vita logotypen **titeltexten** när samlingen har en. Stående kort: logotypen centrerad, bredd ca 60 % (stor) / 75 % (liten), max höjd 36, undertiteln kvar under. Liggande kort: vänsterställd. Titeln behålls som `accessibilityLabel`. Logotypen ligger ovanpå toningen så att den läses; testa mot ljusa foton.
6. Dev-sidan `app/components.tsx` visar alla logotyper (båda grupperna) i mörkt och ljust.

## Utanför scope (flagga)
Nya återförsäljare, samlingar och produkter (brief 48), logotyper i Samlingsdetaljens huvud, att logotyper ersätter namn i produktkort eller listor. Logotyperna tillhör respektive varumärke och är bara tillfälliga demomaterial: lägg en rad i `docs/produkt.md` om att `assets/dummy/` ska bytas eller tas bort före publik release.

## Verifiering
tsc, Metro, simulator mörkt och ljust: vita logotyper läsbara på plattan i båda lägena, inga logotyper kapade i cirkeln, samlingslogotyp läsbar på stora och små kort. Rapport: `docs/briefs/47-rapport.md`. Dokument: `docs/designsystem.md` (BrandLogo, logoPlate, samlingslogotyp på kort), `docs/produkt.md`. Committa, inkl. briefen, och pusha.
