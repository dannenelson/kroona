# 67 – Följ-ikoner och nya ikoner

Fas 0. Tar i bruk de ikoner som lagts till efter brief 58: company-add, company-check, user-add, user-check, history, recycle. Inga nya funktioner, bara rätt ikon på rätt ställe.

## Inventera först

1. Kontrollera att ikonfilerna finns i assets/svg/icons: company-add, company-check, user-add, user-check, history, recycle. Kör registergeneratorn (`node scripts/generate-icon-registry.js`) om de inte ligger i iconRegistry ännu.
2. Granska de nya filerna mot ikonreglerna (24×24, stroke 1.5, round caps/joins, currentColor). Kända avvikelser: company-add saknar stroke-linejoin round och har en svart fyllning. Rätta det som är en ren normalisering (linejoin, currentColor). Är den svarta fyllningen en avsiktlig detalj, flagga den i rapporten i stället för att ändra, så att Daniel avgör.
3. Lista alla ställen där följ/sluta följa visas idag (knappar, menyer, kort, profiler, Följer-sidan, kontextmenyn från brief 61) och var layers, bookmark eller andra ikoner används för något som nu har en egen ikon.

## Regler

- Följ ett varumärke, en butik eller en producent: `company-add`. Följer man redan: `company-check`.
- Följ en person: `user-add`. Följer man redan: `user-check`.
- Samlingar följs med samma mönster som idag (ingen ny ikon, folder som i övrigt), ändra inte.
- `history`: Arkiv och "Tidigare" (hyllan på Hitta, rubriken/ikonen för Arkiv, tomläget i Arkiv om en ikon används där).
- `recycle`: Begagnat där en ikon används för kategorin eller andrahandsfiltret (till exempel pill, kategorikort eller etikett). Finns ingen ikon där idag, lägg inte till en ny, rapportera bara ställena.
- I kontextmenyer där `user-add` redan är platshållare för "följ": använd rätt ikon efter vad som följs (företag = company-add/company-check, person = user-add/user-check) och efter nuvarande läge.
- Följ-knappar med text ("Följ" / "Följer"): ikonen kan ligga före texten om knappen redan har ikon, annars rör vi inte knappens utseende utöver att byta ikon.
- Använd `Icon`-komponenten och registren, inga egna SVG-importer. `filled` används inte på dessa (öppna linjeformer fylls dåligt).

## Gör inte

- Ändra inte layout, texter eller beteende. Bara ikonbyten och normalisering av de nya filerna.
- Rita inga nya ikoner.

## Verifiering

tsc och Metro gröna. Skärmdump ljust och mörkt: företagsprofil (Följ / Följer), kontextmeny med följ, Arkiv/Tidigare med history, Begagnat där recycle används.

## Dokumentation

Uppdatera docs/ikonlista.md (de sex ikonerna: användning, status) och docs/designsystem.md om följ-ikonreglerna. Rapportera i docs/briefs/67-rapport.md: vad som fanns, vilka ställen som ändrades, vad du flaggar.
