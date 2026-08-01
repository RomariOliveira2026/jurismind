# Arquitetura de IA — JurisMind Safe AI

## Visão geral

A IA do JurisMind opera como camada jurídica operacional, não como chat genérico.

```
Frontend (React)
  → safeAIClient.ts (sanitização, injection guard)
  → Supabase Edge Function `legal-ai`
  → AI Provider (mock | OpenAI configurável)
  → Saída estruturada validada
  → SafeAIResult + EvidenceMatrix + ValidationChecklist
  → Persistência (demo: localStorage | produção: tabelas ai_*)
```

## Princípios

- Nenhuma chave secreta no frontend
- Toda IA real passa pela Edge Function
- Prazos sugeridos nunca são salvos automaticamente como oficiais
- Toda resposta sensível exige revisão humana

## Camadas

| Camada | Localização |
|--------|-------------|
| Safety engines | `src/ai/safety/` |
| Assistentes | `src/ai/assistants/registry.ts` |
| Componentes UI | `src/components/ai/` |
| Cliente | `src/services/ai/safeAIClient.ts` |
| Edge Function | `supabase/functions/legal-ai/` |
| Banco | `supabase/migrations/003_ai_governance.sql` |

## Fluxo de requisição

1. Usuário envia texto/contexto em assistente específico
2. `safeAIClient` sanitiza e verifica injection
3. Edge Function valida auth e organization_id
4. Provider gera saída estruturada JSON
5. Schema validado antes de exibir
6. Usuário revisa via Safe AI
7. Ações (prazo, tarefa, salvar) exigem ValidationChecklist

## Limitações atuais

- Provider OpenAI preparado mas mock por padrão
- Extração PDF/DOCX não implementada com segurança
- Governança em produção depende da migration 003

## Próximos passos

- Integrar repositório Supabase `ai.ts` em produção
- Provider OpenAI completo na Edge Function
- Notificações internas automáticas pós-análise
