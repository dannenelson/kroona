// Dialog (brief 53): chatten som tidigare låg i Hitta-fliken, nu en egen
// stackskärm utan flikfält. Params: `query` (första frågan, skickas
// automatiskt) och `scope` (valfri avgränsning: kategori eller sökterm, visas
// som pill och läggs i systemprompten). Inget namn på AI:n visas i UI.
import { Component, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { makeStyles, useTheme, typography, fonts, spacing, radius, iconSize, touchTarget } from '../theme';

const SEND_HEIGHT = 40;
const INPUT_MAX_HEIGHT = 100;
import { PRODUCTS } from '../data/products';
import { Product } from '../types/product';
import { askClaude, ClaudeMessage } from '../lib/claudeProxy';
import { buildHittaSystemPrompt, SHOW_PRODUCTS_TOOL } from '../lib/kroonaSystemPrompt';
import ProductGrid from '../components/ProductGrid';
import TopBar from '../components/TopBar';
import Pill from '../components/Pill';
import Icon from '../components/Icon';

// Startförslag när konversationen är tom (brief 53).
const SCOPED_STARTERS = ['Till vardagsrummet', 'Liten yta', 'Under 3 000 kr', 'Jag vet inte än'];
const GENERAL_STARTERS = ['Bröllopspresent', 'Inreda ett litet kök', 'Något till en kollega'];

type ChatRole = 'user' | 'assistant' | 'error';

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  productIds?: string[];
}

const LOADING_ID = '__loading__';

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveProducts(ids: string[] | undefined): Product[] {
  if (!ids || ids.length === 0) return [];
  return ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

function toClaudeMessages(messages: ChatMessage[]): ClaudeMessage[] {
  return messages
    .filter((m): m is ChatMessage & { role: 'user' | 'assistant' } => m.role !== 'error')
    .map((m) => ({ role: m.role, content: m.text }));
}

// Fångar renderingsfel i ProductGrid (t.ex. om en uppslagen produkt saknar ett
// fält ProductCard förutsätter) så en trasig produktrendering inte tystnar
// hela chattskärmen utan synligt fel.
class ProductGridErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(error: unknown) {
    console.error('[Dialog] ProductGrid kastade vid render', error);
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('[Dialog] Rendering av ProductGrid kraschade', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ProductGridErrorText />;
    }
    return this.props.children;
  }
}

// Klasskomponenten ovan kan inte använda hooks, så felraden är en egen
// funktionskomponent som läser temat.
function ProductGridErrorText() {
  const styles = useStyles();
  return <Text style={styles.bubbleTextError}>Kunde inte visa produkterna.</Text>;
}

