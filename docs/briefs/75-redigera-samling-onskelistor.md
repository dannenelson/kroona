# 75 – Redigera samling (namn och synlighet) och typen Önskelista

Fas 0. Lokalt (AsyncStorage), inga konton, ingen delning. Två delar, committa per del, tsc/Metro grönt.

## Beslut bakom (Daniel, 2026-11-27)

- Man ska kunna redigera en samling mer än att byta namn: även ändra om den är publik eller privat.
- Det finns två typer av egna listor: **Samling** (som idag: spara och kategorisera produkter man är intresserad av) och **Önskelista** (alltid privat).
- Delning av önskelistor, "Delas med dig", att mottagare reserverar produkter och att andra ser reservationer (ägaren ser dem inte) är **Fas 1+** och byggs inte här. Det är dokumenterat i docs/spec-forslag.md B5 och docs/produkt.md.

## Inventera först

1. `UserCollection` (`types/catalog.ts`), `UserCollectionsContext`, lagringsnyckel och hur befintlig sparad data läses (migrering: gamla poster utan typ ska bli Samling).
2. Skapa samling-flödet (Sheet-steget "Skapa samling", "+" i Sparat och "Ny samling" i Spara i …), Byt namn-steget och `hooks/useUserCollectionMenu.ts`.
3. Alla ställen som visar egna samlingar: Sparat → Mina samlingar (rader och kort), Spara i …-kortet, Samlingsdetalj (hero), Hem (Populära samlingar), personprofil, Profil (räknare), Fortsätt där du var, sökning. Notera vilka som visar publika samlingar för andra, eftersom en Önskelista aldrig får synas där.
4. Att ikonerna `gift` och `lock` finns (de gör det).
Rapportera kort om något avviker.

## Del 1: Redigera samling (namn och synlighet)

- Menyvalet "Byt namn" i ⋯-menyn och i långtrycksmenyn (Sparat och Samlingsdetalj, via samma hook) heter **"Redigera"** och öppnar ett Sheet-steg med: namnfältet (samma regler som idag, tomt eller oförändrat går inte att spara) och växeln **"Håll samlingen privat"** (samma rad som i Skapa samling, förinställd efter samlingens nuvarande läge). CTA "Spara". "Redigera innehåll", "Dela" och "Ta bort samling" ligger kvar.
- Typen (Samling/Önskelista) går **inte** att ändra efter att listan skapats.
- Snackbar efter sparning (menyval, fetstilta namn): "**<gammalt>** heter nu **<nytt>**", "**<namn>** är nu privat" / "**<namn>** är nu publik". Ändras båda: en snackbar med båda delarna eller den för namnet; välj det enklaste och rapportera.
- Visibility-ändringen uppdaterar överallt direkt (hero-raden "Privat/Publik samling av dig", lås i listor, Spara i …-kortet).

## Del 2: Typen Önskelista

- Datamodell: `UserCollection` får `kind: 'collection' | 'wishlist'`. Saknas fältet i lagrad data blir det `'collection'`. Önskelistor har alltid `visibility: 'private'`.
- **Skapa:** Skapa samling-steget får ett val överst, "Samling | Önskelista" (segmentkontroll, förvald Samling), och rubriken byter till "Skapa önskelista" vid val. För Önskelista är växeln "Håll privat" på och **låst** med hjälptexten "Önskelistor är alltid privata. Du kan dela dem med andra senare." (ingen delning byggs; Dela förblir platshållaren "Delning kommer senare"). Spara-knappen och snackbaren följer typen ("**<namn>** skapades · Visa").
- **Sparat → Mina samlingar:** två sektioner med rubrik, **Samlingar** och **Önskelistor**. Sektionen Önskelistor visas bara när det finns minst en. "Sparade produkter" ligger fortsatt överst före allt. Raden för en önskelista har ikonen `gift` före "Önskelista · N produkter" (på samma plats som låset visas på privata samlingar; en önskelista visar inget lås, eftersom den alltid är privat). Räknaren "N samlingar" räknar bara Samlingar.
- **Spara i …-kortet:** listan har både Samlingar och Önskelistor. När båda finns visas en liten etikett (`label`, dämpad) före varje grupp. Önskelistor har `gift` som i Sparat.
- **Samlingsdetalj för en önskelista:** hero-raden "Önskelista av dig" (med `gift` på samma sätt som låset på privata samlingar), ingen Följ och inget antal, ⋯-menyn som för egna samlingar men utan synlighetsval i Redigera (bara namn). Tomläget säger "Önskelistan är tom".
- **Aldrig publikt:** en önskelista får inte visas i Hem (Populära samlingar), på personprofilen, i sökning eller någon annan publik yta. Kontrollera alla ställen i inventeringen punkt 3 och rapportera vad du justerade.
- Namn på nya önskelistor föreslås inte; inga dummy-önskelistor behövs (men skapa gärna en i testdatan för skärmdumparna och ta bort den efteråt).

## Gör inte

- Ingen delning, inga inbjudningar, ingen "Delas med dig", ingen reservation (Fas 1+).
- Rör inte hur Följ fungerar. Ändra inte typen på befintliga listor.
- Inga nya ikoner.

## Uppdatera efteråt

design.md och designsystem.md (Sheet-stegen, segmentkontrollen, sektionerna), wireframes.md §2 och §8, ia-karta.md (Sparat, Egna samlingar), produkt.md (Låsta beslut, Egna samlingar), plan.md.

## Verifiering

tsc och Metro gröna. Skärmdumpar ljust och mörkt: Redigera-steget (privat och publik), Skapa med Önskelista vald (låst växel), Sparat med båda sektionerna, Spara i …-kortet med båda grupperna, Samlingsdetalj för en önskelista, snackbarna. Kontrollera att en gammal sparad samling (utan typ) fortfarande visas som Samling.
