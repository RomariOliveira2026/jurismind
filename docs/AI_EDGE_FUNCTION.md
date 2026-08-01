# Edge Function — legal-ai

## Localização

`supabase/functions/legal-ai/index.ts`

## Deploy

```bash
supabase functions deploy legal-ai
supabase secrets set AI_PROVIDER=mock OPENAI_API_KEY=... AI_MODEL=gpt-4o-mini
```

## Variáveis (backend apenas)

| Variável | Descrição |
|----------|-----------|
| `AI_PROVIDER` | `mock` ou `openai` |
| `OPENAI_API_KEY` | Chave OpenAI (nunca no frontend) |
| `AI_MODEL` | Modelo a utilizar |
| `AI_MAX_INPUT_LENGTH` | Limite de caracteres (default 50000) |
| `AI_RATE_LIMIT_PER_MINUTE` | Rate limit preparado (default 20) |

## Fluxo

1. Valida JWT do usuário
2. Sanitiza entrada
3. Chama provider
4. Retorna `structuredOutput` validável
5. Frontend persiste via `safeAIClient` (demo) ou tabelas `ai_*` (produção)

## Invocação

```typescript
supabase.functions.invoke('legal-ai', {
  body: { assistantSlug, actionType, contextType, inputText, sources }
})
```
