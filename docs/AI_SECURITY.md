# Segurança da IA

## Frontend

- Sem chaves `VITE_*` para secrets
- `promptInjectionGuard.ts` — detecção básica de injection
- `stripDangerousHtml` — remoção de HTML perigoso
- Limite de entrada: 50.000 caracteres

## Edge Function

- Auth obrigatória
- Isolamento por tenant via RLS
- Provider e chaves apenas no backend

## Padrões bloqueados

- "ignore previous instructions"
- Tentativas de extrair system prompt
- Scripts e javascript:
- Conteúdo excessivamente malformado

## Ações sensíveis

Exigem `ValidationChecklist` antes de:

- Criar prazo
- Criar tarefa
- Salvar rascunho
- Vincular análise
- Exportar/copiar conteúdo extenso

## Logs

Não expor conteúdo sensível no console do navegador.

## Demo vs produção

Modo demo isolado em `jurismind-ai-store` (localStorage).
