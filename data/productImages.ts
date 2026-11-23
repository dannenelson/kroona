// Lokala produktbilder (brief 48). DUMMYDATA: tillfälligt demomaterial i
// assets/dummy/products/ som ska bytas eller tas bort före publik release.
// Metro kräver statiska require; `Image.resolveAssetSource` gör om dem till
// URI-strängar, så att `imageUrl` förblir en sträng och komponenterna läser
// `{ uri: imageUrl }` som förut. Bilderna är 500 px breda.
import { Image } from 'react-native';

const uri = (source: number) => Image.resolveAssetSource(source)?.uri ?? '';

export const PRODUCT_IMAGES = {
  ponchoKnit: uri(require('../assets/dummy/products/poncho-knit.jpeg')),
  headphonesRetro: uri(require('../assets/dummy/products/headphones-retro.jpeg')),
  sneakerBlackStudio: uri(require('../assets/dummy/products/sneaker-black-studio.jpeg')),
  lampsBrass: uri(require('../assets/dummy/products/lamps-brass.jpeg')),
  sneakerRedRunner: uri(require('../assets/dummy/products/sneaker-red-runner.jpeg')),
  sneakerBlackLow: uri(require('../assets/dummy/products/sneaker-black-low.jpeg')),
  speakerSmart: uri(require('../assets/dummy/products/speaker-smart.jpeg')),
  backpackNavy: uri(require('../assets/dummy/products/backpack-navy.jpeg')),
  headphonesBlack: uri(require('../assets/dummy/products/headphones-black.jpeg')),
  sunglasses: uri(require('../assets/dummy/products/sunglasses.jpeg')),
  toteWovenLeather: uri(require('../assets/dummy/products/tote-woven-leather.jpeg')),
  sneakerOrange: uri(require('../assets/dummy/products/sneaker-orange.jpeg')),
  bootsSuede: uri(require('../assets/dummy/products/boots-suede.jpeg')),
  chairLoungeDark: uri(require('../assets/dummy/products/chair-lounge-dark.jpeg')),
  backpackLeather: uri(require('../assets/dummy/products/backpack-leather.jpeg')),
  chairRattan: uri(require('../assets/dummy/products/chair-rattan.jpeg')),
  tableOakCoffee: uri(require('../assets/dummy/products/table-oak-coffee.jpeg')),
  bagSaddle: uri(require('../assets/dummy/products/bag-saddle.jpeg')),
  blazerRed: uri(require('../assets/dummy/products/blazer-red.jpeg')),
  chairArmchairWhite: uri(require('../assets/dummy/products/chair-armchair-white.jpeg')),
} as const;
