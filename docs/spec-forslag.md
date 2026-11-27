# Kroona — Förslag på ändringar i Spec v1.19

*Skrivet 2026-11-26. Spec v1.19 (`Kroona_Spec_v1_19.docx`, aug 2026) är källan till sanning för vision och krav. Det här dokumentet samlar där appen i Fas 0 har gått förbi eller avviker från Spec, så att Spec kan uppdateras (till v1.20) i en egen session. Detaljerna ligger i `produkt.md`, `ia-karta.md` och `designsystem.md`. Punkter markerade **Beslut** kräver Daniels svar.*

## A. Preciseringar (Spec bör uppdateras)

| # | Spec säger | Appen i Fas 0 | Förslag |
|---|---|---|---|
| 1 | Navigation: Hem (personaliserat), Flöde (kronologiskt upptäcktsflöde), Hitta, Sparat | Hem = hyllor med kort. **Följer** (hette Flöde till brief 44) = Pinterest-flöde av det man följer och inspiration som liknar det, blandat jämnt, omblandat vid öppning. Hitta, Sparat som förut. | Byt Flöde mot Följer och beskriv rollerna enligt `produkt.md`. |
| 2 | Hitta = AI-dialog med produktkort inline | Hitta = **sök + dialog + kategorier** (brief 53–54). Ett fält, "Ställ en fråga eller sök". Dialogen är en egen skärm, med eller utan avgränsning. Fyra kategorier: Kläder, Möbler, Elektronik, Begagnat. | Skriv om Hitta-avsnittet. AI:n har inget namn i UI, arbetsnamn **Kai** för röstdialog (ej beslutat för UI, kräver varumärkes- och uttalskontroll). |
| 3 | Chatthistorik/arkiv är ett Fas 1-krav (kräver backend/konto) | Byggt lokalt i Fas 0 (brief 66): dialoger och sökningar sparas på enheten (max 50 av varje), hyllan Tidigare, Arkiv, återuppta dialog. | Dela upp kravet: lokalt arkiv klart; synk mellan enheter, sök i historiken, namngivning, delning och radering på server är Fas 1. |
| 4 | Produktkort: bild 3:4, märke, namn, pris, färgkodad hållbarhetsbadge, Spara-knapp (hjärta) | Textblock under bilden (märke, namn, pris, betyg), två kolumner. **Bokmärke** i stället för hjärta; Spara i gridar ligger i kontextmenyn. Betyg (dummy) visas på kort och Produktdetalj. | Uppdatera kortbeskrivningen. Hållbarhet visas neutralt på Produktdetalj ("informerar och dömer aldrig"), se beslut B1 (visa "Ej redovisat"). |
| 5 | Egna samlingar: skapa och döpa, i Fas 1-databas | Fas 0 lokalt: skapa, byta namn, redigera innehåll (ta bort produkter), ta bort. Ordningen kan inte ändras. | Flytta redigering av egna samlingar till Fas 0. |
| 6 | Följa: samlingar, varumärken | Fas 0 lokalt: varumärke/butik, område, samling och **person** (dummy, brief 37). Konton och riktig social funktion är Fas 1+. | Lägg till område och person som följbara. |
| 7 | (saknas) | Egen profil, Notiser och Inställningar (Ljust/Mörkt/System) som dummy (brief 64). | Lägg till som Fas 0-skärmar; riktiga notiser och konto är Fas 1. |
| 8 | Kategorier: kläder först, sedan möbler | Demot har Kläder, Möbler, **Elektronik** (teknikprodukter, 3 st) och Begagnat som kategori. | Notera att Elektronik finns i demot som kategori. Se beslut B3 (testkategori). |
| 9 | (saknas) | Inget i Fas 0. Beslutat: kommentarer på produkter med tumme upp/ner och bidragsräknare på profilen (B2). | Lägg till som Fas 1+-krav. |

## B. Beslut (Daniel, 2026-11-27)

1. **Hållbarhetsindex: visa även när företag inte redovisar.** Avsikten är att transparens ska vara ett incitament: företag som inte aktivt visar sin hållbarhet ska synas som "Ej redovisat", så att kunden ser vem hon handlar av. Det följer Spec §9 (tomt index är information i sig); appens nuvarande beteende (dölja sektionen, brief 69) ska ändras. Tryck på hållbarhetsindexet, på produkt och företag, öppnar en **sheet som visar hur siffran räknats fram**. Hur certifikat och initiativ ska visas per företag och produkt är öppet. Frågan om självrapporterat kontra verifierat är fortsatt öppen. Spec: ingen ändring av principen, men skriv in sheeten ("Så räknar vi").
2. **Betyg: ska finnas, datakällan är öppen.** Bara bekräftade köp, eller alla? Ej avgjort (Fas 1+, kräver konton och köpdata). Ett tomt betygsfält är inte önskvärt. I Fas 0 behålls dummybetygen. **Nytt:** användare ska också kunna **kommentera produkter**. Det är inte betyg utan ett sätt att ge feedback och dela med sig. Kommentarer kan få **tumme upp/ner** av andra ("hjälpsam eller inte"), och användarprofilen visar **antal bidrag**. Syftet är att uppmuntra användare att bygga profiler i tjänsten. Allt detta är **Fas 1+** (konton, moderering, backend) och bygger inte i Fas 0. Spec: lägg till som krav i Fas 1+.
3. **Elektronik är en testkategori** i demot och öppnas för fler kategorier senare. Ingen Spec-ändring utöver att kategorierna inte är låsta till kläder och möbler.
4. **Spara och mer-meny** (produktkort): inga synliga CTA:er i gridar, bara långt tryck (Pinterest-stil). På Produktdetalj ersätter mer-knappen (⋯) Dela, och Dela flyttas in i menyn. Se brief 70.

## C. Orört i Spec (stämmer)

Affärsmodell (CPA, server-side tracking), vision och positionering, begagnat före nytt, Produkt/Återförsäljare/Erbjudande, Fas 1-kraven (konto, tracking, provision, säkerhetsskuld med API-nyckel i klienten).
