# Rapport brief 69 – Hållbarhet på företagsprofilen

## Inventering: vad som fanns
- **Produkternas hållbarhet:** `sustainabilityScore` (tal 1–5) på `CatalogProduct`.
  - Produktdetalj visar den under rubriken "Hållbarhet" som faktaraden "Hållbarhetsindex · 3,9 av 5" (`components/product/FactList.tsx`, `formatScore`), följd av valfria fakta (Material, Tillverkad i, Certifiering).
  - På korten visas lövet med värdet. Allt neutralt, inga färger.
  - Produktens certifiering är en fritextrad (`facts.certification`), utan modell.
- **Spec och docs:** **ingen definition av hållbarhet på företagsnivå.** Spec ligger utanför repot. I `docs/` finns bara principerna "information om företagen man stöttar visas transparent" (produkt.md) och "neutral informationsvisning" (projektöversikten). Index, certifikat och initiativ för företag är **nya i förhållande till Spec**, så Spec behöver uppdateras.
- **Företagsdatan:** `Retailer` i `types/catalog.ts` och `data/retailers.ts` har namn, typ, `brandName`, `description`, `values`, `presence`, `initial` och `defaultFollowed`.
  - Fem varumärken med riktiga namn, två riktiga butiker (Nordic Nest, Royal Design) och två påhittade andrahandstjänster (Återbruket, Budrummet).
  - **Datafilen säger uttryckligen:** "inga sakpåståenden om riktiga bolag".
- **Kort med förklaring:** `Sheet` har kortläget (`presentation: 'card'`, brief 40). Ikonerna `verified` och `leaf` finns.

## Datamodell (dummy)
Alla fält är valfria på `Retailer`:

| Fält | Innehåll |
|---|---|
| `sustainabilityIndex` | Tal 1–5, samma skala som produkternas |
| `certifications` | `Certification[]` = `{ id, name, issuer?, description }`. Definitionerna ligger i `data/certifications.ts`: GOTS, Oeko-Tex, Svanen och Fairtrade, var och en med namn, utfärdare och en rads förklaring. |
| `initiatives` | `SustainabilityInitiative[]` = `{ id, title, description }` |

Ifyllt, märkt som DUMMYDATA:

| Företag | Index | Certifikat | Initiativ |
|---|---|---|---|
| Återbruket | 4,4 | Svanen, Oeko-Tex | Återtag av kläder, Klimatneutral frakt, Lagning på plats |
| Budrummet | 3,7 | – | – |

Alla övriga företag saknar hållbarhetsdata och visar därför ingen sektion.

## Visning
- Ny `components/partner/SustainabilitySection.tsx` på Partnerdetalj, **direkt efter "Om …"**, före Finns, Samlingar och Produkter.
- **Index:** rubriken "Hållbarhet" och indexet med **samma `FactList` och format** som produkten ("4,4 av 5"). Produktens visning är orörd.
- **Certifikat:** chips i Pill-stil med `verified`. Ett tryck öppnar kortet med namn, utfärdare och förklaring.
- **Hållbara initiativ:** grupperad lista med `leaf`, titel och en rads beskrivning.
- **Varje del döljs utan data.** Utan någon uppgift ritas ingen sektion alls.

## Beslut jag tog själv
- **Två företag med data, inte 3–4.** Datafilen förbjuder sakpåståenden om riktiga bolag, och påhittade certifikat på till exempel Filippa K eller Lindex vore ett sådant påstående. Därför ligger datan bara på de två påhittade aktörerna, Återbruket (allt) och Budrummet (bara index). Verifieringsfallen allt, bara index och inget täcks ändå. Vill du ha data på riktiga bolag (som tydligt märkt demo) går det att lägga till.
- **Certifikatdefinitionerna** är gemensamma i `data/certifications.ts`, så att samma certifikat har samma förklaring överallt. Fairtrade och GOTS är definierade men används inte i dummydatan än.
- **Chippen** är egna, i Pill-stil, eftersom `Pill` saknar ikon.
- **Kortet** för certifikatet är `Sheet` i kortläget, som öppnas på ca 2/3 höjd. Det finns inget mindre lager i appen. Det fungerar, men är stort för en rad text.
- **Placering:** direkt efter "Om …", så att hållbarheten hamnar nära hero.
- **Initiativens beskrivningar** är kortade så att de ryms på en rad, eftersom briefen säger "en rad".

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK.
- **Simulatorn,** egen Metro på 8097, mörkt och ljust läge, skrollat till sektionen med en tillfällig parameter (inte committad):
  - Återbruket: allt.
  - Budrummet: bara index.
  - Lindex: ingen sektion.
  - Certifikatkortet "Svanen" öppnades med tillfällig kod.
- **Städat:** min Metro är stoppad, den tillfälliga koden återställd och temavalet tillbaka på mörkt. Din server på 8081 är orörd.

## Flaggat
- **Hållbarhetsindex på företagsnivå** (och certifikat och initiativ) är nytt i förhållande till Spec. Spec bör uppdateras med definition, skala och vem som sätter indexet.
- **Utanför scope:** riktig verifiering, länkar ut och beräkning av index.
