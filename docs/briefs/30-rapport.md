# Rapport brief 30: Kontextmeny på samlingskort

- **Ändrat kort:** `PartnerCard`, som används i "Du följer" på Hem och i Samlingar-hyllan på Partnerdetalj. Det var det enda kortet med följ-knapp. `CollectionCard`, `ProfileCard`, `DiscoveryPreviewCard` och övriga kort har ingen och är orörda.
- +/✓-knappen och dess stilar är borttagna. Långt tryck öppnar `ProductContextMenu` med samma gest som produktkorten: Följ/Sluta följa (samma `toggleFollowed(id)` som knappen), Öppna (samma navigering som tryck) och Dela (toast "Delning kommer senare"). Ikonerna FollowIcon, ChevronIcon och ShareIcon fanns redan.
- Kopian är kortets bild (samma source) med namn och antal. Kort och kopia har `radius.collection` (18, var `radius.card` 14 på kortet), så att kopian är identisk med originalet. Tryck med zoom och opacitets-feedback är oförändrade.
- **Verifierat i simulatorn:** menyn öppnades via koden, eftersom simulatorn inte kan göra långt tryck. Den visar Sluta följa · Öppna · Dela med lyft kopia. Kortet saknar +/✓ efter stängning, och tryck öppnar Samlingsdetalj. tsc och iOS-export är gröna, och ingen debug-rest finns kvar. Själva långtrycket och dra-för-att-välja kräver enhet.
- **Flaggas:** produktmenyns Dela, Följ varumärke och Visa liknande gör ingenting (inte ens toast), så samlingsmenyns Dela beter sig nu annorlunda än produktens.
