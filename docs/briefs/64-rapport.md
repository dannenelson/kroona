# Rapport brief 64 – Profil, notiser och inställningar (dummy)

## Inventering: vad som fanns
- **`components/Header.tsx`:** avatar (initialer DN, 40) och klocka (`NotificationIcon`) i Hem-toppen. Båda trycken var tomma: "Profilskärmen/Notisskärmen finns inte än".
- **Tema:**
  - `ThemeProvider` höll ett `scheme` ('dark' | 'light') i minnet, med `setScheme`.
  - Startläget var hårdkodat mörkt i `app/_layout.tsx` (`INITIAL_SCHEME`).
  - Inget sparades och inget systemläge fanns. `app.json` hade `userInterfaceStyle: "dark"`, så systemets läge gick inte att läsa.
  - Enda växeln var en Pill på dev-sidan.
- **`app/_layout.tsx`:** `BlankStack` med egna övergångar. `components` (dev-sidan) var inte registrerad och fick standardövergång.
- **`data/user.ts`:** bara `name: 'Daniel'` och `initials: 'DN'`.
- **`app/profile/[id].tsx`:** profilvyn för **andra personer** (brief 37), med zoom från avataren. Inte rörd. Den egna profilen är en ny skärm.
- **Dev-sidan (`app/components.tsx`):** nåddes via länken "Komponenter (dev)" längst ned på Hem (bara `__DEV__`).
  - Logotypkorten visades i tre storlekar. De stående var centrerade, men det **liggande** var vänsterställt, eftersom liggande kort är vänsterställda som standard.
- **`notification-filled.svg`:** pricken var hårdkodad `#111111` och syntes inte i mörkt läge (flaggat i rapport 58).
- **Ikoner:** `sun`, `moon`, `settings`, `info`, `folders`, `bookmark`, `shopping-bag`, `tag` och `user-add` fanns. Det finns ingen hjälp-ikon.

## Gjort
1. **Profil (`app/me.tsx`):**
   - Öppnas från avataren och **glider in från vänster** (ny `slideFromLeftScreenOptions`). Tillbaka-knappen eller ett svep åt vänster stänger.
   - Innehåll: avatar DN 96, "Daniel Nelson", "@danielnelson" och räknarna Följer och Sparade.
     - Följer = följda samlingar, varumärken, områden och personer.
     - Sparade = Sparade produkter.
   - Rader:
     - Sparade produkter → samlingsvyn för Sparade produkter.
     - Mina samlingar → fliken Sparat.
     - Inställningar.
     - Hjälp → platshållaren "Kommer snart" (`app/placeholder.tsx`).
   - `DUMMY_USER` fick `fullName` och `handle`.
2. **Notiser (`app/notifications.tsx`):**
   - Öppnas från klockan och glider in **från höger** (vanlig push).
   - 7 dummynotiser (`data/notifications.ts`) med ikon, rubrik, text och tid, grupperade Idag (3) och Tidigare (4). Tomläget "Inga notiser än" finns.
   - **Pricken:** klockan visar `notification-filled` när det finns olästa. Pricken är nu `currentColor` i filen och följer därmed temat. Den försvinner när Notiser öppnas (`NotificationsContext`).
3. **Inställningar (`app/settings.tsx`):**
   - **Utseende:** segmentkontroll med `sun`, `moon` och textfliken "System". `SegmentedIcons` kan nu ha `text` i stället för `icon`.
     - Valet sparas i AsyncStorage och gäller direkt i hela appen.
     - System följer enhetens läge. `app.json` har nu `userInterfaceStyle: "automatic"`.
     - Appen väntar på det sparade valet innan den ritas, så fel tema blinkar inte.
   - **Notiser:** tre dummyväxlar (iOS-standard).
   - **Om:** version 1.0.0, från app-konfigurationen.
   - **Utvecklare:** "Komponenter (dev)" öppnar dev-sidan.
   - **Dev-länken på Hem är borttagen**, så dev-sidan nås bara härifrån.
   - Delade listrader: ny `components/GroupedList.tsx`.
4. **Kort med logotyp är alltid centrerade:** regeln ligger i `EditorialCard`, alltså även i appen, inte bara på dev-sidan. Det liggande logotypkortet var vänsterställt och är nu centrerat. Liggande kort med enbart text, som Fortsätt där du var, är fortsatt vänsterställda.

## Beslut jag tog själv
- **Läst-läget lagras inte.** Pricken kommer tillbaka efter omstart, så att demot går att visa flera gånger. Temavalet lagras däremot, som briefen kräver.
- **Utvecklarsektionen** visas bara i utvecklingsläget (`__DEV__`), som dev-länken på Hem gjorde. I Expo Go syns den alltid.
- **Hjälp** öppnar en platshållare i stället för att vara helt död, enligt "resten visar en tom, snygg platshållare". Ikonen är `info`, eftersom det inte finns någon hjälp-ikon.
- **Notisväxlarna** är iOS standardväxlar (grön). Designsystemet har ingen växelstil än. Se frågor.
- **Dev-sidans egen temaväxel** (Pill) ligger kvar. Den sparar nu valet som Ljust eller Mörkt.
- **Logotypregeln ligger i komponenten,** inte bara i dev-sidans exempel. Det påverkar inga kort i appen i dag, eftersom inget liggande kort har logotyp.
- **Profilens räknare** visar 12 följer, eftersom alla `COLLECTIONS` följs som standard (inklusive varumärkenas filtersamlingar).

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK.
- **Simulatorn,** egen Metro på 8097. Tillfällig kod, som inte är committad, satte temat via länkparameter, stängde Notiser automatiskt, lade ett logotypkort överst på dev-sidan och saktade ned övergången.
  - **Profil glider in från vänster:** fångat i nedsaktad övergång. Hem ligger still bakom.
  - **Notiser glider in från höger.**
  - **Pricken** syns på Hem (vit i mörkt läge) och är borta efter att Notiser har öppnats.
  - **Tema:** Ljust, Mörkt och System. Med System följde appen simulatorns läge åt båda hållen. **Ljust låg kvar efter omstart** av appen.
  - **Dev-sidan** öppnas via Inställningar. Liggande logotypkort är centrerat.
  - **Platshållaren "Hjälp"** visas.
- **Inte tryckt med finger:** svep åt vänster för att stänga Profil, och växlarna.
- **Städat:**
  - Min Metro är stoppad och den tillfälliga koden återställd.
  - Simulatorns systemläge är tillbaka på ljust, som innan.
  - **Temavalet** är satt tillbaka till **Mörkt**. Expo Gos lagring delas troligen med din server på 8081, så valet kan synas där.
  - Din server på 8081 är orörd.

## Frågor
- **Växlarnas stil:** ska de vara iOS-gröna eller följa vår palett, till exempel `textPrimary`? Det behövs i så fall en token.
- **Läst-läget för notiser:** ska det sparas mellan sessioner?

## Utanför scope (flaggat, inte byggt)
Riktiga notiser och push, inloggning, redigera profil, radera konto och sparade notisinställningar.
