// "Så räknar vi" (brief 70): tryck på hållbarhetsindexet (Produktdetalj och
// företagsprofilen) öppnar ett kort-sheet (samma Sheet som "Spara i …") som
// visar hur siffran räknats: indexet, fyra delposter med delbetyg och en rad
// förklaring, och att uppgifterna är exempeldata. Indexet är medelvärdet av
// delposterna (lib/indexBreakdown). Neutral ton, ingen färgkodning.
import { StyleSheet, Text, View } from 'react-native';
import { makeStyles, typography, spacing, radius } from '../theme';
import { formatScore } from '../utils/format';
import { indexBreakdown } from '../lib/indexBreakdown';
import { SheetContent, useSheet } from './Sheet';

/** Öppnar "Så räknar vi" för ett index; `seed` (t.ex. id) ger stabila delposter. */
export function useOpenIndexSheet() {
  const sheet = useSheet();
  return (index: number, seed: string) =>
    sheet.open({
      title: 'Så räknar vi',
      presentation: 'card',
      render: () => <IndexSheet index={index} seed={seed} />,
    });
}

function IndexSheet({ index, seed }: { index: number; seed: string }) {
  const styles = useStyles();
  const parts = indexBreakdown(index, seed);
  return (
    <SheetContent>
      <View style={styles.body}>
        <View style={styles.head} accessible accessibilityLabel={`Hållbarhetsindex ${formatScore(index)} av 5`}>
          <Text style={styles.index}>{formatScore(index)} av 5</Text>
          <Text style={styles.headHint}>Hållbarhetsindex, medelvärdet av delposterna nedan.</Text>
        </View>
        <View style={styles.group}>
          {parts.map((p, i) => (
            <View
              key={p.label}
              style={[styles.row, i > 0 && styles.divider]}
              accessible
              accessibilityLabel={`${p.label}, ${formatScore(p.score)} av 5. ${p.text}`}
            >
              <View style={styles.rowTop}>
                <Text style={styles.label}>{p.label}</Text>
                <Text style={styles.score}>{formatScore(p.score)}</Text>
              </View>
              <Text style={styles.text}>{p.text}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.footnote}>Uppgifterna är exempeldata i demot.</Text>
      </View>
    </SheetContent>
  );
}

const useStyles = makeStyles((t) => ({
  body: {
    gap: spacing.lg,
    paddingTop: spacing.md,
  },
  head: {
    gap: spacing.xs,
  },
  index: {
    ...typography.title1,
    color: t.colors.textPrimary,
  },
  headHint: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  group: {
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: t.colors.surface,
  },
  row: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.colors.sep,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
  score: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
  text: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  footnote: {
    ...typography.caption,
    color: t.colors.textSecondary,
  },
}));
