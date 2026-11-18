// Dev-route: visar basskomponenterna (brief 03) i aktuellt tema, så att de
// kan besiktigas i Expo Go. Nås via dev-länken på Hem (bara i __DEV__).
// Inte en produktskärm, ska bort eller döljas före demo.
import { useState, type ReactNode } from 'react';
import { View, Text, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, overlay, typography, letterSpacing, spacing, radius } from '../theme';
import { PRODUCTS } from '../data/products';
import IconButton from '../components/IconButton';
import Pill from '../components/Pill';
import TextTabs from '../components/TextTabs';
import ProductCard from '../components/ProductCard';
import TopBar from '../components/TopBar';
import BackIcon from '../assets/icons/BackIcon';
import MenuIcon from '../assets/icons/MenuIcon';
import ArchiveIcon from '../assets/icons/ArchiveIcon';
import NewChatIcon from '../assets/icons/NewChatIcon';
import BookmarkIcon from '../assets/icons/BookmarkIcon';
import BookmarkIconFilled from '../assets/icons/BookmarkIcon_filled';

const [P1, P2, P3] = PRODUCTS;
const PHOTO = { uri: P3.imageUrl };
const DEMO_RATING = { rating: 4.8, reviewCount: 312 };

const STATES = [
  { label: 'Default' },
  { label: 'Pressed' }, // visas genom att hålla in
  { label: 'Selected', selected: true },
  { label: 'Disabled', disabled: true },
] as const;

const TABS = ['Allt', 'Kläder', 'Möbler', 'Begagnat', 'Belysning', 'Textil', 'Dekor'] as const;
type Tab = (typeof TABS)[number];

