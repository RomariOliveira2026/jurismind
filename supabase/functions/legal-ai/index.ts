import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const MAX_INPUT = Number(Deno.env.get("AI_MAX_INPUT_LENGTH") || "50000")
const RATE_LIMIT = Number(Deno.env.get("AI_RATE_LIMIT_PER_MINUTE") || "120")
const PROTECTION_ENABLED = Deno.env.get("AI_PROTECTION_ENABLED") === "true"
const MAX_CONCURRENT = Number(Deno.env.get("AI_MAX_CONCURRENT") || "5")

const FAIR_USE_PROTECTION_MESSAGE =
  "Identificamos um volume de utilização acima do padrão neste momento. Para preservar a estabilidade e segurança do serviço, algumas solicitações podem ser temporariamente limitadas. Tente novamente em alguns instantes."

interface RequestBody {
  assistantSlug: string
  actionType: string
  contextType: string
  contextId?: string
  inputText: string
  sources?: string[]
}

function mockStructuredOutput(text: string) {
  const procMatch = text.match(/\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/)
  return {
    summary: "Análise assistida processada pelo servidor seguro.",
    documentType: "publicacao",
    processNumber: procMatch?.[0] || null,
    court: null,
    parties: [],
    facts: ["Determinação identificada no texto analisado"],
    interpretations: ["Possível intimação para manifestação"],
    suggestedActions: ["Conferir termo inicial", "Elaborar rascunho de manifestação"],
    possibleDeadline: {
      value: null,
      unit: null,
      type: null,
      startingPoint: null,
      warnings: ["Confirmar prazo manualmente — não salvar automaticamente"],
    },
    evidence: [
      {
        claim: "Trecho analisado contém determinação processual",
        sourceType: "publicacao",
        sourceExcerpt: text.slice(0, 120),
        evidenceType: "fato",
        confidenceScore: 65,
        reviewStatus: "nao_revisado",
      },
    ],
    uncertainties: procMatch ? [] : ["Número do processo não identificado"],
    confidenceScore: procMatch ? 72 : 45,
    riskLevel: "medio",
    warnings: ["Revisão humana obrigatória antes de qualquer ação oficial"],
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Sessão inválida" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const body: RequestBody = await req.json()
    const inputText = (body.inputText || "").slice(0, MAX_INPUT)

    if (!inputText.trim()) {
      return new Response(JSON.stringify({ error: "Texto vazio" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single()

    const organizationId = profile?.organization_id as string | undefined

    if (PROTECTION_ENABLED && organizationId) {
      const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString()
      const { count } = await supabase
        .from("ai_usage_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", oneMinuteAgo)

      if ((count ?? 0) >= RATE_LIMIT) {
        return new Response(
          JSON.stringify({ error: FAIR_USE_PROTECTION_MESSAGE, status: "rate_limited" }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        )
      }
    }

    const provider = Deno.env.get("AI_PROVIDER") || "mock"
    const model = Deno.env.get("AI_MODEL") || "mock-legal-v1"
    const start = Date.now()

    let structuredOutput = mockStructuredOutput(inputText)

    if (provider === "openai" && Deno.env.get("OPENAI_API_KEY")) {
      // Placeholder: integração real via fetch à API OpenAI
      structuredOutput = mockStructuredOutput(inputText)
      structuredOutput.warnings.push("Provider OpenAI configurado — integração completa em evolução.")
    }

    const durationMs = Date.now() - start

    if (organizationId) {
      await supabase.from("ai_usage_logs").insert({
        organization_id: organizationId,
        user_id: user.id,
        provider,
        model,
        estimated_input_tokens: Math.ceil(inputText.length / 4),
        estimated_output_tokens: Math.ceil(JSON.stringify(structuredOutput).length / 4),
        duration_ms: durationMs,
        status: "success",
      })
    }

    return new Response(
      JSON.stringify({
        structuredOutput,
        provider,
        model,
        promptVersion: "1.0.0",
        durationMs,
        rateLimitPerMinute: RATE_LIMIT,
        protectionEnabled: PROTECTION_ENABLED,
        maxConcurrent: MAX_CONCURRENT,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
})
