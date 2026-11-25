#!/usr/bin/env node
// Genererar ikonregistren (brief 57) från filnamnen:
//   assets/svg/icons/*.svg  → components/iconRegistry.ts      (IconName)
//   assets/svg/brands/*.svg → components/brandIconRegistry.ts (BrandIconName)
// Kör efter att en ikon lagts till, bytt namn eller tagits bort:
//   node scripts/generate-icon-registry.js
// Filnamnet utan .svg är ikonens namn. `<namn>-filled.svg` är den fyllda varianten.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function generate({ dir, out, typeName, constName, header }) {
  const names = fs
    .readdirSync(path.join(root, dir))
    .filter((f) => f.endsWith('.svg'))
    .map((f) => f.slice(0, -4))
    .sort();

  const ident = (n) => 'I_' + n.replace(/[^a-zA-Z0-9]/g, '_');
  const rel = path.relative(path.dirname(path.join(root, out)), path.join(root, dir));

  const lines = [
    '// GENERERAD FIL – ändra inte för hand. Kör `node scripts/generate-icon-registry.js`.',
    `// ${header}`,
    "import type { FC } from 'react';",
    "import type { SvgProps } from 'react-native-svg';",
    ...names.map((n) => `import ${ident(n)} from '${rel}/${n}.svg';`),
    '',
    `export const ${constName} = {`,
    ...names.map((n) => `  '${n}': ${ident(n)},`),
    `} as const satisfies Record<string, FC<SvgProps>>;`,
    '',
    `export type ${typeName} = keyof typeof ${constName};`,
    '',
  ];
  fs.writeFileSync(path.join(root, out), lines.join('\n'));
  console.log(`${out}: ${names.length} ikoner`);
}

generate({
  dir: 'assets/svg/icons',
  out: 'components/iconRegistry.ts',
  typeName: 'IconName',
  constName: 'iconRegistry',
  header: 'Gränssnittsikoner (assets/svg/icons). Används via components/Icon.tsx.',
});

generate({
  dir: 'assets/svg/brands',
  out: 'components/brandIconRegistry.ts',
  typeName: 'BrandIconName',
  constName: 'brandIconRegistry',
  header: 'Märkesikoner/SoMe (assets/svg/brands). Officiella former, egen fyllning, ingen linje.',
});
