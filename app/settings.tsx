// Inställningar (brief 64), öppnas från Profil. Utseende har en riktig växel
// Ljust / Mörkt / System (sparas lokalt, gäller direkt i hela appen, se
// theme/ThemeProvider). Notiser är dummyväxlar (inget sparas, inga riktiga
// notiser i Fas 0). Om visar versionen. Utvecklare har dev-sidan
// "Komponenter (dev)", som bara nås härifrån.
import { useState } from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, spacing, type ThemePreference } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import SegmentedIcons from '../components/SegmentedIcons';
import { GroupedRow, GroupedSection } from '../components/GroupedList';

const APPEARANCE: { value: ThemePreference; label: string; icon?: 'sun' | 'moon'; text?: string }[] = [
  { value: 'light', label: 'Ljust', icon: 'sun' },
  { value: 'dark', label: 'Mörkt', icon: 'moon' },
  { value: 'system', label: 'System', text: 'System' },
];

// Dummyväxlar (Fas 0): bara lokalt läge medan skärmen är öppen.
const NOTIFICATION_SETTINGS = [
  { key: 'news', label: 'Nytt från det du följer', initial: true },
  { key: 'price', label: 'Lägre pris på sparat', initial: true },
  { key: 'collections', label: 'Uppdaterade samlingar', initial: false },
] as const;

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { preference, setPreference } = useTheme();
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATION_SETTINGS.map((s) => [s.key, s.initial])),
  );
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
      >
        <ScreenHeader title="Inställningar" />
        <View style={styles.sections}>
          <GroupedSection title="Utseende">
            <GroupedRow
              label="Tema"
              trailing={<SegmentedIcons items={APPEARANCE} selected={preference} onSelect={setPreference} />}
            />
          </GroupedSection>

          <GroupedSection title="Notiser">
            {NOTIFICATION_SETTINGS.map((s) => (
              <GroupedRow
                key={s.key}
                label={s.label}
                trailing={
                  <Switch
                    accessibilityLabel={s.label}
                    value={toggles[s.key]}
                    onValueChange={(on) => setToggles((prev) => ({ ...prev, [s.key]: on }))}
                  />
                }
              />
            ))}
          </GroupedSection>

          <GroupedSection title="Om">
            <GroupedRow label="Version" value={version} />
          </GroupedSection>

          {__DEV__ ? (
            <GroupedSection title="Utvecklare">
              <GroupedRow icon="grid" label="Komponenter (dev)" onPress={() => router.push('/components')} />
            </GroupedSection>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  sections: {
    paddingTop: spacing.xl,
    gap: spacing.xl,
  },
}));
