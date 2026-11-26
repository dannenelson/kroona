// Produktnamnet med Spara på samma rad, gemensamt för Produktdetalj och stora
// produktkort (en-kolumn i Följer). Namnet till vänster, den runda
// spara-knappen (SaveButton, 44) till höger, överjusterade: knappens överkant
// mot namnets överkant. Namnet radbryter före knappen och går aldrig under den.
// Knappen är högre än en namnrad; överskottet hänger ned bredvid raden under
// (priset) i stället för att göra namnraden högre.
// Utan `productId` visas bara namnet (små kort).
import { Text, View, type TextStyle } from 'react-native';
import { makeStyles, spacing, touchTarget } from '../../theme';
import SaveButton from './SaveButton';

type Props = {
  name: string;
  /** Namnets textstil, med `lineHeight` (styr knappens överhäng). */
  nameStyle: TextStyle;
  numberOfLines?: number;
  /** Visa Spara för den här produkten. */
  productId?: string;
};

export default function NameWithSave({ name, nameStyle, numberOfLines, productId }: Props) {
  const styles = useStyles();
  if (!productId) {
    return (
      <Text style={nameStyle} numberOfLines={numberOfLines}>
        {name}
      </Text>
    );
  }
  return (
    <View style={styles.row}>
      <Text style={[nameStyle, styles.name]} numberOfLines={numberOfLines}>
        {name}
      </Text>
      <View style={{ marginBottom: (nameStyle.lineHeight ?? touchTarget) - touchTarget }}>
        <SaveButton productId={productId} />
      </View>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  name: {
    flex: 1,
    minWidth: 0,
  },
}));
