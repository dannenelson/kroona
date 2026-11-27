# 73 – Följ-bekräftelse, "Visa liknande" med images, ikoner framför rubriker

Fas 0. Tre små delar, committa per del, tsc/Metro grönt. Ikonerna är redan ritade; rita inga nya.

## Beslut bakom (Daniel, 2026-11-27)

- Beslut som tas i en meny (kontextmeny, mer-meny) har ingen synlig knapp som ändrar sig, så de bekräftas med en snackbar. Beslut som tas med en CTA på canvas (Följ-pill, bokmärke) bekräftas redan av att knappen ändrar status och text; där ska ingen snackbar tillkomma.
- `images.svg` ersätter `layers` för Visa liknande.
- Ikon framför sektionsrubrikerna på Produktdetalj och företagsprofilen.

## Inventera först

1. Alla ställen där man följer eller slutar följa, och om det sker i en meny eller med en knapp på canvas: kortmenyn (märke), mer-menyn på Produktdetalj, företagsprofilen (Följ-pill), samlingsdetalj, områdesdetalj, profildetalj (person), samlingskort och PartnerCard (kontextmeny), Sparat → Följer ("Sluta följa"), ProfileCard-menyn.
2. Alla ställen som använder ikonen `layers` (Visa liknande).
3. Hur sektionsrubrikerna renderas på Produktdetalj och Partnerdetalj (`SectionTitle`?), och om den kan ta en ikon.
4. Att `assets/svg/icons/images.svg` och `product.svg` är otrackade nya filer: committa dem. Daniel kallade den nya ikonen "products", filen heter `product.svg`; använd den.
Rapportera kort om något avviker.

## Del 1: Snackbar vid följ och sluta följa via meny

- **Gäller bara när valet görs i en meny:** kontextmenyn på produktkort (märke), mer-menyn på Produktdetalj, kontextmenyn på samlingskort/PartnerCard/ProfileCard, och "Sluta följa" i Sparat → Följer om den ligger i en meny. **Gäller inte** Följ-pillen på profil, samling, område och person, där knappen byter status och text (Följ → Följer) och det räcker. Rapportera vilka ställen du placerade i vilken grupp.
- Följ: "Du följer **<namn>**". Sluta följa: "Du följer inte längre **<namn>**". Namnet i fetstil, som övriga snackbars (brief 61: långa namn kortas med ellipsis så att resten av meningen syns). Samma text för varumärke, butik, samling, område och person.
- Ingen åtgärdsknapp, ingen Ångra (idébanken). Miniatyr bara om det finns en naturlig bild (samlingens omslag, varumärkets logotyp på plattan); annars ingen.
- En gemensam hjälpfunktion/hook (t.ex. `useFollowToggle`) så att texten bara finns på ett ställe.
- Kontrollera även andra val i menyer som saknar både synlig statusändring och bekräftelse (t.ex. Dela finns redan, Spara och Spara i samling finns redan). Rapportera luckor, bygg bara följ i den här briefen.

## Del 2: Visa liknande använder `images`

Byt `layers` mot `images` överallt där ikonen betyder Visa liknande (kortmenyn, mer-menyn på Produktdetalj). `layers` får användas till annat om det finns; om ingen annan använder den, lämna filen kvar.

## Del 3: Ikoner framför rubriker

Liten ikon (`iconSize.md` 20, `textPrimary`, linje enligt `Icon`) framför rubriktexten, `spacing.sm` emellan, vertikalt centrerad mot rubrikens första rad. Rubrikstilen ändras inte. Inga ikoner på rubriker som inte listas.

Produktdetalj:
- Hållbarhet = `leaf`
- Begagnad ("Finns begagnad hos") = `recycle`
- Köp ("Köp hos") = `shopping-bag`
- Liknande = `images`

Partnerdetalj (varumärkesprofil):
- Om = `info`
- Hållbarhet = `leaf`
- Finns = `map-pin`
- Samlingar = `folders`
- Produkter = `product`

Ikonerna är dekorativa (dolda för skärmläsare). Rubriken ligger kvar utan ikon där sektionen göms. Räknaren efter rubriken ("Samlingar · 2") ligger kvar efter texten. Om `SectionTitle` används även på andra skärmar: gör ikonen till en valfri prop så att övriga rubriker inte ändras.

## Gör inte

- Ingen ångra-åtgärd.
- Inga nya ikoner, rör inte befintliga ikonfiler.
- Inga rubrikikoner på andra skärmar än de två.

## Uppdatera efteråt

design.md (snackbar-texterna), designsystem.md (SectionTitle med ikon, ikonlistan i §17), wireframes.md §1 och §3, plan.md. Kör `node scripts/generate-icon-registry.js` om registret saknar någon ikon.

## Verifiering

tsc och Metro gröna. Skärmdumpar ljust och mörkt: Produktdetalj med alla fyra rubriker, en företagsprofil med alla fem (och en utan hållbarhetsdata), snackbar vid följ och sluta följa via meny (kort namn, långt namn) och att Följ-pillen inte får någon snackbar, Visa liknande med `images`.
