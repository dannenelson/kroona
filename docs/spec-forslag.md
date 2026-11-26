# Kroona — Förslag på ändringar i Spec v1.19

*Skrivet 2026-11-26. Spec v1.19 (`Kroona_Spec_v1_19.docx`, aug 2026) är källan till sanning för vision och krav. Det här dokumentet samlar där appen i Fas 0 har gått förbi eller avviker från Spec, så att Spec kan uppdateras (till v1.20) i en egen session. Detaljerna ligger i `produkt.md`, `ia-karta.md` och `designsystem.md`. Punkter markerade **Beslut** kräver Daniels svar.*

## A. Preciseringar (Spec bör uppdateras)

| # | Spec säger | Appen i Fas 0 | Förslag |
|---|---|---|---|
| 1 | Navigation: Hem (personaliserat), Flöde (kronologiskt upptäcktsflöde), Hitta, Sparat | Hem = hyllor med kort. **Följer** (hette Flöde till brief 44) = Pinterest-flöde av det man följer och inspiration som liknar det, blandat jämnt, omblandat vid öppning. Hitta, Sparat som förut. | Byt Flöde mot Följer och beskriv rollerna enligt `produkt.md`. |
| 2 | Hitta = AI-dialog med produktkort inline | Hitta = **sök + dialog + kategorier** (brief 53–54). Ett fält, "Ställ en fråga eller sök". Dialogen är en egen skärm, med eller utan avgränsning. Fyra kategorier: Kläder, Möbler, Elektronik, Begagnat. | Skriv om Hitta-avsnittet. AI:n har inget namn i UI, arbetsnamn **Kai** för röstdialog (ej beslutat för UI, kräver varumärkes- och uttalskontroll). |
| 3 | Chatthistorik/arkiv är ett Fas 1-krav (kräver backend/konto) | Byggt lokalt i Fas 0 (brief 66): dialoger och sökningar sparas på enheten (max 50 av varje), hyllan Tidigare, Arkiv, återuppta dialog. | Dela upp kravet: lokalt arkiv klart; synk mellan enheter, sök i historiken, namngivning, delning och radering på server är Fas 1. |
| 4 | Produktkort: bild 3:4, märke, namn, pris, färgkodad hållbarhetsbadge, Spara-knapp (hjärta) | Textblock under bilden (märke, namn, pris, betyg), två kolumner. **Bokmärke** i stället för hjärta; Spara i gridar ligger i kontextmenyn. Betyg (dummy) visas på kort och Produktdetalj. | Uppdatera kortbeskrivningen. Hållbarhet visas neutralt på Produktdetalj ("informerar och dömer aldrig"), se beslut B1. |
| 5 | Egna samlingar: skapa och döpa, i Fas 1-databas | Fas 0 lokalt: skapa, byta namn, redigera innehåll (ta bort produkter), ta bort. Ordningen kan inte ändras. | Flytta redigering av egna samlingar till Fas 0. |
| 6 | Följa: samlingar, varumärken | Fas 0 lokalt: varumärke/butik, område, samling och **person** (dummy, brief 37). Konton och riktig social funktion är Fas 1+. | Lägg till område och person som följbara. |
| 7 | (saknas) | Egen profil, Notiser och Inställningar (Ljust/Mörkt/System) som dummy (brief 64). | Lägg till som Fas 0-skärmar; riktiga notiser och konto är Fas 1. |
| 8 | Kategorier: kläder först, sedan möbler | Demot har Kläder, Möbler, **Elektronik** (teknikprodukter, 3 st) och Begagnat som kategori. | Notera att Elektronik finns i demot som kategori. Se beslut B3 om det är en avsikt för Fas 1. |

## B. Beslut som behövs

1. **Hållbarhetsindex, visning.** Spec §9: varje AF och produkt får ett index, och företag som inte redovisar visas med **tomt index — information i sig**. Spec (produktkort) beskriver också ett färgkodat badge (grönt/amber). Appen visar neutralt utan färgkodning, och på företagsprofilen (brief 69) visas ingen hållbarhetssektion alls om data saknas.
   - Alternativ A: följ Spec, visa "Ej redovisat" på företagsprofilen när uppgifter saknas.
   - Alternativ B: behåll dagens beteende (dölj) och ändra Spec.
   - Frågan om självrapporterat kontra DPP-verifierat (idebank, "Admin-gränssnitt") påverkar märkningen och är öppen.
2. **Betyg.** Researchloggen bedömde recensioner som mindre centrala i mode och hem än i elektronik ("ingen spec-ändring"). Appen visar nu dummybetyg på kort och Produktdetalj (brief 60). Behåll som Fas 0-demo, eller ta med i Spec? Datakällan saknas i Fas 1 (egna omdömen, återförsäljares eller tredje part).
3. **Elektronik som kategori.** Spec nämner kläder och möbler som initiala kategorier. Är Elektronik en avsiktlig tredje kategori inför pilotpartners, eller en demo-artefakt (teknikprodukterna fanns som möbeltyp)?

## C. Orört i Spec (stämmer)

Affärsmodell (CPA, server-side tracking), vision och positionering, begagnat före nytt, Produkt/Återförsäljare/Erbjudande, Fas 1-kraven (konto, tracking, provision, säkerhetsskuld med API-nyckel i klienten).
