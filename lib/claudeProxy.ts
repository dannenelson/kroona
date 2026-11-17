// lib/claudeProxy.ts
//
// OBS (aug 2026): Anropar Anthropics API DIREKT från klienten — ingen proxy,
// ingen Supabase. Medvetet, TILLFÄLLIGT beslut för Fas 0 (kontrollerade
// demos som bara grundaren visar upp), inte en långsiktig lösning.
//
// Nyckeln (EXPO_PUBLIC_ANTHROPIC_API_KEY) är läsbar av vem som helst som
// packar upp appen. SÄKRA UPP DETTA (t.ex. via en backend-proxy) INNAN
// appen någonsin distribueras till fler än grundaren — TestFlight, App
// Store, eller en publik APK-länk. Se status-roadmap avsnitt 12.

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY as string;
const ANTHROPIC_VERSION = '2023-06-01';
const DEFAULT_MODEL = 'claude-sonnet-5';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AskClaudeOptions {
  messages: ClaudeMessage[];
  system: string;
  maxTokens?: number;
  /** Verktygsdefinitioner, t.ex. SHOW_PRODUCTS_TOOL från kroonaSystemPrompt.ts */
  tools?: unknown[];
}

export interface AskClaudeResult {
  /** Modellens löptext, tom sträng om den bara anropade ett verktyg. */
  text: string;
  /** Produkt-id:n om modellen anropade show_products, annars tom array. */
  productIds: string[];
  raw: unknown;
}

/**
 * Skickar en kumulativ dialog direkt till Anthropics API. Klienten äger hela
 * konversationshistoriken (messages) och skickar den i sin helhet varje
 * anrop — API:t är statslöst.
 *
 * Kastar ett Error vid nätverksfel eller icke-2xx-svar; anroparen (Hitta-
 * skärmen) ansvarar för att visa ett vänligt felmeddelande i UI:t.
 */
export async function askClaude({
  messages,
  system,
  maxTokens = 1024,
  tools,
}: AskClaudeOptions): Promise<AskClaudeResult> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Saknar EXPO_PUBLIC_ANTHROPIC_API_KEY — kolla .env');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': ANTHROPIC_VERSION,
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: maxTokens,
      system,
      messages,
      ...(tools ? { tools } : {}),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Claude API-fel (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const content: Array<Record<string, unknown>> = Array.isArray(data?.content) ? data.content : [];

  const textBlock = content.find((b) => b.type === 'text') as { text?: string } | undefined;
  const toolBlock = content.find((b) => b.type === 'tool_use' && b.name === 'show_products') as
    | { input?: { productIds?: unknown } }
    | undefined;

  const text = textBlock?.text ?? '';
  const productIds = Array.isArray(toolBlock?.input?.productIds)
    ? (toolBlock!.input!.productIds as string[])
    : [];

  if (!text && productIds.length === 0) {
    throw new Error('Oväntat svarsformat från Claude API');
  }

  return { text, productIds, raw: data };
}
