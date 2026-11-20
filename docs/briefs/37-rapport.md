# Rapport brief 37: Personer i Följer (dummydata)

**Byggt:**
- **Data:** `Person` (id, name, handle, bio, initial, followers) och `data/people.ts` med 5 dummypersoner (DUMMYDATA). `PEOPLE_COLLECTIONS`: 4 publika samlingar med `curator: { kind: 'user', id }`, 2 för Maja Lind och 1 vardera för Oskar Berg och Sara Nilsson. De ingår i `ALL_COLLECTIONS`. `FollowTarget` har fått `'person'`.
- **Följ-lagring:** `FollowedPeopleContext` med egen nyckel `@kroona/followedPeopleIds`, tom från start.
- **Följer:** sektionen Personer efter Varumärken (ordning Varumärken, Personer, Samlingar). Raderna har avatar 48, namn och "@handle". Max 3 + "Visa alla", tryck öppnar profilen med zoom, långt tryck ger Öppna och Sluta följa. Sektionen döljs om man inte följer någon.
- **Profilvy** (`app/profile/[id].tsx`): avatar 96 (zoommål, grupp `profile` via `hierarchyScreenOptions`, kantsvep som övriga), namn, @handle, "N följare · M samlingar", bio, Följ/Följer och hyllan Samlingar (PartnerCard → Samlingsdetalj).
- **Ingångar:**
  - kuratorraden i Samlingsdetalj ("Av Maja Lind") leder till profilen (ny `getCurator` för Kroona, varumärke och person);
  - ProfileCard med `personId` öppnar profilen och har kontextmenyn Följ/Sluta följa och Öppna.
- **Delat:** `components/Avatar.tsx` används i Följer-raderna och på profilen, och varumärkesraderna använder den också.

**Verifierat i simulatorn** (tillfällig testkod, borttagen):
- Hem → "Populära samlingar" visar personernas samlingar;
- Samlingsdetalj visar "Av Maja Lind";
- profilvyn med Följ → Följer;
- Sparat → Följer visar Personer: Maja Lind @majalind.

tsc och iOS-export är gröna. **Kräver telefon:** zoom från rader och kort, kantsvep, långt tryck/Sluta följa.

**Beslut och avvikelser:**
- **"Populära samlingar" på Hem** visar nu personernas samlingar i stället för statiska dummykort. Utan det hade profilerna saknat en naturlig väg in, eftersom följ-lagringen är tom från start. CollectionCard har fått valfri navigering med zoom.
- **ProfileCard med person** används ännu inte på någon skärm (bara stöd). Ingen hylla med personer på Hem är byggd.
- **Följ på personens samlingar** använder samlingarnas befintliga följ-lagring. De syns då under Följer → Samlingar.
- **Utanför scope:** konton, följarlista, feed från personer, notiser, skapa profil.

**Motsägelser att spegla till Claude Project.** Jag ser inte Spec/Sammanställning, men repo-dokumenten sa följande, och troligen säger de samma sak:
1. "Man följer varumärken, företag, områden och samlingar, **inte andra användare**." Nu följer man även personer.
2. "Profildetalj (andra användare) väntar/parkerad, Fas 1+." Nu finns Profildetalj som Fas 0-dummy, och social funktion är Fas 1+.
3. "Profildetalj och följa andra användare kräver konton (Fas 1+)." Nu är det bara konton, feed, notiser, följarlistor och skapa profil som är Fas 1+.
4. "ProfileCard länkar till profilsida, men ingen finns." Nu finns profilvyn.
5. Datamodellen `FollowTarget` saknade `person`, och samlingar saknade kuratortypen person med data. Båda finns nu.
6. Följer-ordningen: Varumärken, Personer, Samlingar, Områden.
