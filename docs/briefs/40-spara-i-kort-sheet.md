# Brief 40 – "Spara i": kort-sheet à la Instagram/YouTube, gemensam Spara-ingång

**Fas:** 0. **Mål (ett):** Bygg om "Lägg till i samling" till ett 2/3-kort som växer vid skroll (Instagram/YouTube-beteende) och slå ihop Gilla och Spara till EN ingång. Rör inget annat. Inventera först: Sheet (+ SheetContent, kantblur), lägg-till-steget (brief 36/38/39), SaveButton, ProductCard, ProductContextMenu, SavedProductsContext, UserCollectionsContext, Snackbar. Referenser: Daniels skärmbilder av Instagram "Lägg till i samling" och YouTube "Spara i …".

## 1. Presentation: kort med luft (YouTube-stil)
- Sheeten är ett **kort** som ligger över innehållet med några px luft runt om (sidor och botten, token t.ex. `sheetCardInset` 8, plus safe area), rundade hörn (token, ~28, squircle). Skärmen bakom ligger kvar under en mörk overlay (`sheetScrim`, ingen full-blur av bakgrunden). Tryck på overlayen stänger.
- Kortets bakgrund är **nästan solid** (`surface`, ~0.96 alfa, ingen genomskinlighet som släpper igenom innehåll). Behåll dagens **blur i kortets topp och botten** (kantblur där listan scrollar bakom rubrik och CTA).
- Detta blir en presentation i Sheet-komponenten (t.ex. `presentation: 'card'`), inte en kopia. Befintligt helskärmsflöde (t.ex. Skapa samling från "+" i Sparat) lämnas som det är; flagga i rapporten om de bör få samma presentation.

## 2. Innehåll: bara tre saker
- **Rubrik** "Spara i …" (vänsterställd, headline). Beslut Claude, byt gärna om Daniel vill ha annat.
- **Skrollbar lista** med rader: **"Gillade produkter" ALLTID överst** (hjärtikon i raised-ruta, räknare), sedan egna samlingar (mosaik 48, namn, "Privat/Publik · N produkter"). Cirkel till höger: tom ring / fylld med bock. Tryck togglar direkt (flera samlingar går fortfarande; ändringen gäller direkt).
- **CTA längst ned (sticky, wrap-bredd, aldrig fullbredd):** "+ Skapa ny" (sekundär eller primär, välj det som ser bäst ut; det är enda knappen).
- **Borttaget:** produktpreview/chip, sökfält, X/Klar. Stängs genom svep, scrim-tryck eller scrollgest (se 3).

## 3. Gest- och snappbeteende (kärnan)
Två snapp-lägen: **2/3 av skärmhöjden** (öppnas här) och **full höjd**.
- Skrollar man listan **uppåt/nedåt-innehållet** (fingret uppåt) i 2/3-läget växer kortet först till full höjd; därefter skrollar listan.
- I fullhöjd: skrollar man tillbaka till listans första rad och fortsätter dra nedåt krymper kortet till 2/3.
- Fortsätter man dra nedåt i 2/3-läget (listan på topp) **stängs sheeten** (swipe bort), med hastighets- och avståndströskel + fly-out.
- Kontinuerlig, en gest: skroll och sheet-rörelse får inte "hacka" mellan lägen. Spring-snap, samma tokens som övriga sheets. Reanimated/gesture-handler som i övrigt, inga nya paket. Minska rörelse = ingen rörelseanimation, bara fade.
- `swipeToClose: false`-specialen från brief 36 ersätts av detta beteende för kortet.

## 4. Gilla + Spara = en ingång ("Spara")
- Produktvy och ProductCard: **en** knapp, benämnd **Spara**, öppnar kortet. Den separata bokmärke-plus-knappen tas bort. Menyvalet i långt tryck-menyn: **"Spara"** (ersätter både Gilla och Spara i samling) och öppnar samma kort.
- Ikon: behåll hjärtat (oförändrat från brief 38). Fylld när produkten ligger i Gillade produkter ELLER i någon samling. Flagga i rapporten om det känns fel med hjärta + texten Spara (alternativ: bokmärke).
- Snabbspar med ett tryck finns inte längre (tryck = öppna kortet). Flagga i rapporten som designval att utvärdera (Instagram har tryck = snabbspar, långt tryck = kortet).
- Snackbar när kortet stängs efter att något lagts till: "<produkt> sparades i <samling>" · Visa (Gillade produkter: "… sparades i Gillade produkter"). Flera: "… sparades i N samlingar". Bara borttagningar: ingen snackbar. Ändra tidigare texter "gillades" → "sparades".
- "Gillade produkter" ligger kvar som egen rad i Sparat (Mina samlingar); ingen ändring där.

## 5. Skapa ny från kortet
"+ Skapa ny" öppnar befintligt Skapa samling-steg **inuti samma kort** (kortet går till full höjd, tillbaka-chevron vänster, samma innehåll som idag). Efter Spara skapas samlingen, produkten läggs i den och kortet stänger. Om det blir krångligt: beskriv avvikelsen i rapporten, bygg inte specialare.

## 6. Dokument
designsystem.md (Sheet card-presentation, snapp-beteende), design.md §0 (Spara = hjärta, gemensam ingång), produkt.md och wireframes.md (Sparat/Spara-flödet, borttagen Gilla/Spara-uppdelning).

## Utanför scope (flagga)
Skapa samling från "+" i Sparat med kort-presentation, redigera/radera samling, delning.

## Verifiering
tsc, iOS-export, simulator: öppna från produktvy och långt tryck, 2/3 → full → 2/3 → stäng, tom lista (bara Gillade produkter + CTA), många samlingar, mörkt/ljust. Lista vad som kräver telefon (gestkänsla, blur). Rapport: `docs/briefs/40-rapport.md` (+ lista att spegla till Claude Project). Committa efter verifiering, inkl. briefen, och pusha.
