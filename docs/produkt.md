# Kroona — Produkt

*Vad Kroona är och vad som är bestämt. Ändras sällan. Ersätter `Kroona_Sammanstallning.md` (byggd på spec v1.2, delvis föråldrad). Detaljer och motiveringar finns kvar i specen. Senast: 2026-11-17.*

## Vad
En svensk upptäcktsplattform för mode och heminredning som äger hela köpresan, från inspiration till köp. Pinterest-känsla, men på riktig produktdata (pris, lager, begagnat, hållbarhet) i stället för annonser.

**Varför:** Google, Meta och Amazon tjänar på att köpresan är rörig. Prisjämförare löser bara priset. Kroona har ingen dold agenda.

## För vem
- **Konsument:** designmedvetna, hållbarhetsintresserade, hämtar idag inspiration från Pinterest/Instagram/TikTok.
- **Återförsäljare:** små och medelstora D2C-varumärken, helst utan befintliga affiliate-avtal.
- **Start:** Sverige, kläder först, sedan inredning. Begagnat ingår i samma flöde som nytt från dag ett.

## Affärsmodell
CPA, provision per genomförd försäljning och aldrig per klick. "Ni betalar bara när ni säljer." Server-side tracking, last-click, 30 dagars click_id. (Detaljer: spec avsnitt 9–10.)

## Vision och UX-principer (Daniels formulering, 2026-11-18)
Göra köpresan enklare och roligare för alla konsumenter, oavsett intresse eller kategori, från inspiration och utforskning till köp.

1. **Hela resan täcks av fyra flikar** (Hem, Flöde, Hitta, Sparat). Användaren ska alltid kunna vända sig till Kroona för hjälp.
2. **Hitta det som passar just mig:** specifikationer, pris, hållbarhet, plats och cirkularitet. Information om företagen man stöttar visas transparent.
3. **Användaren har kontrollen:** följ personer och samlingar för att styra vad som syns i flödet.
4. **Konsumenten betalar aldrig, och företag betalar inte för att vara med eller synas.** Provision tas bara när en försäljning gått genom tjänsten. Alla spelar efter samma regler.
5. **Senare:** önskelistor (som GoWish) och följande av personer och samlingar.
6. **Innehållet ska vara relevant, bra och snyggt.** Referenser: Spotify (personlig, igenkänning) och Pinterest (upptäckt).

## Produkten
| Flik | Roll |
|---|---|
| **Hem** | Personligt och igenkänt. Kompakt hälsningshero, sedan samlingar och mixar. |
| **Flöde** | Upptäckt. Masonry-grid, filter, pull-to-refresh. |
| **Hitta** | AI-dialog med produktkort inline. |
| **Sparat** | Egna samlingar, "Gilla" alltid först. |

**Detaljvyer (fyra separata):** Produktdetalj, Samlingsdetalj, Partnerdetalj, Profildetalj.
Hem och Flöde blandas aldrig: Hem är känt, Flöde är nytt.

## Låsta beslut
- **Datamodell:** Produkt / Återförsäljare / Erbjudande. Nytt/Begagnat är en egenskap hos Erbjudandet.
- **Begagnat visas före nytt**, grupperat per tjänst, med fast prissortering. Prisläge: "Fast pris" eller "Auktion, bud från".
- **Nytt (Köp hos):** sorterbart, default pris.
- **Hållbarhet** informerar och dömer aldrig. Data visas neutralt.
- **Tillbaka-knappen** går alltid till skärmen man kom från.
- **Egna samlingar** byggs i Fas 0 med lokal lagring (AsyncStorage).

## Faser
| Fas | Innehåll |
|---|---|
| **0 (nu)** | Demo med 56 dummyprodukter. Ingen backend, tracking eller provision. Målet är att visa pilotpartners. |
| 1 | En riktig återförsäljare, tracking och provision, konton, Supabase. |
| 2 | Cirka 100 användare via nätverk och waitlist. |
| 3 | Fler återförsäljare, kategorier och länder. |

## Principer
Konsumenten äger köpresan · Lugnt och sansat, aldrig hispigt · Polering är inget efterhandsarbete · Bygg för att hålla, inga genvägar · Transparens som fördel · Minimal funktion, maximal upplevelse

## Pilotkontakter
J.Lindeberg (varm intro) · RevolutionRace · Nordic Nest · Adtraction. Vinkel: konkret och teknisk (CPC-höjningar 2025) före abstrakt hållbarhetsvision.

## Avvikelser mot gamla dokument
- **Typsnitt och färg i Sammanställningen är föråldrade** (Cormorant/DM Sans, `#0F0F0E`). Gällande värden ligger i Design-dokumentet.
- **"Hero och glas parkerade"** gäller inte längre. Hero-hälsning och glas är beslutade.
- **"Konto från dag ett"** är ett Fas 1-krav. Fas 0 har inget konto eller backend.
- **Onboarding (5 steg)** är medvetet parkerad och inte planerad i Fas 0.
