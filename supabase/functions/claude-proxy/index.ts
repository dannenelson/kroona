// supabase/functions/claude-proxy/index.ts
//
// Dum proxy mellan Kroona-appen och Anthropics API. Enda syftet är att
// gömma ANTHROPIC_API_KEY server-side — ingen datalagring, ingen databas,
// ingen kännedom om rådgivande/matchningsläge (det avgörs av klienten via
// vilket 'system'-värde den skickar). Se spec v1.5 avsnitt 3.
//
// Deploy:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//   supabase functions deploy claude-proxy
//
// JWT-verifiering lämnas PÅ (Supabase default) — endast anrop med giltig
// Supabase anon-key eller session-token släpps igenom. Det är den enda
// skyddsnivån just nu; se anteckning om missbruksskydd längst ned i chatten.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MODEL = "claude-sonnet-5";
const DEFAULT_MAX_TOKENS = 1024;

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface ProxyRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  system?: string;
  model?: string;
  max_tokens?: number;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Only POST is supported" }, 405);
  }

  if (!ANTHROPIC_API_KEY) {
    // Loggas server-side i Supabase, läcker inte till klienten.
    console.error("ANTHROPIC_API_KEY saknas i function secrets");
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  let body: ProxyRequestBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonResponse({ error: "'messages' must be a non-empty array" }, 400);
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: body.model ?? DEFAULT_MODEL,
        max_tokens: body.max_tokens ?? DEFAULT_MAX_TOKENS,
        system: body.system,
        messages: body.messages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      // Vidarebefordra Anthropics felstatus, men logga detaljerna server-side
      // istället för att exponera dem rått till klienten.
      console.error("Anthropic API error", anthropicRes.status, data);
      return jsonResponse({ error: "Upstream error from Claude API" }, anthropicRes.status);
    }

    return jsonResponse(data, 200);
  } catch (err) {
    console.error("Proxy fetch failed", err);
    return jsonResponse({ error: "Failed to reach Claude API" }, 502);
  }
});
