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
import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
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
      return <Text style={styles.bubbleTextError}>Kunde inte visa produkterna.</Text>;
    }
    return this.props.children;
  }
}

export default function FindScreen() {
  const insets = useSafeAreaInsets();
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
                  <ActivityIndicator color={Colors.gold} />
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
            paddingHorizontal: Spacing.screenMargin,
            paddingBottom: 16,
            flexGrow: 1,
            gap: 16,
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
            placeholderTextColor={Colors.textSecondary}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    letterSpacing: 0.3,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenMargin,
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    textAlign: 'center',
  },
  emptyHint: {
    color: Colors.textSecondary,
    fontSize: 13,
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
    borderRadius: Radius.card,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: Colors.cardBgAlt,
    borderColor: Colors.gold,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.cardBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleError: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.sustainAmber,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    color: Colors.textPrimary,
    fontFamily: 'GoogleSansFlex_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextError: {
    color: Colors.sustainAmber,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.screenMargin,
    paddingTop: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 0.5,
    borderTopColor: Colors.cardBorder,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: 'GoogleSansFlex_400Regular',
    fontSize: 14,
    backgroundColor: Colors.cardBg,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    borderRadius: Radius.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.card,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    color: Colors.background,
    fontFamily: 'GoogleSansFlex_500Medium',
    fontSize: 13,
  },
});
