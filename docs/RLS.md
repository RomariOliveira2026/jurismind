# Row Level Security — JurisMind

Este documento descreve as políticas RLS aplicadas no Supabase para isolamento multi-tenant por `organization_id`.

## Princípio

Todo acesso a dados de negócio exige que o usuário autenticado (`auth.uid()`) pertença ao escritório (`organization_members`) correspondente. Nenhum escritório pode ler, alterar ou excluir dados de outro.

## Funções auxiliares

| Função | Descrição |
|--------|-----------|
| `auth_user_org_ids()` | Retorna os `organization_id` do usuário logado |
| `auth_user_is_org_admin(org_id)` | Verifica se o usuário é administrador do escritório |

## Tabelas e políticas

### `profiles`
- **SELECT**: próprio perfil ou colegas do mesmo escritório
- **INSERT/UPDATE**: apenas o próprio usuário (`id = auth.uid()`)

### `organizations`
- **SELECT**: escritórios onde o usuário é membro
- **INSERT**: usuário autenticado (cadastro inicial)
- **UPDATE**: apenas administradores do escritório

### `organization_members`
- **SELECT**: membros do mesmo escritório
- **INSERT**: próprio usuário no cadastro ou admin convidando
- **UPDATE/DELETE**: apenas administradores

### `organization_settings`
- **SELECT/UPDATE**: membros do escritório
- **INSERT**: primeiro cadastro ou membro do escritório

### Dados operacionais (`clients`, `cases`, `deadlines`, `publications`, `tasks`, `documents`)
Para cada tabela:
- **SELECT**: `organization_id IN auth_user_org_ids()`
- **INSERT**: `organization_id` deve pertencer ao usuário
- **UPDATE**: mesma regra de SELECT
- **DELETE**: mesma regra de SELECT

### `publication_analyses`
Acesso indireto via `publication_id` vinculado a publicações do escritório.

### `notifications`
- **SELECT/UPDATE/DELETE**: `user_id = auth.uid()`
- **INSERT**: destinatário é o usuário e `organization_id` do escritório

### `activity_logs`
- **SELECT**: logs do escritório
- **INSERT**: usuário autenticado no escritório

## Storage (`documents`)

Arquivos armazenados em `documents/{organization_id}/...`.

- Upload, download e exclusão restritos ao prefixo do `organization_id` do usuário
- Tipos permitidos: PDF, DOC, DOCX, JPG, PNG (máx. 10 MB)

## Migrations

1. `001_initial_schema.sql` — schema e RLS básico
2. `002_signup_rls_storage.sql` — políticas granulares e bucket de storage

## Cadastro automático

No frontend, após `signUp` com sessão ativa:
1. Cria `organizations`
2. Cria/atualiza `profiles` (role `admin`)
3. Cria `organization_members`
4. Cria `organization_settings`

Em caso de falha, o rollback remove a organização criada e exibe erro amigável.

## Modo demonstração

Quando `VITE_DEMO_MODE=true` ou variáveis Supabase ausentes, os dados permanecem em `localStorage` e **não** passam pelo banco.
