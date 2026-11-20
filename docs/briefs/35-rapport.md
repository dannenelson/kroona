# Rapport brief 35: Sparat, omstrukturering

**Byggt** (`app/(tabs)/saved.tsx`, efter skissens artboards Main, SamlingarGrid och Foljer):
- **Header:** "Sparat" (`title1`) + "+" (Sheet: Skapa samling). "Ny samling"-kortet är borttaget. Flikarna är Mina samlingar | Följer.
- **Mina samlingar:**
  - Verktygsrad med "N samlingar" (bara egna) och vy-växlaren rader | kort (`SegmentedIcons`). Valet sparas i AsyncStorage, standard är rader.
  - Rader: "Gillade produkter" (hjärta i `surfaceRaised`-ruta), avdelare, sedan egna samlingar (mosaik 56/r14, "Privat · N produkter" med lås / "Publik · N produkter").
  - Kort: 2 kolumner, Gillade produkter först med hjärta.
  - Zoom till Samlingsdetalj från thumb eller omslag. Långt tryck på egna samlingar ger Öppna och Dela (snackbar "Delning kommer senare").
  - Tomt läge: text + Button "Skapa samling".
- **Följer:** sektionerna Varumärken (avatar 48 med initialer, "N samlingar", eller produkter om varumärket saknar samlingar) och Samlingar (mosaik 48, "Av Kroona/<varumärke>"). Max 3 visas, och "Visa alla" vid > 3 expanderar på plats. Tryck öppnar Partner- eller Samlingsdetalj med zoom, och långt tryck ger Öppna och Sluta följa. Tomt läge: text + Button "Utforska" (→ Hitta).
- **"Gillade produkter"** ersätter "Alla sparade" (`ALL_SAVED_NAME`, texter, snackbar, tomvy). Invarianten (produkt i samling ⇒ sparad) är borttagen ur `addProductToCollection`.
- **Nya delade delar:**
  - `ListRow` (listrad);
  - `SegmentedIcons` (vy-växlare);
  - `hooks/useLongPressMenu` (kontextmenyns gest, nu delad: PartnerCard är ombyggd till den);
  - ikonerna Lock, List och Grid;
  - tokens `listRow`, `segmented` och `iconSize.xs/sm`.

  Inga nya paket.

**Verifierat i simulatorn** (tillfällig testkod, borttagen):
- radvy, kortvy och Följer (J.Lindeberg och Filippa K "2 samlingar", Skandinavisk stil och Urban stil "Av Kroona");
- att vyvalet finns kvar efter omstart.

tsc och iOS-export är gröna. **Kräver telefon:** långt tryck och kontextmenyerna (Sluta följa, Dela), zoom från rader och kort, kantsvep tillbaka och tomlägena (simulatorns lagring har samlingar och följda).

**Beslut och avvikelser:**
- **Varumärkesrader** visar antal samlingar (briefen), inte produkter (skissen). Med 0 samlingar visas produkter.
- **Områden döljs:** områden har data men ingen följ-lagring eller Följ-funktion än.
- **Rader har `pressed`-yta i stället för krympning,** eftersom `useCardPress` används på kort.
- **"Gillade produkter" har ingen kontextmeny,** eftersom den inte är en samling.
- **Kort-/radtexten är 15/500.** Skissen har 16, men 16 saknas i typografiskalan.

**Flaggas:**
- **Personer:** spec och ia-karta säger att användare inte följs (Profildetalj Fas 1+), medan skissen har en Personer-sektion. Beslut behövs.
- **Den kända följ-standarden** syns i Följer: J.Lindeberg, Filippa K, Skandinavisk stil och Urban stil är följda från start.
- **Utanför scope:** "Lägg till i samling" från produkt, redigera/döp om/radera samling och ta bort produkt ur samling. Snackbaren vid sparande finns sedan brief 33 och visar nu "Gillade produkter".

**Spegla i Claude Project-dokumenten:**
- "Gillade produkter" är inte en samling och är oberoende av egna samlingar (invarianten borttagen).
- Sparat: Mina samlingar | Följer, rader/kort-växlare, Följer i sektioner (Varumärken, Samlingar, Områden när följning finns).
- Personer behöver beslut.
- Nya designsystemdelar: ListRow och vy-växlare.
