// Dev-route: visar basskomponenterna (brief 04, Apple-ren) i aktuellt tema, så
// att de kan besiktigas i Expo Go. Nås via dev-länken på Hem (bara i __DEV__).
// Inte en produktskärm, ska bort eller döljas före demo.
import { useState, type ReactNode } from 'react';
import { View, Text, ScrollView, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, overlay, typography, letterSpacing, spacing, radius } from '../theme';
import { PRODUCTS } from '../data/products';
import IconButton from '../components/IconButton';
import Pill from '../components/Pill';
import TextTabs from '../components/TextTabs';
import ProductCard from '../components/ProductCard';
import TopBar from '../components/TopBar';
import EdgeFade from '../components/EdgeFade';
import BackIcon from '../assets/icons/BackIcon';
import MenuIcon from '../assets/icons/MenuIcon';
import ArchiveIcon from '../assets/icons/ArchiveIcon';
import NewChatIcon from '../assets/icons/NewChatIcon';
import BookmarkIcon from '../assets/icons/BookmarkIcon';
import BookmarkIconFilled from '../assets/icons/BookmarkIcon_filled';

const [P1, P2, P3] = PRODUCTS;
const PHOTO = { uri: P3.imageUrl };
const DEMO_RATING = { rating: 4.8, reviewCount: 312 };
// Höjd på kantblur-demons fönster (lokalt demomått).
const FADE_DEMO_HEIGHT = 360;

const STATES = [
  { label: 'Standard' },
  { label: 'Nedtryckt' }, // visas genom att hålla in
  { label: 'Vald', selected: true },
  { label: 'Inaktiv', disabled: true },
] as const;

const TABS = ['Alla', 'Kläder', 'Möbler', 'Begagnat', 'Belysning', 'Textil', 'Dekor'] as const;
type Tab = (typeof TABS)[number];

export default function ComponentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { scheme, setScheme } = useTheme();
  const [tab, setTab] = useState<Tab>('Alla');
  const [topSaved, setTopSaved] = useState(false);
  const [fadeBlur, setFadeBlur] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconButton tone="plain" icon={BackIcon} accessibilityLabel="Tillbaka" onPress={() => router.back()} />
          <Text style={styles.title}>Komponenter</Text>
          <Pill onPress={() => setScheme(scheme === 'dark' ? 'light' : 'dark')}>
            {scheme === 'dark' ? 'Ljust tema' : 'Mörkt tema'}
          </Pill>
        </View>
        <Text style={styles.hint}>
          Nedtryckt visas genom att hålla in. Långt tryck på ett produktkort öppnar menyn.
        </Text>

        <Section title="1 · IconButton (glas)">
          <Caption>Över foto (identiskt i båda teman)</Caption>
          <ImageBackground source={PHOTO} style={styles.photo}>
            <StateRow
              onPhoto
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
            />
          </ImageBackground>
          <Caption>Över ren yta (ljust: surface + line, TODO(design))</Caption>
          <StateRow
            render={(s) => (
              <IconButton
                tone="plain"
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

        <Section title="2 · Pill">
          <Caption>Fylld (standard)</Caption>
          <StateRow
            render={(s) => (
              <Pill selected={'selected' in s} disabled={'disabled' in s} onPress={() => {}}>
                Mode
              </Pill>
            )}
          />
          <Caption>Glas över foto</Caption>
          <ImageBackground source={PHOTO} style={styles.photo}>
            <StateRow
              onPhoto
              render={(s) => (
                <Pill variant="glass" selected={'selected' in s} disabled={'disabled' in s} onPress={() => {}}>
                  Mode
                </Pill>
              )}
            />
          </ImageBackground>
        </Section>

        <Section title="3 · TextTabs" bleed>
          <Caption inset>Scrollar horisontellt · Inaktiv: Dekor</Caption>
          <TextTabs items={TABS} selected={tab} onSelect={setTab} disabledItems={['Dekor']} />
        </Section>

        <Section title="4 · ProductCard">
          <Caption>Small · bara bild, radie tile</Caption>
          <View style={styles.row}>
            {[P1, P2, P3].map((p) => (
              <ProductCard key={p.id} {...p} size="S" />
            ))}
          </View>
          <Caption>Medium · håll in för menyn · höger: inaktiv</Caption>
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
            tone="plain"
            left={{ icon: MenuIcon, accessibilityLabel: 'Meny', onPress: () => {} }}
            right={[
              { icon: ArchiveIcon, accessibilityLabel: 'Arkiv', onPress: () => {} },
              { icon: NewChatIcon, accessibilityLabel: 'Ny chatt', onPress: () => {} },
            ]}
          />
        </Section>

        <Section title="6 · EdgeFade (kantblur)">
          <View style={styles.fadeHeader}>
            <Caption>Scrolla bilderna. Topp 68, botten 128.</Caption>
            <Pill selected={fadeBlur} onPress={() => setFadeBlur((v) => !v)}>
              {fadeBlur ? 'Blur på' : 'Blur av'}
            </Pill>
          </View>
          <View style={styles.fadeDemo}>
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
              {PRODUCTS.slice(0, 6).map((p) => (
                <Image key={p.id} source={{ uri: p.imageUrl }} style={styles.fadeImage} />
              ))}
            </ScrollView>
            <EdgeFade position="top" height={edgeTopDemo} blur={fadeBlur} />
            <EdgeFade position="bottom" blur={fadeBlur} />
          </View>
        </Section>
      </ScrollView>

      {/* Kantblur överst på hela skärmen, som på riktiga skärmar. */}
      <EdgeFade position="top" blur={fadeBlur} />
    </View>
  );
}

// Toppens höjd i demon: statusfält saknas i rutan, så referensens 68 används direkt.
const edgeTopDemo = 68;

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
    color: t.colors.textSecondary,
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
    color: t.colors.textSecondary,
    letterSpacing: letterSpacing.caps,
    textTransform: 'uppercase',
  },
  caption: {
    ...typography.micro,
    color: t.colors.textSecondary,
  },
  captionOnPhoto: {
    color: overlay.onPhoto, // på foto: fast vit i båda teman
  },
  photo: {
    padding: spacing.lg,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  states: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  fadeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  fadeDemo: {
    height: FADE_DEMO_HEIGHT,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: t.colors.placeholder,
  },
  fadeImage: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
}));
