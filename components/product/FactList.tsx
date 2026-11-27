import { Pressable, StyleSheet, Text, View } from 'react-native';
import { makeStyles, useTheme, typography, spacing, radius, touchTarget, iconSize } from '../../theme';
import Icon from '../Icon';
import { formatScore } from '../../utils/format';

export type Fact = {
  label: string;
  value: string;
  /** Kort neutral rad under raden (t.ex. när hållbarhet inte är redovisad, brief 70). */
  note?: string;
  /** Tryckbar rad (chevron), t.ex. indexet öppnar "Så räknar vi" (brief 70). */
  onPress?: () => void;
};

/**
 * Raden "Hållbarhetsindex" (brief 69–70), samma för produkt och företag:
 * "3,9 av 5", eller "Ej redovisat" med en neutral förklaring när index saknas.
 */
export function indexFact(index: number | undefined, missingNote: string, onPress?: () => void): Fact {
  return index === undefined || Number.isNaN(index)
    ? { label: 'Hållbarhetsindex', value: 'Ej redovisat', note: missingNote }
    : { label: 'Hållbarhetsindex', value: `${formatScore(index)} av 5`, onPress };
}

/**
 * Faktatabell på Produktdetalj (brief 13): grupperad lista, nyckel till
 * vänster och värde till höger. Neutral text, inga färger (hållbarhet
 * informerar och dömer aldrig). Bara här tills den behövs på fler ställen.
 */
export function FactList({ facts }: { facts: readonly Fact[] }) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.group}>
      {facts.map((fact, i) => {
        const content = (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>{fact.label}</Text>
              <Text style={styles.value}>{fact.value}</Text>
              {fact.onPress ? <Icon name="chevron-right" color={colors.textTertiary} size={iconSize.chevron} /> : null}
            </View>
            {fact.note ? <Text style={styles.note}>{fact.note}</Text> : null}
          </>
        );
        return fact.onPress ? (
          <Pressable
            key={fact.label}
            accessibilityRole="button"
            accessibilityLabel={`${fact.label}, ${fact.value}`}
            accessibilityHint="Visar hur indexet räknas"
            onPress={fact.onPress}
            style={({ pressed }) => [styles.item, i > 0 && styles.divider, pressed && styles.pressed]}
          >
            {content}
          </Pressable>
        ) : (
          <View key={fact.label} style={[styles.item, i > 0 && styles.divider]}>
            {content}
          </View>
        );
      })}
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
    marginLeft: 'auto',
    textAlign: 'right',
  },
  pressed: {
    backgroundColor: t.colors.pressed,
  },
  note: {
    ...typography.label,
    color: t.colors.textSecondary,
    paddingBottom: spacing.xs,
  },
}));
