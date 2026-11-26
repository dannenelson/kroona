# 69 – Hållbarhet på företagsprofilen

Fas 0. Dummydata, inga riktiga verifieringar. Bygger vidare på brief 65 (företagsprofilen) och brief 60 (betyg) / produktens hållbarhetsindex.

## Mål

Ett företag kan visa hållbarhet på sin profil: ett hållbarhetsindex, certifikat och hållbara initiativ. Ett företag utan uppgifter visar ingen hållbarhetssektion alls (ingen tom ruta, ingen "saknas").

## Inventera först

1. Hur hållbarhetsindex för produkter är modellerat och visas idag (skala, "3,9 av 5", sektionen Hållbarhet på Produktdetalj). Återanvänd samma skala och samma visning där det går, så att produkt och företag läses likadant.
2. Om Spec/ docs/ beskriver hållbarhet på företagsnivå. Finns en definition, följ den. Finns ingen, rapportera det.
3. Hur företagsdatan ser ut idag (data/), så att nya fält följer befintlig struktur.

## Datamodell (dummy)

Per företag, alla valfria:
- `sustainabilityIndex`: tal 1–5, samma skala som produkternas.
- `certifications`: lista med `{ id, name, issuer? }`, till exempel GOTS, Fairtrade, Oeko-Tex, Svanen. Varje certifikat har ett namn och en kort text (en rad) om vad det betyder.
- `initiatives`: lista med `{ id, title, description }`, kort, till exempel "Återtagsprogram för kläder", "Klimatneutral frakt".
Fyll i dummydata för 3–4 av de befintliga företagen, och lämna minst ett utan (för tomläget). Markera dummydata med kommentar.

## Visning på företagsprofilen

Ny sektion "Hållbarhet", under hero och före produkterna, med samma kortstil som Hållbarhet på Produktdetalj:
- Rad med hållbarhetsindex (samma format som på produkten).
- Certifikat: rad med små märken/chips, tryck öppnar ett litet kort (bottom sheet eller liknande som redan finns i appen) med namn och förklaring. Finns ingen sådan komponent, visa förklaringen direkt under som en lista.
- Hållbara initiativ: lista med titel och en rad beskrivning.
- Sektioner utan data döljs var för sig. Inga uppgifter alls = ingen sektion.

Ikoner: använd befintliga ikoner i assets/svg/icons (till exempel verified för certifikat, leaf/löv för initiativ). Rita inga nya.

## Gör inte

- Ingen riktig verifiering, inga länkar ut, ingen beräkning av indexet. Allt är dummydata (Fas 0).
- Rör inte produktens hållbarhetsvisning, bara återanvänd den.

## Verifiering

tsc och Metro gröna. Skärmdump ljust och mörkt: företag med allt, företag med bara index, företag utan hållbarhetsdata.

## Dokumentation

Uppdatera designsystem.md (sektionen Hållbarhet på företag) och rapportera i docs/briefs/69-rapport.md: vad som fanns, datamodell, beslut du tog själv. Flagga att hållbarhetsindex på företagsnivå är ny i förhållande till Spec, så att Spec kan uppdateras.
