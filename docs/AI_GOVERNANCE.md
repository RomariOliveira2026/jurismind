# Governança da IA

## Página

`/app/configuracoes/ia` — Governança da IA (8 abas)

## Tabelas

- `ai_governance_settings` — políticas por escritório
- `ai_validations` — aceites de checklist
- `ai_usage_logs` — consumo e custos
- `ai_feedback` — avaliações (incorreta/perigosa = prioridade alta)

## Checklist de validação

Antes de criar prazo, salvar rascunho ou vincular análise, o modal `ValidationChecklist` exige confirmação.

Registro em `ai_validations` com usuário, data e checklist.

## RLS

Todas as tabelas `ai_*` usam `organization_id IN (SELECT auth_user_org_ids())`.

Nenhum escritório acessa dados de IA de outro.

## Configuração

Administrador pode definir (após migration):

- Validação humana obrigatória
- Assistentes permitidos
- Retenção de dados
- Armazenar entradas/saídas
