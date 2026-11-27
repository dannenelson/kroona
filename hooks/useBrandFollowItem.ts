// Menyvalet "Följ <märke>" / "Sluta följa <märke>" (brief 72), delat av
// produktkortets kontextmeny och mer-menyn på Produktdetalj. Samma följ-lagring
// som företagsprofilen (FollowedCollectionsContext + getRetailerFollowKey).
// Bara när märket har en profil; annars null. Ikonen följer läget (brief 67).
// Långa namn kortas med ellipsis av menyraden (MenuRow, en rad). Valet
// bekräftas med följ-snackbaren (brief 73), utan miniatyr (logotypen är vektor).
import { useFollowedCollections } from '../context/FollowedCollectionsContext';
import { getRetailerFollowKey } from '../data/collections';
import { getRetailerForBrand } from '../lib/catalog';
import { useFollowToggle } from './useFollowToggle';
import type { ContextMenuItem } from '../components/ProductContextMenu';

export function useBrandFollowItem(brand: string): ContextMenuItem | null {
  const { isFollowed, toggleFollowed } = useFollowedCollections();
  const followToggle = useFollowToggle();
  const profile = getRetailerForBrand(brand);
  if (!profile) return null;
  const key = getRetailerFollowKey(profile.id);
  const followed = isFollowed(key);
  return {
    label: followed ? `Sluta följa ${profile.name}` : `Följ ${profile.name}`,
    icon: followed ? 'company-check' : 'company-add',
    onPress: () => followToggle({ followed, name: profile.name, toggle: () => toggleFollowed(key) }),
  };
}
