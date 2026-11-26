// Hälsningen på Hem: korta, lågmälda rader som varierar efter tid på dygnet.
// {namn} byts mot förnamnet. Lätt att byta: redigera listorna här.
// En rad väljs slumpvis vid appstart och behålls hela sessionen.

type Slot = { from: number; to: number; lines: readonly string[] };

/** Timintervall [from, to) i lokal tid; natten går över midnatt. */
export const GREETINGS: readonly Slot[] = [
  { from: 5, to: 10, lines: ['Morgon, {namn}', 'Tidig start, {namn}?', 'Ny dag, {namn}'] },
  { from: 10, to: 12, lines: ['Hej {namn}', 'Hej igen, {namn}', 'Lagom mitt på förmiddagen'] },
  {
    from: 12,
    to: 17,
    lines: ['God eftermiddag, {namn}', 'Dags för en paus, {namn}?', 'Eftermiddagsfynd, {namn}?'],
  },
  { from: 17, to: 22, lines: ['God kväll, {namn}', 'Mysig kväll, {namn}', 'Kvällens fynd, {namn}?'] },
  { from: 22, to: 5, lines: ['Sent uppe, {namn}?', 'Nattugglan {namn}', 'Natt, {namn}'] },
];

function slotFor(hour: number): Slot {
  return (
    GREETINGS.find((s) => (s.from < s.to ? hour >= s.from && hour < s.to : hour >= s.from || hour < s.to)) ??
    GREETINGS[0]
  );
}

let sessionGreeting: string | null = null;

/** Hälsningen för den här sessionen: slumpad rad för tiden vid första anropet. */
export function sessionGreetingFor(name: string, date = new Date()): string {
  if (sessionGreeting === null) {
    const { lines } = slotFor(date.getHours());
    sessionGreeting = lines[Math.floor(Math.random() * lines.length)];
  }
  return sessionGreeting.replace('{namn}', name);
}
