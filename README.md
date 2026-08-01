# JurisMind

**O App de Inteligência Jurídica que Nunca Esquece**

Plataforma SaaS jurídica para advogados e escritórios organizarem clientes, processos, prazos, publicações e análises com IA.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19, Vite 8, TypeScript, Tailwind v4 |
| Roteamento | React Router v7 |
| Estado servidor | TanStack React Query |
| Backend | Supabase (PostgreSQL, Auth, RLS, Storage) |
| Deploy | Vercel |

## Instalação

```bash
npm install
npm run dev      # http://localhost:5180
npm run build
npm run lint
npm run test
```

## Variáveis de ambiente

Copie `.env.example` para `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
VITE_DEMO_MODE=false
```

| Variável | Descrição |
|----------|-----------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anon (nunca use service role no frontend) |
| `VITE_DEMO_MODE` | `true` força modo demonstração mesmo com Supabase configurado |

**Sem** `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, o modo demonstração é ativado automaticamente.

## Modo demonstração

- **E-mail:** `demo@jurismind.com.br` / **Senha:** `demo123`
- Ou clique em **Ver demonstração** na tela de login
- Dados em `localStorage` (`jurismind-demo-store`)
- **Nunca** mistura com dados de produção

## Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute as migrations no SQL Editor (ordem):
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_signup_rls_storage.sql`
   - `supabase/migrations/003_ai_governance.sql`
3. Deploy da Edge Function `legal-ai` (ver `docs/AI_EDGE_FUNCTION.md`)
4. Em **Authentication → Providers**, habilite E-mail/Senha
4. Configure **Site URL** e redirect: `https://seu-dominio/redefinir-senha`
5. Preencha `.env` com URL e anon key

Documentação RLS: [`docs/RLS.md`](docs/RLS.md)

## Arquitetura

```
src/
├── components/       # UI, layout, auth, notificações, error boundary
├── config/env.ts     # Detecção demo vs produção
├── context/          # Auth, Theme, Toast, React Query
├── hooks/            # useDashboard (React Query)
├── lib/
│   ├── supabase.ts   # Cliente, conexão, tratamento de erros
│   ├── permissions.ts
│   └── helpers.ts
├── pages/            # Landing, auth, app/*
├── services/
│   ├── ai/           # AIProvider (mock, pronto para Edge Functions)
│   ├── supabase/     # Repositórios PostgreSQL
│   ├── demo/         # Store localStorage
│   └── *Service.ts   # Camada unificada (demo | produção)
└── types/            # auth, entities, database
```

### Fluxo de autenticação

1. **Login** → `supabase.auth.signInWithPassword` → `buildAuthSession`
2. **Cadastro** → `signUp` → `provisionOrganization` (org + profile + member + settings)
3. **Sessão** → `onAuthStateChange` + refresh token automático
4. **Logout** → activity log + `signOut`
5. **Recuperar senha** → e-mail com link para `/redefinir-senha`

### Camada de serviços

Cada `*Service.ts` verifica `env.demoMode`:
- **Demo:** `demoStore` (localStorage)
- **Produção:** repositórios em `services/supabase/`

## Banco de dados

Tabelas multi-tenant por `organization_id`:

`profiles`, `organizations`, `organization_members`, `organization_settings`, `clients`, `cases`, `deadlines`, `publications`, `publication_analyses`, `tasks`, `documents`, `notifications`, `activity_logs`

Row Level Security impede acesso entre escritórios.

## Funcionalidades

| Módulo | Produção |
|--------|----------|
| Auth | Login, cadastro, logout, recuperar/alterar senha |
| Clientes | CRUD, arquivar, busca, filtros |
| Processos | CRUD, arquivar, detalhes |
| Prazos | CRUD, concluir, reabrir, dashboard |
| Publicações | CRUD, análise IA (mock) |
| Agenda | Prazos + tarefas do banco |
| Dashboard | Contagens reais (COUNT) |
| Notificações | Persistidas no banco |
| Documentos | Supabase Storage |
| Activity Log | Login, CRUD, upload |
| IA | JurisMind Safe AI — assistentes contextuais, Edge Function, governança |
| Assistentes | `/app/assistentes` — 8 assistentes especializados |
| Governança IA | `/app/configuracoes/ia` — políticas, validação, uso |
| Diagnóstico IA | `/app/diagnostico-ia` — maturidade orientativa |

Documentação IA: `docs/AI_ARCHITECTURE.md`, `docs/SAFE_AI.md`, `docs/AI_GOVERNANCE.md`

## Próxima sprint recomendada

1. Provider OpenAI completo na Edge Function
2. Repositório Supabase para tabelas `ai_*` em produção
3. Convite de membros da equipe
3. Stripe / Mercado Pago
4. Alertas por e-mail
5. Paginação server-side nos listagens
6. Testes E2E

## Licença

Projeto privado — Grupo O Especialista / CONTENTFY
