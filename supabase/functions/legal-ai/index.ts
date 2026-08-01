import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const MAX_INPUT = Number(Deno.env.get("AI_MAX_INPUT_LENGTH") || "50000")
const RATE_LIMIT = Number(Deno.env.get("AI_RATE_LIMIT_PER_MINUTE") || "20")

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

    return new Response(
      JSON.stringify({
        structuredOutput,
        provider,
        model,
        promptVersion: "1.0.0",
        durationMs,
        rateLimitPerMinute: RATE_LIMIT,
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
