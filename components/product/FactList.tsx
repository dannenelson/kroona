import { StyleSheet, Text, View } from 'react-native';
import { makeStyles, typography, spacing, radius, touchTarget } from '../../theme';

export type Fact = { label: string; value: string };

/**
 * Faktatabell på Produktdetalj (brief 13): grupperad lista, nyckel till
 * vänster och värde till höger. Neutral text, inga färger (hållbarhet
 * informerar och dömer aldrig). Bara här tills den behövs på fler ställen.
 */
export function FactList({ facts }: { facts: readonly Fact[] }) {
  const styles = useStyles();
  return (
    <View style={styles.group}>
      {facts.map((fact, i) => (
        <View key={fact.label} style={[styles.row, i > 0 && styles.divider]}>
          <Text style={styles.label}>{fact.label}</Text>
          <Text style={styles.value}>{fact.value}</Text>
        </View>
      ))}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  group: {
    marginHorizontal: spacing.screenMargin,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: t.colors.surface,
  },
  row: {
    minHeight: touchTarget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.colors.sep,
  },
  label: {
    ...typography.body,
    color: t.colors.textSecondary,
  },
  value: {
    ...typography.body,
    color: t.colors.textPrimary,
    flexShrink: 1,
    textAlign: 'right',
  },
}));
