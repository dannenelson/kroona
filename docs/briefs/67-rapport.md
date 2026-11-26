# Rapport brief 67 – Följ-ikoner och nya ikoner

## Inventering: vad som fanns
**Ikonfilerna**
Alla sex finns i `assets/svg/icons`. `user-add` var redan i registret. `company-add`, `company-check`, `user-check`, `history` och `recycle` låg otrackade och **fanns inte i `iconRegistry`**. Generatorn är körd, och registret har nu 90 ikoner.

**Granskning mot ikonreglerna** (24×24, stroke 1,5, rundade ändar och hörn, `currentColor`):

| Fil | Avvikelser |
|---|---|
| `company-add` | Linjerna hade `stroke="black"`, saknade `stroke-linejoin="round"` och delvis `stroke-linecap="round"`. **Två former har `fill="black"`:** väggen med golvet och dörren. Det är konturer som omvandlats till fyllda former, inte linjer. |
| `company-check` | Samma som `company-add`, inklusive de två fyllda formerna. Bocken var redan rätt. |
| `user-check` | `stroke="black"`, och huvudet och axlarna saknade `stroke-linejoin`. |
| `history`, `recycle` | `stroke="black"`, i övrigt rätt. |
| `user-add` | Rätt. |

**Följ och Sluta följa i appen i dag** (alla med `user-add`):

| Ställe | Vad som följs |
|---|---|
| Produktkortets kontextmeny "Följ varumärke" (brief 61; ingen logik i Fas 0) | Företag |
| `PartnerCard` Följ/Sluta följa (variant brand) | Företag |
| `PartnerCard` Följ/Sluta följa (variant style) | Samling |
| `ProfileCard` (Fler i din stil) Följ/Sluta följa | Person. Företagscirklarna har ingen meny. |
| Sparat › Följer, "Sluta följa" i menyn | Varumärken, personer, samlingar och områden |
| Följ-knappar med text (Pill, utan ikon) | Företagsprofilens hero, samlingens hero, områdesdetalj, personprofil |

**Andra ikoner som berörs**
- **Arkivets tomläge** använde `clock`.
- **Rubrikerna Tidigare (Hitta) och Arkiv** har ingen ikon.
- **Begagnat** har ingen ikon någonstans: pillarna på Hem, Följer och Sökresultat, kategorikortet (bild), etiketten "Begagnat" på Produktdetalj och undermenyn i Begagnat-kategorin.

## Ändrat
- **Ikonfilerna normaliserade (bara linjerna):**
  - `stroke="currentColor"` i stället för `black`.
  - `stroke-linejoin="round"` och `stroke-linecap="round"` där de saknades.
  - De fyllda formerna i `company-*` är orörda. De blir ändå temats färg, eftersom `.svgrrc` byter `black` mot `currentColor`.
- **Produktkortets meny "Följ varumärke":** `company-add`.
- **`PartnerCard`** (variant brand): `company-add`, eller `company-check` när man följer. Samlingskorten (variant style) är orörda.
- **`ProfileCard`** (personer): `user-add`, eller `user-check` när man följer.
- **Sparat › Följer, "Sluta följa":** varumärken `company-check`, personer `user-check`. Samlingar och områden är orörda.
- **Arkivets tomläge:** `history` i stället för `clock`.

## Beslut jag tog själv
- **Områden** (Sparat › Följer) behåller `user-add`, som samlingarna. Briefen nämner bara företag, personer och samlingar.
- **Inga nya ikoner på ställen som saknar ikon:** Följ-knapparna med text, rubrikerna Tidigare och Arkiv, och Begagnat. Där visar jag bara ställena, enligt briefen.
- **"Följ varumärke" i produktkortets meny** visar alltid `company-add`. Menyraden har ingen logik eller följ-läge i Fas 0 (brief 61), och briefen säger att beteendet inte ska ändras.
- **Platshållarskärmen** ("Kommer snart") behåller `clock`. Den är inte arkivet.

## Flaggat
- **De fyllda formerna i `company-add` och `company-check`** (vägg med golv, dörr) är omvandlade konturer, inte linjer. De ser rätt ut i 20–24 px, och samma vikt syns i menyn. Men `Icon`-komponentens räkning som håller linjen konstant (1,5 synligt i alla storlekar) gäller inte fyllda former. I små eller stora storlekar blir väggen och dörren då tunnare eller tjockare än övriga linjer. Är fyllningen avsiktlig, eller ska formerna ritas om som linjer?
- **Följ-knappen med text** på företagsprofilen har ingen ikon. Ska den få `company-add`/`company-check` före texten? Det skulle kräva ikon-stöd i `Pill`.

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK.
- **Simulatorn,** egen Metro på 8097, mörkt och ljust läge:
  - Produktkortets meny visar `company-add` vid "Följ varumärke". Menyn öppnades med tillfällig kod.
  - Arkivets tomläge visar `history`.
  - Företagsprofilen (Lindex) visar Följ-knappen oförändrad, utan ikon.
- **Inte fångat på bild:** personmenyn i Fler i din stil (`user-add`/`user-check`) och Sparat › Följer (`company-check`/`user-check`). Den tillfälliga koden öppnade inte personmenyn, eftersom personcirklarna låg utanför skärmen. Ikonerna finns i registret och typkontrolleras.
- **Städat:** min Metro är stoppad, den tillfälliga koden återställd och temavalet tillbaka på mörkt. Din server på 8081 är orörd.
