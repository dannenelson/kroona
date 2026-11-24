// Dev-route: visar basskomponenterna (brief 04, Apple-ren) i aktuellt tema, så
// att de kan besiktigas i Expo Go. Nås via dev-länken på Hem (bara i __DEV__).
// Inte en produktskärm, ska bort eller döljas före demo.
import { useState, type ReactNode } from 'react';
import { View, Text, ScrollView, ImageBackground, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, overlay, typography, letterSpacing, spacing, radius, touchTarget, iconSize, logo } from '../theme';
import { PRODUCTS } from '../data/products';
import IconButton from '../components/IconButton';
import Pill from '../components/Pill';
import TextTabs from '../components/TextTabs';
import ProductCard from '../components/ProductCard';
import TopBar from '../components/TopBar';
import EdgeFade from '../components/EdgeFade';
import KroonaLogo from '../components/KroonaLogo';
import NotificationIcon from '../components/NotificationIcon';
import EditorialCard from '../components/EditorialCard';
import SectionTitle from '../components/SectionTitle';
import { ALL_RETAILER_LOGO_FILES, ALL_COLLECTION_LOGO_FILES, LOGO_ASPECT } from '../data/logos';
import { setGestureDebug, useGestureDebug } from '../utils/devGestureDebug'; // TEMP-DEBUG-GEST
import BackIcon from '../assets/icons/BackIcon';
import MenuIcon from '../assets/icons/MenuIcon';
import ArchiveIcon from '../assets/icons/ArchiveIcon';
import NewChatIcon from '../assets/icons/NewChatIcon';
import BookmarkIcon from '../assets/icons/BookmarkIcon';
import BookmarkIconFilled from '../assets/icons/BookmarkIcon_filled';
import HeartIcon from '../assets/icons/HeartIcon';
import HeartIconFilled from '../assets/icons/HeartIcon_filled';

const [P1, P2, P3] = PRODUCTS;
// Ljusaste och mörkaste produktfotot (uppmätt medelluminans 0,69 resp. 0,45),
// för att pröva läsbarheten hos glas på foto i båda teman.
const PHOTOS = [
  { label: 'ljust foto', source: { uri: P3.imageUrl } },
  { label: 'mörkare foto', source: { uri: P1.imageUrl } },
] as const;
const DEMO_RATING = { rating: 4.8, reviewCount: 312 };
// Provhöjder för logotypen (brief 45): toppens storlek (ca 18–20) och större.
const LOGO_HEIGHTS = [18, 20, 28, 40] as const;

const STATES = [
  { label: 'Standard' },
  { label: 'Nedtryckt' }, // visas genom att hålla in
  { label: 'Vald', selected: true },
  { label: 'Inaktiv', disabled: true },
] as const;

const PRESS_TABS = ['Alla', 'Kläder', 'Möbler'] as const;
const TABS = ['Alla', 'Kläder', 'Möbler', 'Begagnat', 'Belysning', 'Textil', 'Dekor'] as const;
type Tab = (typeof TABS)[number];