export default function ComponentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { scheme, setScheme } = useTheme();
  const [tab, setTab] = useState<Tab>('Allt');
  const [topSaved, setTopSaved] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconButton icon={BackIcon} accessibilityLabel="Tillbaka" onPress={() => router.back()} />
          <Text style={styles.title}>Komponenter</Text>
          <Pill onPress={() => setScheme(scheme === 'dark' ? 'light' : 'dark')}>
            {scheme === 'dark' ? 'Ljust tema' : 'Mörkt tema'}
          </Pill>
        </View>
        <Text style={styles.hint}>Pressed visas genom att hålla in en komponent.</Text>

        <Section title="1 · IconButton (glas)">
          <Caption>Över foto (identiskt i båda teman)</Caption>
          <ImageBackground source={PHOTO} style={styles.photo} imageStyle={styles.photoImage}>
            <StateRow
              render={(s) => (
                <IconButton
                  tone="photo"
                  icon={BookmarkIcon}
                  selectedIcon={BookmarkIconFilled}
                  accessibilityLabel={`Spara, ${s.label}`}
                  selected={'selected' in s}
                  disabled={'disabled' in s}
                  onPress={() => {}}
                />
              )}
              onPhoto
            />
          </ImageBackground>
          <Caption>Över ren yta</Caption>
          <StateRow
            render={(s) => (
              <IconButton
                icon={BookmarkIcon}
                selectedIcon={BookmarkIconFilled}
                accessibilityLabel={`Spara, ${s.label}`}
                selected={'selected' in s}
                disabled={'disabled' in s}
                onPress={() => {}}
              />
            )}
          />
        </Section>

        <Section title="2 · Pill (glas och fylld)">
          <Caption>Glas över foto</Caption>
          <ImageBackground source={PHOTO} style={styles.photo} imageStyle={styles.photoImage}>
            <StateRow
              render={(s) => (
                <Pill tone="photo" selected={'selected' in s} disabled={'disabled' in s} onPress={() => {}}>
                  Mode
                </Pill>
              )}
              onPhoto
            />
          </ImageBackground>
          <Caption>Glas över ren yta</Caption>
          <StateRow
            render={(s) => (
              <Pill selected={'selected' in s} disabled={'disabled' in s} onPress={() => {}}>
                Mode
              </Pill>
            )}
          />
          <Caption>Fylld</Caption>
          <StateRow
            render={(s) => (
              <Pill variant="filled" selected={'selected' in s} disabled={'disabled' in s} onPress={() => {}}>
                Mode
              </Pill>
            )}
          />
        </Section>

        <Section title="3 · TextTabs" bleed>
          <Caption inset>Scrollar horisontellt · Disabled: Dekor</Caption>
          <TextTabs items={TABS} selected={tab} onSelect={setTab} disabledItems={['Dekor']} />
        </Section>

        <Section title="4 · ProductCard">
          <Caption>Small · bara bild, radie tile</Caption>
          <View style={styles.row}>
            {[P1, P2, P3].map((p) => (
              <ProductCard key={p.id} {...p} size="S" />
            ))}
          </View>
          <Caption>Medium · selected = sparad (tryck på bokmärket) · höger: disabled</Caption>
          <View style={styles.row}>
            <ProductCard {...P1} {...DEMO_RATING} />
            <ProductCard {...P2} {...DEMO_RATING} disabled />
          </View>
          <Caption>Large</Caption>
          <ProductCard {...P2} {...DEMO_RATING} size="L" featured aspectRatio={4 / 5} />
        </Section>

        <Section title="5 · TopBar" bleed>
          <Caption inset>Produktdetalj · tillbaka + spara, över foto</Caption>
          <ImageBackground source={{ uri: P2.imageUrl }} style={styles.topBarPhoto}>
            <TopBar
              tone="photo"
              left={{ icon: BackIcon, accessibilityLabel: 'Tillbaka', onPress: () => {} }}
              right={[
                {
                  icon: BookmarkIcon,
                  selectedIcon: BookmarkIconFilled,
                  accessibilityLabel: 'Spara',
                  selected: topSaved,
                  onPress: () => setTopSaved((v) => !v),
                },
              ]}
            />
          </ImageBackground>
          <Caption inset>Hitta · meny + arkiv och ny chatt, över ren yta</Caption>
          <TopBar
            left={{ icon: MenuIcon, accessibilityLabel: 'Meny', onPress: () => {} }}
            right={[
              { icon: ArchiveIcon, accessibilityLabel: 'Arkiv', onPress: () => {} },
              { icon: NewChatIcon, accessibilityLabel: 'Ny chatt', onPress: () => {} },
            ]}
          />
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, bleed, children }: { title: string; bleed?: boolean; children: ReactNode }) {
  const styles = useStyles();
  return (
    <View style={[styles.section, !bleed && styles.inset]}>
      <Text style={[styles.sectionTitle, bleed && styles.inset]}>{title}</Text>
      {children}
    </View>
  );
}

function Caption({ children, inset }: { children: ReactNode; inset?: boolean }) {
  const styles = useStyles();
  return <Text style={[styles.caption, inset && styles.inset]}>{children}</Text>;
}

type State = (typeof STATES)[number];

function StateRow({ render, onPhoto }: { render: (s: State) => ReactNode; onPhoto?: boolean }) {
  const styles = useStyles();
  return (
    <View style={styles.states}>
      {STATES.map((s) => (
        <View key={s.label} style={styles.state}>
          {render(s)}
          <Text style={[styles.caption, onPhoto && styles.captionOnPhoto]}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.sm,
  },
  title: {
    ...typography.title2,
    color: t.colors.textPrimary,
    flex: 1,
  },
  hint: {
    ...typography.caption,
    color: t.colors.textTertiary,
    paddingHorizontal: spacing.screenMargin,
  },
  section: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  inset: {
    paddingHorizontal: spacing.screenMargin,
  },
  sectionTitle: {
    ...typography.label,
    color: t.colors.textTertiary,
    letterSpacing: letterSpacing.caps,
    textTransform: 'uppercase',
  },
  caption: {
    ...typography.micro,
    color: t.colors.textTertiary,
  },
  captionOnPhoto: {
    color: overlay.onPhoto, // på foto: fast vit i båda teman
  },
  photo: {
    padding: spacing.lg,
  },
  photoImage: {
    borderRadius: radius.card,
  },
  states: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  state: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.gutter,
  },
  topBarPhoto: {
    paddingVertical: spacing.xl,
  },
}));
