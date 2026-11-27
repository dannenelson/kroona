// Följ / sluta följa via meny (brief 73): menyvalet har ingen synlig knapp som
// byter läge, så beslutet bekräftas med en snackbar. Gäller bara menyer
// (kontextmeny, mer-meny); Följ-pillen på canvas bekräftas av att den byter
// text och får ingen snackbar. Samma text för varumärke, butik, samling,
// område och person: "Du följer **<namn>**" / "Du följer inte längre **<namn>**".
// Namnet ligger sist i fetstil och kortas med ellipsis (brief 61). Ingen
// åtgärd eller Ångra. Miniatyr bara när det finns en naturlig bild.
import { useCallback } from 'react';
import { useSnackbar } from '../components/Snackbar';

type FollowToggle = {
  /** Läget före trycket. */
  followed: boolean;
  name: string;
  toggle: () => void;
  thumbUri?: string;
};

export function useFollowToggle(): (args: FollowToggle) => void {
  const snackbar = useSnackbar();
  return useCallback(
    ({ followed, name, toggle, thumbUri }: FollowToggle) => {
      toggle();
      snackbar.show({ text: followed ? 'Du följer inte längre' : 'Du följer', object: name, thumbUri });
    },
    [snackbar],
  );
}
