# Assistentes Jurídicos

## Central

Rota: `/app/assistentes`

## Assistentes

| Assistente | Status | Rota |
|------------|--------|------|
| Publicações | Ativo | `/app/assistentes/publicacoes` |
| Processos | Ativo (aba IA do processo) | Modo Foco → IA |
| Documentos | Preparado | `/app/assistentes/documentos` |
| Contratos | Preparado | `/app/assistentes/contratos` |
| Audiências | Preparado | `/app/assistentes/audiencias` |
| Providências | Ativo | `/app/ia` |
| Rascunhos | Ativo | `/app/assistentes/rascunhos` |
| Gestão Jurídica | Preparado | Intelligence Center |

## Registry

Definições em `src/ai/assistants/registry.ts`:

- Instruções e schema por assistente
- Contextos permitidos
- Nível de risco
- Ações permitidas
- Versão (ex: v1.0.0)

## Assistente de Publicações (completo)

Fluxo: colar publicação → Safe AI → revisar → criar possível prazo (com validação) → salvar análise

Nunca salva prazo automaticamente.
