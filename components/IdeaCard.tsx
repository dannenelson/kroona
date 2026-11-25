import { useRouter } from 'expo-router';
import { radius, overlay, findCards } from '../theme';
import EditorialCard from './EditorialCard';
import Icon from './Icon';
import type { Idea } from '../data/ideas';

/**
 * Idékort (brief 53): liggande redaktionellt kort, 240 × 160 som standard,
 * förstoringsglas före titeln. Tryck öppnar Sökresultat direkt. `width` ger
 * fulla bredden i Idéer-listan (brief 54), höjden följer samma proportion.
 */
export default function IdeaCard({ idea, width }: { idea: Idea; width?: number }) {
  const router = useRouter();
  const w = width ?? findCards.idea.width;
  const h = (w * findCards.idea.height) / findCards.idea.width;
  return (
    <EditorialCard
      variant="landscape"
      size={{ width: w, height: h, radius: radius.editorialMedium }}
      title={idea.title}
      imageUrl={idea.image}
      titleIcon={<Icon name="search" color={overlay.onPhoto} size={findCards.ideaIcon} />}
      accessibilityLabel={`Sök: ${idea.title}`}
      onPress={() => router.push({ pathname: '/results', params: { idea: idea.id } })}
    />
  );
}
