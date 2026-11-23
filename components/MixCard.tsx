import { StyleSheet } from 'react-native';
import { radius, editorialCard } from '../theme';
import EditorialCard from './EditorialCard';
import CollectionMosaic from './CollectionMosaic';

type Props = {
  title: string;
  subtitle: string;
  images: string[];
};

/**
 * Mix i "Skapat för dig" (brief 43): kvadratiskt kort 160 × 160 med en 2 × 2-
 * mosaik av produktbilder och titel och undertitel på bilden (bara toning,
 * som små stående kort). Ingen destination ännu: mixar har ingen egen vy.
 */
export default function MixCard({ title, subtitle, images }: Props) {
  return (
    <EditorialCard
      variant="portraitSmall"
      size={{ ...editorialCard.mix, radius: radius.editorialSmall }}
      title={title}
      subtitle={subtitle}
      cover={<CollectionMosaic images={images} style={StyleSheet.absoluteFill} />}
    />
  );
}
