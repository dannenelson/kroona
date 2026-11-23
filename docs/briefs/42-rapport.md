# Rapport brief 42: Alfabetisk sortering

- **Hjälpfunktion** `lib/sortByName.ts`: `compareNames`/`sortByName` med `Intl.Collator('sv', { sensitivity: 'base', numeric: true })`. Om `Intl.Collator` saknas används en reserv: Å, Ä, Ö mappas efter z, diakritiska tecken tas bort, tal jämförs som tal och jämförelsen är skiftlägesokänslig. Sorteringen sker vid visning; lagringen och `createdAt` är orörda.
- **Används i** Mina samlingar (rader och kort, "N samlingar" oförändrat), Spara i-kortet och Följer-sektionerna Varumärken, Personer och Samlingar. Gillade produkter ligger fast först. "Visa alla" visar de tre första alfabetiskt.
- **Verifierat i simulatorn** (Hermes, iOS; tillfällig testkod borttagen):
  - `Intl.Collator` finns;
  - testnamnen sorteras Bastu, bastu-lista, Samling 2, Samling 10, Åre, Ägg, Önskelista;
  - samma ordning i Mina samlingar och Spara i-kortet, med Gillade produkter först;
  - Följer: Filippa K, J.Lindeberg; Personer Ali, Elin, Maja (3 av 5 + "Visa alla"); Samlingar Skandinavisk stil, Urban stil.

  Reservsorteringen testad i Node gav samma ordning. tsc och iOS-export är gröna.
- **Inte verifierat:** Android (ingen emulator här). Hermes har Intl på Android i nuvarande RN, och annars tar reserven över. Simulatorn har nu testsamlingar och fem följda personer.
- **Utanför scope (flaggas):** Hem-hyllor och kuraterade listor (medveten ordning), användarvald sortering, sök i listor.
