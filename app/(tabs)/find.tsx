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
import { makeStyles, useTheme, typography, fonts, spacing, radius } from '../../theme';

const SEND_HEIGHT = 40;
const INPUT_MAX_HEIGHT = 100;
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types/product';
import { askClaude, ClaudeMessage } from '../../lib/claudeProxy';
import { buildHittaSystemPrompt, SHOW_PRODUCTS_TOOL } from '../../lib/kroonaSystemPrompt';
import ProductGrid from '../../components/ProductGrid';
import { TAB_BAR_HEIGHT } from '../../components/CustomTabBar';

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
    console.error('[Hitta] ProductGrid kastade vid render', error);
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('[Hitta] Rendering av ProductGrid kraschade', error, info);
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

export default function FindScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();
  const listRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams<{ query?: string }>();
  const autoSentQuery = useRef<string | null>(null);

  const systemPrompt = useMemo(() => buildHittaSystemPrompt(), []);

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
      console.log('[Hitta] askClaude() svar', result);

      let productIds: string[] = [];
      try {
        productIds = Array.isArray(result.productIds) ? result.productIds : [];
      } catch (err) {
        console.error('[Hitta] Kunde inte tolka productIds från svaret', err, result);
      }

      try {
        const resolved = resolveProducts(productIds);
        console.log('[Hitta] Uppslagna produkter mot PRODUCTS', {
          productIds,
          resolvedCount: resolved.length,
          resolvedIds: resolved.map((p) => p.id),
        });
      } catch (err) {
        console.error('[Hitta] Kunde inte slå upp produkter mot PRODUCTS', err, productIds);
      }

      setMessages((prev) => [
        ...prev,
        { id: genId(), role: 'assistant', text: result.text, productIds },
      ]);
    } catch (err) {
      console.error('[Hitta] askClaude() misslyckades', err);
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          role: 'error',
          text: 'Kunde inte nå Kroonas AI-guide just nu. Kontrollera din uppkoppling och försök igen.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(inputText);

  // Tar emot en initial fråga från t.ex. AskBar på Hem (router-param
  // `query`) och skickar den automatiskt som första meddelandet i en ny
  // konversation. Flik-skärmar avmonteras normalt inte vid flikbyte i
  // Expo Router, så en enkel engångs-boolean hade bara fungerat för det
  // allra första besöket — jämförelsen mot autoSentQuery.current låter en
  // andra fråga från Hem (medan Hitta redan är monterad i bakgrunden)
  // triggas på nytt. router.setParams städar bort parametern efter att den
  // konsumerats så den inte kan trigga om.
  useEffect(() => {
    const q = typeof params.query === 'string' ? params.query : undefined;
    if (q && q !== autoSentQuery.current) {
      autoSentQuery.current = q;
      sendMessage(q, true);
      router.setParams({ query: undefined });
    }
  }, [params.query]);

  const data = loading ? [...messages, { id: LOADING_ID, role: 'assistant' as ChatRole, text: '' }] : messages;

  return (
    <View style={styles.container}>
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
          ListHeaderComponent={<Text style={styles.title}>Hitta</Text>}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Vad letar du efter?</Text>
              <Text style={styles.emptyHint}>
                Berätta om kläder eller möbler du har i åtanke, så hjälper Kroonas AI-guide dig
                hitta rätt.
              </Text>
            </View>
          }
          contentContainerStyle={{
            paddingTop: insets.top,
            paddingHorizontal: spacing.screenMargin,
            paddingBottom: spacing.lg,
            flexGrow: 1,
            gap: spacing.lg,
          }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />

        <View style={[styles.inputRow, { paddingBottom: insets.bottom + TAB_BAR_HEIGHT }]}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Skriv ett meddelande..."
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, (loading || !inputText.trim()) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={loading || !inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Skicka</Text>
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
  title: {
    ...typography.headline,
    color: t.colors.textPrimary,
    letterSpacing: 0.3, // lokal optisk spärrning
    paddingVertical: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxxl + spacing.xxl,
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
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    height: SEND_HEIGHT,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    ...typography.label,
    color: t.colors.bg,
  },
}));
