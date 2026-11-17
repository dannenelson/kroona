# Kroona — Projektöversikt

*Detta är avsett att vara EN sak: svaret på "var står vi". Inte en ersättning för spec/wireframes/designsystem — utan kartan över dem. När du undrar "är det här klart?", börja här, inte i enskilda dokument.*

*Senast sammanställd: 2026-08-26, som en fullständig inventering av spec v1.19, ia-karta.md, wireframes.md, idebank_v5.md, research-findings-log_v21.md, samt hela design-diskussionen i den här chatten som ännu inte var skriven någonstans permanent.*

---

## 0. Läget i en mening

Datamodell och innehållsstruktur (vad varje skärm ska visa) är i stort sett klara och nedskrivna. Visuell identitet är mitt i en aktiv, oavslutad iteration i Claude Design — lovande men inte låst. Kodläget i Claude Code är **okänt just nu** (senaste verifierade inventering är från 18 aug, innan mycket av detta hände) — se avsnitt 4.

---

## 1. Tre spår, inte ett

Det här är den bild som saknats: samma skärm kan vara klar i ett spår och obörjad i ett annat. Blanda inte ihop dem.

| Skärm/Yta | 📋 Specad (innehåll bestämt) | 🎨 Designad (visuell riktning klar) | 🔧 Byggd (kod, Claude Code) |
|---|---|---|---|
| Hem | Ja, men hero-hälsning (avsnitt 3 nedan) är beslutad HÄR och inte skriven till wireframes.md än | 🚧 Pågående — helskärmsversion itererad i Claude Design, glassystem nästan klart | Okänt — senast verifierat 18 aug, gammal pill-stil, troligen inaktuellt |
| Flöde | Ja (wireframes.md #6) | ⬜ Inte itererad i Claude Design än | Okänt |
| Hitta | Ja, plus identifierade justeringar (länk till Produktdetalj, kontextuell tillbaka-knapp, arkiv/ny chatt-platser, tal-växling) | ⬜ Inte itererad | Grundfunktion byggd (18 aug), justeringarna ej gjorda |
| Sparat | Ja, utökat till fulla egna samlingar (wireframes.md #8) | ⬜ Inte itererad | Bara platt "Gilla"-lista byggd |
| Produktdetalj | Ja (wireframes.md #1), inkl. begagnat-gruppering/prisläge (spec v1.18) | ⬜ Produktkort itererat isolerat i Claude Design, men inte hela Produktdetalj-vyn | ⬜ Ej byggd |
| Samlingsdetalj | Ja (wireframes.md #2) | ⬜ | ⬜ Ej byggd |
| Partnerdetalj | Ja (wireframes.md #3) | ⬜ | ⬜ Ej byggd |
| Profildetalj | Ja (wireframes.md #4) | ⬜ | ⬜ Ej byggd |
| Onboarding | ⬜ Medvetet parkerad | ⬜ | ⬜ |

**Vad detta betyder konkret:** vi kan inte säga "Hem är klar" eller "Hem är inte klar" — den är specad, delvis designad, och kodläget är okänt. Alla tre måste anges för att påståendet ska betyda något.

---

## 2. Design-spåret — det som bara funnits i den här chatten, nu nedskrivet

Det här är den viktigaste luckan att täppa till, eftersom INGET av detta finns i `designsystem.md` (som dessutom inte ens ligger i projektet just nu, se avsnitt 5).

### Referensarbete
Två omgångar research-bilder (~53 bilder totalt) syntetiserades till en riktning: fotografidrivet, varm färgtonad fotografi, djärv stor typografi som grafiskt element (inte bara diskreta accenter), flytande halvtransparent pill-navigation ovanpå foto, mörkt tema som default men fullt fungerande ljust tema.

### Glassystem — pågående, senaste låsta värden (kan ändras igen, INTE finalt)
- **Regel:** mörkt tema → mörkt glas. Ljust tema → ljust glas. (Inte fast glas oavsett tema — det var ett feldrag under vägen, rättat.)
- **Blur:** sänkt från 20–24px till **8–12px** efter feedback (för hög blur dolde konturerna helt, såg ut som solid platta)
- **Kant:** ska vara EN linje (antingen `border` ELLER `inset`, inte båda staplade — dubbel kant var en bugg i ett mellansteg), låg opacitet
- **Innehållsfärg:** vit i mörkt tema, mörk (`#14181D` i senaste körningen) i ljust tema
- Testat i två kontexter: ovanpå foto OCH ovanpå ren yta utan bild — båda måste hålla
- **Öppen fråga:** exakt alfa-värde för glasets bakgrundsfyllning är inte slutgiltigt låst — senast diskuterat runt 0,20–0,30, kan behöva justeras beroende på vilket foto som faktiskt ligger bakom

### Komponentregler som kommit ur iterationen
- **Filterpillar:** mörk frostad glasbakgrund i mörkt tema, ljus i ljust tema (se regel ovan) — INTE bara textfärgen som flippar, hela glaset flippar
- **Aktiv/vald pill-state:** samma behandling som primär CTA — ljus bakgrund + mörk text i mörkt tema, mörk bakgrund + ljus text i ljust tema (omvänt mot pillrens overksamma state)
- **Prisformat:** `1 490 kr` — "kr" direkt efter siffran, samma rad, mindre storlek än priset. Gäller överallt priser visas, inklusive minitumnaglar.
- **Betyg på produktkort:** både kundbetyg (stjärna) och hållbarhetsbetyg (löv-ikon) ska ha ikonen FÖRE värdet: `★ 4,8 (312)` samt `🍃 4,2` — inte tvärtom
- **Hero-text på foto (rubriker):** kräver en gradient-scrim under texten, mjuk och lång utfasning (inte hård kant), något högre opacitet precis vid textens nederkant. **Medvetet undantag från 100% WCAG:** hero-rubriker är sekundär information, scrimmet behöver inte garantera AA-kontrast i alla möjliga bakgrundsbilder — det gör däremot faktiska interaktiva element (knappar, pillar, priser) som MÅSTE hålla kontrastkrav.

### Ny sektion på Hem — hero-hälsning (BESLUTAD men ej skriven till wireframes.md än)
Kort, kompakt hero överst på Hem (kortare än ursprungsförsöket), ingen kampanjtext, ingen Följ-knapp/pil-uppåt (de hörde till en felaktig kopiering av annan skärms TopBar). Innehåll: personlig hälsning baserad på tid på dygnet — "Godmorgon [Namn]!" / "God eftermiddag [Namn]!" / "God kväll [Namn]!". Foto-bakgrund + samma glassystem på meny/sök-ikonerna. **Kopplar till:** Igenkänning-lagret i Kroona_Sammanstallning avsnitt 6 — mer bokstavlig implementation än ursprungligen tänkt, men samma princip.

**Handlingspunkt:** när glassystemet är helt låst (efter nästa Claude Design-runda), ska allt i det här avsnittet flyttas in i `designsystem.md` som formella tokens, och hero-hälsningen läggas till `wireframes.md` avsnitt 5.

---

## 3. Vad som är LÅST (kan användas som fakta, inte omprövas i förbigående)

- **Positionering:** "ingen dold agenda", CPA-only, äger hela köpresan (spec avsnitt 1)
- **Datamodell:** Produkt / Återförsäljare (AF) / Erbjudande, tre entiteter (spec v1.13, avsnitt 3)
- **Nytt/Begagnat:** egenskap hos Erbjudandet, inte Produkten — en produkt kan ha flera begagnat-erbjudanden samtidigt (spec v1.13–1.14)
- **Begagnat-listan på Produktdetalj:** grupperad per tjänst (inte per enskild annons), FAST prissortering (inte manuellt sorterbar) — eftersom begagnat-erbjudanden från privatpersoner inte går att normalisera som Nytt-erbjudanden (spec v1.18)
- **Prisläge för begagnat:** "Fast pris: X kr" vs. "Auktion, bud från X kr" (spec v1.14)
- **Nytt-erbjudanden (Köp hos):** sorteringsval finns, default = pris (spec v1.13)
- **Egna samlingar (Sparat):** byggbart i Fas 0, lokal AsyncStorage-modell, ingen backend krävs — flyttad från Fas 1 till Fas 0 (ia-karta.md)
- **Fyra separata detaljvyer** för PartnerCard/CollectionCard/ProfileCard (inte en gemensam mall) — CollectionCard-detalj delas mellan algoritmiska/redaktionella OCH egna samlingar
- **TopBar-princip:** vänster = navigation/tillbaka, höger = 0–2 kontextuella åtgärder, samma behållare överallt (designsystem.md, ej i projektet just nu — se avsnitt 5)
- **Tillbaka-knappen är kontextuell** — returnerar till skärmen man kom från, aldrig en fast destination
- **Neutral informationsvisning som designprincip:** visa data (nytt/begagnat, hållbarhetsindex, leveransalternativ) neutralt snarare än moraliserande — skaleffekten är den faktiska påverkan (spec v1.16, avsnitt 3)

---

## 4. Kodläget — okänt, kräver en färsk inventering

Den enda verifierade kod-inventeringen är från 18 augusti (i `kroona_status_roadmap.md`, som inte ens ligger i projektet just nu). Sedan dess har mycket hänt i spec/design som troligen INTE är byggt:
- Ny datamodell (Produkt/Erbjudande/AF) — produktkatalogens datastruktur i `data/products.ts` speglar troligen fortfarande gamla modellen (en produkt = ett erbjudande)
- Glassystem, hero-hälsning, pris/betygsformat — helt nya, garanterat inte byggda
- Filterpillarnas stilbyte (pill → flik, sen tillbaka till glas-pill igen efter Claude Design-arbetet — designriktningen har ändrats sedan wireframes.md skrevs)

**Handlingspunkt, konkret:** kör en ny inventeringsrunda i Claude Code, samma metod som 18 augusti (gå igenom filerna, gissa inte), och rapportera tillbaka hit. Utan det kan ingen del av tabellen i avsnitt 1 fyllas i tillförlitligt för kod-kolumnen.

---

## 5. Dokumentkarta — vad varje fil faktiskt är, och var den bor

| Fil | Syfte | Finns i projektet just nu? |
|---|---|---|
| `Kroona_Spec_v1_19.docx` | Vision, affärsmodell, datamodell, allt låst | ✅ Ja |
| `Kroona_Sammanstallning.md` | Kortfattad status-snapshot, skriven för att öppna nya trådar | ✅ Ja |
| `ia-karta.md` | Vilka skärmar finns, fas-taggade | ✅ Ja |
| `wireframes.md` | Innehållsstruktur per skärm | ✅ Ja |
| `idebank_v5.md` | Otriagerade idéer, ingenting beslutat | ✅ Ja |
| `research-findings-log_v21.md` | Källtriagerad research, 🟢🔵⚪🔍❌ | ✅ Ja |
| `kroona_skarm_manifest.md` | Kompakt skärmlista för Claude Design-prompting | ✅ Ja |
| **`designsystem.md`** | Komponentregler, tokens | ❌ **Saknas i projektet — bara chatt-nedladdning** |
| **`kroona_status_roadmap.md`** | Ursprunglig statusfil (18 aug), nu ersatt av DETTA dokument | ❌ **Saknas i projektet, och under alla omständigheter inaktuell** |
| **`kroona_identitetsriktning.md`** | Tidigt utkast till visuell riktning (v1–v2), FÖRE Claude Design-iterationerna | ❌ **Saknas i projektet, och inaktuell — glassystemet i avsnitt 2 ovan är nyare** |

**Rekommendation:** ladda upp det här dokumentet till projektet. Ladda INTE upp `kroona_status_roadmap.md` eller `kroona_identitetsriktning.md` igen — de är ersatta. Uppdatera `designsystem.md` (finns som artefakt i chatten, sök upp den) och ladda upp den, eftersom avsnitt 2 ovan fortfarande inte är samma sak som formella, skrivna tokens.

---

## 6. Öppna frågor värda att se samlade (från idebank + spec v1.15)

- 🔥 **DPP-positionering:** passiv (bygg stöd, vänta) eller aktiv (del av pitchen nu)? Inte beslutat.
- 🔥 **Admin-gränssnitt för handlare:** större scope än nuvarande spec avsnitt 8, egen framtida session
- 🔥 **DPP som verifieringsmekanism** för hållbarhetsdata (löser greenwashing-risk) — idé, inte beslutad
- Begagnat-erbjudande: bör ett skick-fält läggas till, ev. kopplat till branschstandard? (spec v1.15, ingen research gjord än)
- Hem vs. Hitta som två köpteorier (glädjeköp/orka-köp, explore/evaluate) — värd att pröva **nästa gång wireframe-utmaningen tas upp**, inte nu

---

## 7. Nästa konkreta steg (prioriterad, inte allt samtidigt)

1. **Ladda upp det här dokumentet + en uppdaterad `designsystem.md`** till projektet — utan det har vi samma problem om en vecka
2. **Kör en färsk Claude Code-inventering** (avsnitt 4) — utan den vet vi inte vad som faktiskt återstår att bygga
3. **Avsluta pågående Claude Design-runda** (glassystemets alfa-värde, sen resten av korttyperna i skärm-manifestet) — inte starta nya trådar förrän den är i hamn
4. Först därefter: bestäm om nästa fokus är bygg (Produktdetalj är den mest efterfrågade luckan) eller fler öppna DPP/admin-frågor