export default function DialogScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();
  const listRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams<{ query?: string; scope?: string }>();
  const scope = typeof params.scope === 'string' && params.scope.trim() ? params.scope.trim() : undefined;
  const autoSentQuery = useRef<string | null>(null);

  const systemPrompt = useMemo(() => buildHittaSystemPrompt(scope), [scope]);

  // resetConversation styr om det nya meddelandet läggs till på en
  // pågående dialog (vanliga skicka-knappen) eller startar om helt (en ny
  // fråga från Hem — "ny konversation", se useEffect nedan). Måste
  // beräknas HÄR, inte via en separat setMessages([]) innan anropet — annars
  // skulle nextMessages byggas på den gamla (icke uppdaterade) messages-
  // closure-variabeln eftersom React-statuppdateringar inte är synkrona.
  const sendMessage = async (text: string, resetConversation = false) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { id: genId(), role: 'user', text: trimmed };
    const baseMessages = resetConversation ? [] : messages;
    const nextMessages = [...baseMessages, userMessage];

    setMessages(nextMessages);
    setInputText('');
    setLoading(true);

    try {
      const result = await askClaude({
        messages: toClaudeMessages(nextMessages),
        system: systemPrompt,
        tools: [SHOW_PRODUCTS_TOOL],
      });

      let productIds: string[] = [];
      try {
        productIds = Array.isArray(result.productIds) ? result.productIds : [];
      } catch (err) {
        console.error('[Dialog] Kunde inte tolka productIds från svaret', err, result);
      }

      setMessages((prev) => [
        ...prev,
        { id: genId(), role: 'assistant', text: result.text, productIds },
      ]);
    } catch (err) {
      console.error('[Dialog] askClaude() misslyckades', err);
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          role: 'error',
          text: 'Kunde inte nå dialogen just nu. Kontrollera uppkopplingen och försök igen.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(inputText);

  // Första frågan (param `query`, från sökläget eller Sökresultat) skickas
  // automatiskt en gång när skärmen öppnas. Skärmen monteras på nytt för
  // varje dialog, så jämförelsen mot autoSentQuery räcker.
  useEffect(() => {
    const q = typeof params.query === 'string' ? params.query : undefined;
    if (q && q !== autoSentQuery.current) {
      autoSentQuery.current = q;
      sendMessage(q, true);
    }
  }, [params.query]);

  const starters = scope ? SCOPED_STARTERS : GENERAL_STARTERS;

  const data = loading ? [...messages, { id: LOADING_ID, role: 'assistant' as ChatRole, text: '' }] : messages;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopBar left={{ icon: 'back-arrow', accessibilityLabel: 'Tillbaka', onPress: () => router.back() }} />
      {scope ? (
        <View style={styles.scopeRow}>
          <Pill>{scope}</Pill>
        </View>
      ) : null}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (item.id === LOADING_ID) {
              return (
                <View style={[styles.bubble, styles.bubbleAssistant]}>
                  <ActivityIndicator color={colors.textSecondary} />
                </View>
              );
            }

            const products = resolveProducts(item.productIds);

            return (
              <View
                style={[
                  styles.messageRow,
                  item.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    item.role === 'user' && styles.bubbleUser,
                    item.role === 'assistant' && styles.bubbleAssistant,
                    item.role === 'error' && styles.bubbleError,
                  ]}
                >
                  <Text
                    style={[styles.bubbleText, item.role === 'error' && styles.bubbleTextError]}
                  >
                    {item.text}
                  </Text>
                </View>
                {products.length > 0 && (
                  <ProductGridErrorBoundary>
                    <ProductGrid products={products} compact />
                  </ProductGridErrorBoundary>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="stars" color={colors.textPrimary} size={iconSize.lg} />
              <Text style={styles.emptyTitle}>Vad letar du efter?</Text>
              <Text style={styles.emptyHint}>
                {scope
                  ? `Berätta mer, så hjälper jag dig välja inom ${scope}.`
                  : 'Berätta om kläder eller möbler du har i åtanke, så hjälper jag dig hitta rätt.'}
              </Text>
              <View style={styles.starters}>
                {starters.map((s) => (
                  <Pill key={s} onPress={() => sendMessage(s)}>
                    {s}
                  </Pill>
                ))}
              </View>
            </View>
          }
          contentContainerStyle={{
            paddingTop: spacing.sm,
            paddingHorizontal: spacing.screenMargin,
            paddingBottom: spacing.lg,
            flexGrow: 1,
            gap: spacing.lg,
          }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />

        <View style={[styles.inputRow, { paddingBottom: insets.bottom + spacing.sm }]}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Skriv eller prata"
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          {/* Skicka (brief 57): ikonen `send` i stället för texten "Skicka", samma inverterade yta. */}
          <TouchableOpacity
            style={[styles.sendButton, (loading || !inputText.trim()) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={loading || !inputText.trim()}
            accessibilityRole="button"
            accessibilityLabel="Skicka"
            hitSlop={(touchTarget - SEND_HEIGHT) / 2}
          >
            <Icon name="send" color={colors.bg} size={iconSize.lg} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  flex: {
    flex: 1,
  },
  scopeRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.sm,
  },
  starters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.body,
    color: t.colors.textPrimary,
    textAlign: 'center',
  },
  emptyHint: {
    ...typography.label,
    fontFamily: fonts.ui400, // regular som tidigare
    color: t.colors.textSecondary,
    textAlign: 'center',
  },
  messageRow: {
    maxWidth: '82%',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
  },
  messageRowAssistant: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: radius.card,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleUser: {
    backgroundColor: t.colors.surfaceRaised,
    borderColor: t.colors.border,
    borderBottomRightRadius: 4, // lokal: bubblans "svans"-hörn
  },
  bubbleAssistant: {
    backgroundColor: t.colors.surface,
    borderColor: t.colors.border,
    borderBottomLeftRadius: 4, // lokal: bubblans "svans"-hörn
  },
  bubbleError: {
    backgroundColor: t.colors.surface,
    borderColor: t.colors.warning,
    borderBottomLeftRadius: 4, // lokal: bubblans "svans"-hörn
  },
  bubbleText: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
  bubbleTextError: {
    color: t.colors.warning,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-end',
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    backgroundColor: t.colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.colors.border,
  },
  input: {
    flex: 1,
    ...typography.body,
    lineHeight: undefined, // TextInput: låt plattformen styra radhöjden
    color: t.colors.textPrimary,
    backgroundColor: t.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: INPUT_MAX_HEIGHT,
  },
  sendButton: {
    backgroundColor: t.colors.textPrimary, // vald/primär = inverterad (design.md §0)
    borderRadius: radius.card,
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
    width: SEND_HEIGHT,
    height: SEND_HEIGHT,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
}));
