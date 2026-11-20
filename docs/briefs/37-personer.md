# Brief 37 – Personer i Följer (dummydata)

**Fas:** 0 (dummy, lokal följ-lagring). **Mål (ett):** Man kan följa personer, och de visas i Sparat → Följer. Beslut Daniel 2026-11-20: användare ska gå att följa. Spec och ia-karta sa tidigare att de inte följs, så de dokumenten ska uppdateras (se nedan). Riktig social funktion (konton, feed, notiser) är Fas 1+ och byggs inte.

Inventera först: ProfileCard, befintliga profil-/kuratordata (`curator.kind: 'user'`), FollowedCollectionsContext, Följer-fliken i saved.tsx, Partnerdetalj (mall för profilvy). Återanvänd.

## 1. Data
- Dummy-personer (4–6) med id, namn, @handle, kort bio, avatar (initialer om ingen bild), antal följare (dummy). Markera DUMMYDATA. Knyt några av dem som `curator {kind:'user'}` till 1–2 av samlingarna.
- Följ-lagring för personer (AsyncStorage, eget nyckelnamn), startar TOM (upprepa inte följ-standardfelet).

## 2. Följer-fliken
- Ny sektion **Personer** direkt efter Varumärken (ordning: Varumärken, Personer, Samlingar, Områden). Rader: rund avatar 48, namn, undertext "@handle". Max 3 + "Visa alla" som övriga. Tryck → profilvy (se 3). Långt tryck → Öppna, Sluta följa.
- Tomt: sektionen döljs.

## 3. Profilvy
Enkel vy i Partnerdetaljens språk: avatar, namn, @handle, bio, Följ-pill, flik/hylla "Samlingar" (personens publika dummysamlingar). Zoom-transition och kantsvep som övriga detaljvyer. Håll liten; inget mer innehåll.

## 4. Följ-ingång
Följ/Sluta följa-pill på profilvyn, och "Följ" i kontextmenyn på ProfileCard (finns den redan, återanvänd). Samlingsdetaljens kuratorrad för `user` leder till profilvyn.

## 5. Dokument
Uppdatera `produkt.md`, `ia-karta.md` (Profildetalj: Fas 0 dummy, social Fas 1+), `wireframes.md`, `designsystem.md`, `plan.md`; skriv i rapporten exakt vad i Spec/Sammanställning som motsäger detta så jag speglar det till Claude Project.

## 6. Utanför scope
Riktiga konton, följare-lista, feed från personer, notiser, möjlighet att skapa profil.

Rapport: `docs/briefs/37-rapport.md`. Committa efter verifiering, inkl. briefen, och pusha.
