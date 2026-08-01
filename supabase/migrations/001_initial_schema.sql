-- JurisMind — Schema inicial multi-tenant
-- Execute no SQL Editor do Supabase ou via CLI

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Perfis (vinculados ao auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  oab_number TEXT,
  oab_state TEXT,
  role TEXT NOT NULL DEFAULT 'advogado' CHECK (role IN ('admin', 'advogado', 'assistente', 'leitura')),
  job_title TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Escritórios
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  document TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  plan TEXT NOT NULL DEFAULT 'gratuito' CHECK (plan IN ('gratuito', 'profissional', 'escritorio')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Membros do escritório
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'advogado', 'assistente', 'leitura')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Configurações
CREATE TABLE organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  deadline_alert_days INT NOT NULL DEFAULT 3,
  email_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  whatsapp_alerts BOOLEAN NOT NULL DEFAULT FALSE,
  daily_summary BOOLEAN NOT NULL DEFAULT TRUE,
  weekly_summary BOOLEAN NOT NULL DEFAULT TRUE
);

-- Clientes
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pf', 'pj')),
  cpf_cnpj TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'arquivado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Processos
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  case_number TEXT NOT NULL,
  title TEXT NOT NULL,
  court TEXT,
  jurisdiction TEXT,
  district TEXT,
  practice_area TEXT,
  case_type TEXT,
  opposing_party TEXT,
  responsible_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'ativo',
  phase TEXT NOT NULL DEFAULT 'inicial',
  estimated_value NUMERIC(15,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prazos
CREATE TABLE deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  deadline_date DATE NOT NULL,
  internal_date DATE,
  priority TEXT NOT NULL DEFAULT 'media',
  status TEXT NOT NULL DEFAULT 'pendente',
  responsible_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  ai_suggested BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Publicações
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  publication_date DATE,
  source TEXT,
  court TEXT,
  raw_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'aguardando',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Análises de publicação
CREATE TABLE publication_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  summary TEXT,
  detected_parties TEXT,
  suggested_deadline TEXT,
  suggested_action TEXT,
  risk_level TEXT,
  confidence NUMERIC(5,2),
  warnings JSONB DEFAULT '[]',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tarefas
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'media',
  status TEXT NOT NULL DEFAULT 'pendente',
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documentos
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notificações
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  reference_type TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Logs de atividade
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_clients_org ON clients(organization_id);
CREATE INDEX idx_cases_org ON cases(organization_id);
CREATE INDEX idx_cases_client ON cases(client_id);
CREATE INDEX idx_deadlines_org ON deadlines(organization_id);
CREATE INDEX idx_deadlines_date ON deadlines(deadline_date);
CREATE INDEX idx_deadlines_status ON deadlines(status);
CREATE INDEX idx_publications_org ON publications(organization_id);
CREATE INDEX idx_tasks_org ON tasks(organization_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_activity_org ON activity_logs(organization_id);

-- Função auxiliar: organization_id do usuário atual
CREATE OR REPLACE FUNCTION auth_user_org_ids()
RETURNS SETOF UUID AS $$
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies (usuário só acessa dados do seu escritório)
CREATE POLICY profiles_self ON profiles FOR ALL USING (id = auth.uid());
CREATE POLICY org_member ON organizations FOR SELECT USING (id IN (SELECT auth_user_org_ids()));
CREATE POLICY org_members_policy ON organization_members FOR SELECT USING (organization_id IN (SELECT auth_user_org_ids()));

CREATE POLICY clients_policy ON clients FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY cases_policy ON cases FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY deadlines_policy ON deadlines FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY publications_policy ON publications FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY tasks_policy ON tasks FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY documents_policy ON documents FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY notifications_policy ON notifications FOR ALL USING (user_id = auth.uid());
CREATE POLICY activity_policy ON activity_logs FOR SELECT USING (organization_id IN (SELECT auth_user_org_ids()));

-- Storage bucket (executar separadamente no dashboard ou via API)
-- Bucket: documents — políticas por organization_id no path
