import { StyleSheet, Text, View } from 'react-native';
import { makeStyles, typography, spacing, radius, touchTarget } from '../../theme';
import { formatScore } from '../../utils/format';

export type Fact = {
  label: string;
  value: string;
  /** Kort neutral rad under raden (t.ex. när hållbarhet inte är redovisad, brief 70). */
  note?: string;
};

/**
 * Raden "Hållbarhetsindex" (brief 69–70), samma för produkt och företag:
 * "3,9 av 5", eller "Ej redovisat" med en neutral förklaring när index saknas.
 */
export function indexFact(index: number | undefined, missingNote: string): Fact {
  return index === undefined || Number.isNaN(index)
    ? { label: 'Hållbarhetsindex', value: 'Ej redovisat', note: missingNote }
    : { label: 'Hållbarhetsindex', value: `${formatScore(index)} av 5` };
}

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
        <View key={fact.label} style={[styles.item, i > 0 && styles.divider]}>
          <View style={styles.row}>
            <Text style={styles.label}>{fact.label}</Text>
            <Text style={styles.value}>{fact.value}</Text>
          </View>
          {fact.note ? <Text style={styles.note}>{fact.note}</Text> : null}
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
  item: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  row: {
    minHeight: touchTarget - spacing.sm * 2,
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
  note: {
    ...typography.label,
    color: t.colors.textSecondary,
    paddingBottom: spacing.xs,
  },
}));