export default function ComponentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { scheme, setScheme, colors } = useTheme();
  const [tab, setTab] = useState<Tab>('Alla');
  const [pressTab, setPressTab] = useState<(typeof PRESS_TABS)[number]>('Alla');
  const [topSaved, setTopSaved] = useState(false);
  // Tryckbara vald-exempel: se fylld ikon och "pop" vid markering (brief 09).
  const [demoSaved, setDemoSaved] = useState(false);
  const [demoLiked, setDemoLiked] = useState(false);
  const [fadeBlur, setFadeBlur] = useState(true);
  const gestureDebug = useGestureDebug(); // TEMP-DEBUG-GEST
  // Test av toppkantens nedre gräns (brief 10). Standard rak.
  const [fadeWave, setFadeWave] = useState(false);
  // iOS 26:s egen scroll-edge-effekt överst. Av som standard, så att bara vår
  // kant syns; på för att jämföra och bekräfta källan till flikarnas toning.
  const [nativeEdge, setNativeEdge] = useState(false);

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
          Nedtryckt visas genom att hålla in. Växla tema uppe till höger: glas på foto följer temat.
          Toppkanten: scrolla och titta upp mot Dynamic Island, växla Rak/Vågig längst ner.
        </Text>

        <Section title="Produktdetalj">
          <Caption>Öppna en produkt av varje typ. Alla produktkort öppnar också detaljen.</Caption>
          <View style={styles.detailLinks}>
            <Pill onPress={() => router.push('/product/2')}>Nytt och begagnat</Pill>
            <Pill onPress={() => router.push('/product/3')}>Bara begagnat</Pill>
            <Pill onPress={() => router.push('/product/1')}>Bara nytt</Pill>
            {/* TEMP-DEBUG-GEST: diagnosrad för stängningsgesten på Produktdetalj. */}
            <Pill selected={gestureDebug} onPress={() => setGestureDebug(!gestureDebug)}>
              {gestureDebug ? 'Gestdiagnos på' : 'Gestdiagnos av'}
            </Pill>
          </View>
        </Section>

        <Section title="Hyllrubrik med Visa fler (brief 53)">
          {/* Exempel; i appen har Idéer, Kategorier och Områden länken (brief 54). */}
          <SectionTitle title="Idéer för dig" cta={{ onPress: () => {} }} />
        </Section>

        <Section title="SVG · Logotyp och notisikon">
          <Caption>
            .svg-filer i temats textfärg (currentColor). Växla tema uppe till höger. Höjd {LOGO_HEIGHTS.join(' / ')} px;
            ™ blir oläsligt vid liten höjd.
          </Caption>
          {LOGO_HEIGHTS.map((h) => (
            <KroonaLogo key={h} height={h} />
          ))}
          <View style={styles.pressRow}>
            <NotificationIcon size={iconSize.md} />
            <NotificationIcon />
            <NotificationIcon color={colors.textSecondary} />
          </View>
        </Section>

        <Section title="Logotyper (dummy, brief 47)">
          <Caption>Återförsäljare på mörk platta (samma i båda teman): cirkel 76 och 48, och platta på kort.</Caption>
          <View style={styles.logoGrid}>
            {ALL_RETAILER_LOGO_FILES.map(({ name, Logo }) => (
              <View key={name} style={styles.logoCell}>
                <View style={[styles.logoPlate, styles.logoCircle76]}>
                  <Logo width={76 * logo.plateShare} height={(76 * logo.plateShare) / LOGO_ASPECT} />
                </View>
                <View style={[styles.logoPlate, styles.logoCircle48]}>
                  <Logo width={48 * logo.plateShare} height={(48 * logo.plateShare) / LOGO_ASPECT} />
                </View>
                <Text style={styles.caption}>{name}</Text>
              </View>
            ))}
          </View>
          <Caption>Samlingar (vita, över foto): på mörkt, på ljust foto, och på stort och litet kort.</Caption>
          <View style={styles.logoGrid}>
            {ALL_COLLECTION_LOGO_FILES.map(({ name, Logo }) => (
              <View key={name} style={styles.logoCell}>
                <ImageBackground source={PHOTOS[0].source} style={styles.logoPhoto}>
                  <Logo width={72} height={36} />
                </ImageBackground>
                <Text style={styles.caption}>{name}</Text>
              </View>
            ))}
          </View>
          {/* Alla sex samlingslogotyper på stort, litet och liggande kort (brief 51). */}
          {ALL_COLLECTION_LOGO_FILES.map(({ name, Logo }, i) => (
            <ScrollView key={name} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.logoGrid}>
              <EditorialCard
                variant="portraitLarge"
                title={name}
                subtitle="Av Kroona · 6 produkter"
                imageUrl={PRODUCTS[i % PRODUCTS.length].imageUrl}
                logo={Logo}
              />
              <EditorialCard
                variant="portraitSmall"
                title={name}
                subtitle="6 produkter"
                imageUrl={PRODUCTS[(i + 6) % PRODUCTS.length].imageUrl}
                logo={Logo}
              />
              <EditorialCard
                variant="landscape"
                title={name}
                subtitle="6 produkter"
                imageUrl={PRODUCTS[(i + 12) % PRODUCTS.length].imageUrl}
                logo={Logo}
              />
            </ScrollView>
          ))}
        </Section>

        <Section title="0 · Press (jämför)">
          <Caption>Håll in och släpp: in snabbt, ut med lätt fjäder. Ingen haptik på vanliga tryck.</Caption>
          <View style={styles.pressRow}>
            <IconButton tone="plain" icon={BookmarkIcon} accessibilityLabel="Press, ikonknapp" onPress={() => {}} />
            <Pill onPress={() => {}}>Pill</Pill>
            <View style={styles.pressCard}>
              <ProductCard {...P2} size="S" menu={false} />
            </View>
          </View>
          <TextTabs items={PRESS_TABS} selected={pressTab} onSelect={setPressTab} />
        </Section>

        <Section title="1 · IconButton (glas)">
          <Caption>Vald = fylld ikon. Tryck för att markera (pop + lätt haptik), tryck igen för att avmarkera.</Caption>
          <View style={styles.pressRow}>
            <IconButton
              tone="plain"
              icon={BookmarkIcon}
              selectedIcon={BookmarkIconFilled}
              accessibilityLabel="Spara"
              selected={demoSaved}
              onPress={() => setDemoSaved((v) => !v)}
            />
            <IconButton
              tone="plain"
              icon={HeartIcon}
              selectedIcon={HeartIconFilled}
              accessibilityLabel="Gilla"
              selected={demoLiked}
              onPress={() => setDemoLiked((v) => !v)}
            />
          </View>
          {PHOTOS.map((photo) => (
            <View key={photo.label} style={styles.photoBlock}>
              <Caption>Över {photo.label}</Caption>
              <ImageBackground source={photo.source} style={styles.photo}>
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
            </View>
          ))}
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
          {PHOTOS.map((photo) => (
            <View key={photo.label} style={styles.photoBlock}>
              <Caption>Glas över {photo.label}</Caption>
              <ImageBackground source={photo.source} style={styles.photo}>
                <StateRow
                  onPhoto
                  render={(s) => (
                    <Pill variant="glass" selected={'selected' in s} disabled={'disabled' in s} onPress={() => {}}>
                      Mode
                    </Pill>
                  )}
                />
              </ImageBackground>
            </View>
          ))}
        </Section>

        <Section title="3 · TextTabs" bleed>
          <Caption inset>Scrollar horisontellt · Inaktiv: Dekor</Caption>
          <TextTabs items={TABS} selected={tab} onSelect={setTab} disabledItems={['Dekor']} />
          <Caption inset>Byt flik: text och understrykning tonar, selection-haptik.</Caption>
        </Section>

        <Section title="4 · ProductCard">
          <Caption>
            Jämför S, M och L: tryck krymper ca 5–7 px på alla, långt tryck lyfter bilden större än
            originalet (L minst), och stängning går i ett steg tillbaka med märket kvar.
          </Caption>
          <Caption>Small · bara bild, radie tile</Caption>
          <View style={styles.row}>
            {[P1, P2, P3].map((p) => (
              <ProductCard key={p.id} {...p} size="S" />
            ))}
          </View>
          <Caption>
            Medium · håll in för menyn, dra till en rad och släpp (haptik: känn efter). Titta på stängningen: bilden ska glida tillbaka utan hopp eller dubbelbild · höger: inaktiv
          </Caption>
          <View style={styles.row}>
            <ProductCard {...P1} {...DEMO_RATING} />
            <ProductCard {...P2} {...DEMO_RATING} disabled />
          </View>
          <Caption>Large · tryck ca 0,985, lyft 1,02</Caption>
          <ProductCard {...P2} {...DEMO_RATING} size="L" featured aspectRatio={4 / 5} />
        </Section>

        <Section title="5 · TopBar" bleed>
          <Caption inset>Produktdetalj · tillbaka + spara, över ljust foto</Caption>
          <ImageBackground source={PHOTOS[0].source} style={styles.topBarPhoto}>
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

        <Section title="6 · Toppkant" bleed>
          <Caption inset>
            Scrolla så att foton och ren yta passerar under statusfältet och Dynamic Island. Växla
            med kontrollen längst ner.
          </Caption>
          {PHOTOS.map((photo) => (
            <Image key={photo.label} source={photo.source} style={styles.edgePhoto} />
          ))}
          <View style={styles.edgePlain} />
        </Section>

      </ScrollView>

      {/* Skärmens egen toppkant, bakom statusfält och Dynamic Island. Det är den som testas. */}
      <EdgeFade position="top" blur={fadeBlur} shape={fadeWave ? 'wave' : 'straight'} />
      <Stack.Screen options={{ scrollEdgeEffects: { top: nativeEdge ? 'automatic' : 'hidden' } }} />

      {/* Flytande kontroll för toppkanten. */}
      <View style={[styles.edgeControls, { bottom: insets.bottom + spacing.lg }]}>
        <Pill selected={fadeWave} onPress={() => setFadeWave((v) => !v)}>
          {fadeWave ? 'Vågig' : 'Rak'}
        </Pill>
        <Pill selected={fadeBlur} onPress={() => setFadeBlur((v) => !v)}>
          {fadeBlur ? 'Blur på' : 'Blur av'}
        </Pill>
        <Pill selected={nativeEdge} onPress={() => setNativeEdge((v) => !v)}>
          {nativeEdge ? 'iOS-kant på' : 'iOS-kant av'}
        </Pill>
      </View>
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
  // Provyta logotyper (brief 47). Lokala provmått, inte produktmått.
  logoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  logoCell: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  logoPlate: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.logoPlate,
    borderWidth: 1,
    borderColor: overlay.logoPlateEdge,
    borderRadius: radius.full,
  },
  logoCircle76: {
    width: 76,
    height: 76,
  },
  logoCircle48: {
    width: 48,
    height: 48,
  },
  logoPhoto: {
    width: 100,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  pressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  pressCard: {
    width: touchTarget * 2,
  },
  photoBlock: {
    gap: spacing.sm,
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
  detailLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  edgeControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  edgePhoto: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  // Ren bakgrund under toppkanten, minst en skärmhöjd att scrolla förbi.
  edgePlain: {
    height: spacing.xxxl * 10,
    backgroundColor: t.colors.bg,
  },
}));
