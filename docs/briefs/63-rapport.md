# Rapport brief 63 – Hem: ordning, fält, kort

## Inventering: vad som fanns
- **`app/(tabs)/index.tsx`:** toppen var `Header`, `FilterPills` (Allt, Kläder, Möbler, Begagnat; filtrerar inget) och `AskBar`, med `gap` 16. Sedan kom hyllorna: Fortsätt där du var, Skapat för dig, Samlingar för dig, Fler i din stil, Områden, Populära samlingar och Kanske intressant för dig.
- **`AskBar`:** texten "Fråga eller sök" var hårdkodad och användes även som tillgänglighetsetikett. Det fanns ingen prop för platshållaren.
- **`ContinueRow`:** två `EditorialCard` `landscape`, båda med en statusrad. Det ena är en pågående dialog (statisk dummy), det andra den senast öppnade egna samlingen.
  - Typen syns i koden: korten byggs var för sig.
  - Sökning, produkt och företag finns inte som typer i Fas 0.
  - `EditorialCard` hade redan `titleIcon`, en ikon före titeln (idékorten, brief 53).
- **`ContinueDialogRow`:** inte på Hem längre (ersatt av `ContinueRow`). Inte rörd.
- **`EditorialCard`:** titeln är `editorialLarge` 20/24 (stor), `editorialMedium` 18/22 (liggande) eller `editorialSmall` 16/20 (liten), med 2 px till undertiteln. `logo` ersätter titeln.
- **`CollectionCard`:** används inte på Hem, bara i komponentkatalogen. Inte rörd.
- **Samlingar utan logotyp:** logotyperna finns i `COLLECTION_LOGOS` (sex id). Den används i "Samlingar för dig" (stora kort) och "Områden" (små kort).
  - Utan logotyp på Hem: till exempel "Urban" och områdena Hemmakontor, Mjukt hem, Vardagsuniform, Utomhusklart och Vintage.
  - "Populära samlingar" (kollage) har titeln **under** bilden sedan brief 52, så den omfattas inte.
- **Ikonerna** `stars`, `layers`, `search`, `tag` och `shield` finns alla i registret.

## Gjort
1. **Ordning:** toppraden och hälsningen, sedan AskBar och sist pillarna, direkt över hyllorna. Avstånden är oförändrade (16).
2. **Platshållare:** `AskBar` fick prop `placeholder` (standard "Fråga eller sök"). Hem visar "Vad är du intresserad av idag?", som också är tillgänglighetsetikett. Fältet öppnar sökläget som förut. Hitta och Sökresultat är orörda.
3. **Fortsätt där du var:** typikon 16, vit (`overlay.onPhoto`), före titeln via `titleIcon`.
   - Dialog får `stars` och samling `layers`.
   - Texten förblir vänsterställd.
   - Ny token: `editorialCard.typeIcon` = 16.
4. **Samlingar utan logotyp:** ny prop `prominentTitle` på `EditorialCard`, satt i "Samlingar för dig" och "Områden". Den gäller bara när ingen logotyp finns.
   - Stort kort: `title1` 26/30, litet kort: `title2` 20/24.
   - Avståndet till undertiteln är `spacing.sm` (8) i stället för 2.
   - Samlingar med logotyp är orörda.

## Beslut jag tog själv
- **Typen avgörs ur koden:** varje kort byggs för sig, och `layers` som reserv behövdes inte. Sökning, produkt och företag finns inte som kort i Fas 0, så `search`, `tag` och `shield` används inte än. De nämns i koden och i docs.
- **Ikonen står före titeln,** inte i hörnet. Det mönstret fanns redan på idékorten.
- **Ord som inte ryms:** med `title2` på de små kort bröts "Hemmakontor" mitt i ordet (kortets textbredd är 126).
  - Regel: en titel på **ett ord** står på en rad och krymps vid behov, men högst till 70 % (`editorialCard.prominentMinScale`).
  - Titlar med flera ord radbryts som förut, högst två rader.
- **"Typography.title"** finns inte i temat. Jag tolkade det som `title1` för stora och `title2` för små kort, och radavståndet följer tokens.
- **Gäller bara Hem:** områdeskorten på Hitta (`AreaGrid`) och mixkorten "Skapat för dig" är inte samlingskort i den här meningen och är inte ändrade. Kategorikorten på Hitta är inte heller ändrade.
- **"Senast öppnad"-kortet** i Fortsätt (liggande) är inte ändrat, utöver typikonen. Briefen räknar upp stående, små och kollage.

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK.
- **Simulatorn,** egen Metro på 8097, mörkt och ljust läge. Hem fotograferades uppifrån och ned med en tillfällig scroll-parameter, som inte är committad.
  - Fältet ligger före pillarna och visar den nya texten.
  - Fortsätt-korten har `stars` och `layers` före titeln.
  - "Urban" i `title1`, och "Skandinavisk design" med logotyp är oförändrad.
  - Områden: "Hemmakontor" ryms på en rad, och "Skandinavisk stil" står på två rader med luft till "6 produkter".
- **Städat:** min Metro är stoppad och den tillfälliga koden återställd. Din server på 8081 är orörd.

## Utanför scope (flaggat, inte byggt)
- **Pillarna filtrerar fortfarande inget på Hem.** Den delade filterfunktionen från brief 59 är inte inkopplad.
- Hyllströmmen och nya hyllor.
