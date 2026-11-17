# Kroona — Plan

*En sida. Svarar på "vad jobbar vi med nu, och vad kommer sen". Uppdateras när något ändras, aldrig med nya idéer (de går till `idebank`). Senast: 2026-11-17.*

## Mål för Fas 0 (bekräftat 2026-11-17)
Ett demo i telefonen som Daniel kan visa en pilotpartner och som håller i en 5-minuters genomgång av hela köpresan: **Hem → Produktdetalj → Samling → Sparat**, plus Hitta och Flöde.

**Klart när:** de fyra tabbarna och fyra detaljvyerna är byggda på 56 dummyprodukter, i både mörkt och ljust tema, utan att API-nyckeln ligger i klienten.

## Nu — ett aktivt spår åt gången
| # | Spår | Klart när |
|---|---|---|
| 0.1 | **Städa dokumenten** → tre levande dokument (Produkt, Design, Plan) | Rätt filer ligger i projektet, gamla är arkiverade |
| 0.2 | **Färsk repo-inventering** (Claude Code) | Vi vet vad som är byggt, och tabellen "specat/designat/byggt" är ifylld |
| 0.3 | **Designgrund** (tokens + komponenter, tvåskiktsmodell) | Grundtokens + semantiska tokens skrivna, "öppet" markerat där inget är satt |

## Näst — i den här ordningen
1. **Byggbas i koden:** tokens och basskomponenter (Glas, Pill, Kort, TopBar) enligt designgrunden
2. **Datamodell i koden:** Produkt / Återförsäljare / Erbjudande (koden speglar troligen den gamla modellen)
3. **Produktdetalj** (mest efterfrågade luckan), sedan **Samlingsdetalj**
4. **Sparat** med egna samlingar (AsyncStorage)
5. **Hem** i ny design, sedan **Flöde** och **Hitta**
6. **Demo-redo:** API-nyckel bakom proxy, telefonbygge för visning

## Senare — Fas 1 och framåt (byggs inte i Fas 0)
Supabase-projekt och schema (collections, collection_items, follows) · konton · tracking och provision · första riktiga återförsäljaren · admin för handlare · DPP

## Öppna beslut
- [x] Mål och "klart när" bekräftade (2026-11-17)
- [ ] Hosting: Supabase i Fas 1, och proxyn för API-nyckeln i 0.6 eller tidigare?
- [ ] Schemajämförelse (researchloggen) före Fas 1

## Spelregler
1. **Ett spår åt gången.** Nytt spår startar när det gamla är klart eller uttryckligen pausat.
2. **Ny idé → idébanken**, inte hit. Den flyttas hit först när Daniel prioriterar den.
3. **Fas-koll:** hör det till Fas 1+? Flagga och bygg inte.
4. **Commit efter varje godkänd Code-runda** (tsc/Metro).
5. **Sidospårsfråga innan varje session:** "Står detta i Nu/Näst?" Om inte, fråga Daniel.
