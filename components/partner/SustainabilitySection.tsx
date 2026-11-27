// Hållbarhet på företagsprofilen (brief 69). Samma språk som Hållbarhet på
// Produktdetalj: rubriken "Hållbarhet" och indexet som faktarad ("4,4 av 5",
// samma FactList och skala 1–5). Under: certifikat som chips (tryck öppnar ett
// kort med namn, utfärdare och förklaring) och hållbara initiativ som en
// grupperad lista. Sektionen visas alltid (brief 70): saknas index står
// "Ej redovisat" med en neutral rad; certifikat och initiativ döljs var för sig.
// DUMMYDATA i Fas 0: ingen verifiering, inga länkar ut, inget beräknat index.
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles, useTheme, typography, spacing, radius, iconSize, touchTarget } from '../../theme';
import type { Certification, Retailer } from '../../types/catalog';
import { haptic } from '../../utils/haptic';
import { FactList, indexFact } from '../product/FactList';
import { SheetContent, useSheet } from '../Sheet';
import SectionTitle from '../SectionTitle';
import { useOpenIndexSheet } from '../SustainabilityIndexSheet';
import Icon from '../Icon';

type Props = {
  retailer: Pick<Retailer, 'sustainabilityIndex' | 'certifications' | 'initiatives'>;
  /** Frö för "Så räknar vi" (företagets id), så att delposterna är stabila. */
  indexSeed?: string;
  /** Rubrikens stil, samma som skärmens övriga avsnitt. */
  titleStyle?: StyleProp<ViewStyle>;
};

export function hasSustainability({ sustainabilityIndex, certifications, initiatives }: Props['retailer']) {
  return sustainabilityIndex !== undefined || !!certifications?.length || !!initiatives?.length;
}

export default function SustainabilitySection({ retailer, titleStyle, indexSeed = '' }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const sheet = useSheet();
  const openIndexSheet = useOpenIndexSheet();
  const { sustainabilityIndex, certifications = [], initiatives = [] } = retailer;

  const openCertification = (c: Certification) => {
    haptic.light();
    sheet.open({
      title: c.name,
      presentation: 'card',
      render: () => (
        <SheetContent>
          <View style={styles.sheetBody}>
            {c.issuer ? <Text style={styles.issuer}>{c.issuer}</Text> : null}
            <Text style={styles.sheetText}>{c.description}</Text>
          </View>
        </SheetContent>
      ),
    });
  };

  return (
    <View>
      <SectionTitle title="Hållbarhet" style={titleStyle} />
      <View style={styles.parts}>
        <FactList
          facts={[
            indexFact(
              sustainabilityIndex,
              'Företaget har inte redovisat sin hållbarhet.',
              sustainabilityIndex !== undefined ? () => openIndexSheet(sustainabilityIndex, indexSeed) : undefined,
            ),
          ]}
        />

        {certifications.length > 0 ? (
          <View style={styles.part}>
            <Text style={styles.partTitle}>Certifikat</Text>
            <View style={styles.chips}>
              {certifications.map((c) => (
                <Pressable
                  key={c.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${c.name}, visa vad det betyder`}
                  hitSlop={(touchTarget - CHIP_HEIGHT) / 2}
                  onPress={() => openCertification(c)}
                  style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                >
                  <Icon name="verified" color={colors.textPrimary} size={iconSize.chevron} />
                  <Text style={styles.chipText}>{c.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {initiatives.length > 0 ? (
          <View style={styles.part}>
            <Text style={styles.partTitle}>Hållbara initiativ</Text>
            <View style={styles.group}>
              {initiatives.map((item, i) => (
                <View key={item.id} style={[styles.row, i > 0 && styles.divider]}>
                  <Icon name="leaf" color={colors.textSecondary} size={iconSize.md} />
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>{item.title}</Text>
                    <Text style={styles.rowDescription} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

// Som Pill (34 hög: label-radhöjd + 2 × 8), med ikon.
const CHIP_HEIGHT = typography.label.lineHeight + spacing.sm * 2;

const useStyles = makeStyles((t) => ({
  parts: {
    gap: spacing.lg,
  },
  part: {
    gap: spacing.sm,
  },
  partTitle: {
    ...typography.label,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenMargin,
  },
  chip: {
    height: CHIP_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: t.colors.surfaceRaised,
  },
  chipPressed: {
    backgroundColor: t.colors.pressed,
  },
  chipText: {
    ...typography.label,
    color: t.colors.textPrimary,
  },
  // Grupperad lista som faktalistan (surface, radie card, hårlinjer).
  group: {
    marginHorizontal: spacing.screenMargin,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: t.colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.colors.sep,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
  rowTitle: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
  rowDescription: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  sheetBody: {
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  issuer: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  sheetText: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
}));
