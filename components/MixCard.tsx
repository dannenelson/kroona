import { radius, editorialCard } from '../theme';
import EditorialCard from './EditorialCard';

type Props = {
  title: string;
  subtitle: string;
  images: string[];
};

/**
 * Mix i "Skapat för dig" (brief 43, 52): kvadratiskt kort 160 × 160 med **en**
 * omslagsbild (mixens första produkt) och titel och undertitel vänsterställda
 * på bilden (bara toning, som små stående kort). Text på bild bara för ett
 * enda foto; flerbildskort har texten under (brief 52).
 * Ingen destination ännu: mixar har ingen egen vy.
 */
export default function MixCard({ title, subtitle, images }: Props) {
  return (
    <EditorialCard
      variant="portraitSmall"
      size={{ ...editorialCard.mix, radius: radius.editorialSmall }}
      title={title}
      subtitle={subtitle}
      imageUrl={images[0]}
      align="start"
    />
  );
}
