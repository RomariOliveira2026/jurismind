-- JurisMind — Sprint 4: IA, governança e rastreabilidade
-- Migration não destrutiva — adiciona tabelas ai_*

-- Assistentes
CREATE TABLE ai_assistants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'preparado', 'em_breve', 'inativo')),
  system_managed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);

CREATE TABLE ai_assistant_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id UUID NOT NULL REFERENCES ai_assistants(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  instructions TEXT,
  output_schema JSONB,
  safety_rules JSONB,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Governança
CREATE TABLE ai_governance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  require_human_validation BOOLEAN NOT NULL DEFAULT TRUE,
  allow_document_drafting BOOLEAN NOT NULL DEFAULT TRUE,
  allow_deadline_suggestions BOOLEAN NOT NULL DEFAULT TRUE,
  allowed_assistants JSONB DEFAULT '[]',
  allowed_context_types JSONB DEFAULT '[]',
  data_retention_days INT NOT NULL DEFAULT 90,
  store_ai_inputs BOOLEAN NOT NULL DEFAULT TRUE,
  store_ai_outputs BOOLEAN NOT NULL DEFAULT TRUE,
  validation_checklist JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Requisições e respostas
CREATE TABLE ai_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assistant_id UUID REFERENCES ai_assistants(id) ON DELETE SET NULL,
  context_type TEXT NOT NULL,
  context_id UUID,
  action_type TEXT NOT NULL,
  input_text TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES ai_requests(id) ON DELETE CASCADE,
  provider TEXT,
  model TEXT,
  prompt_version TEXT,
  response_text TEXT,
  structured_output JSONB,
  confidence_score INT,
  risk_level TEXT,
  warnings JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  response_id UUID NOT NULL REFERENCES ai_responses(id) ON DELETE CASCADE,
  claim TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id UUID,
  source_excerpt TEXT,
  evidence_type TEXT NOT NULL,
  confidence_score INT,
  review_status TEXT NOT NULL DEFAULT 'nao_revisado',
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  response_id UUID NOT NULL REFERENCES ai_responses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  validation_type TEXT NOT NULL,
  checklist JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'aprovado',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assistant_id UUID REFERENCES ai_assistants(id) ON DELETE SET NULL,
  provider TEXT,
  model TEXT,
  estimated_input_tokens INT,
  estimated_output_tokens INT,
  estimated_cost NUMERIC(10,6),
  duration_ms INT,
  status TEXT NOT NULL DEFAULT 'success',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  response_id UUID NOT NULL REFERENCES ai_responses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT,
  feedback_type TEXT NOT NULL,
  comments TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_ai_requests_org ON ai_requests(organization_id);
CREATE INDEX idx_ai_requests_user ON ai_requests(user_id);
CREATE INDEX idx_ai_responses_org ON ai_responses(organization_id);
CREATE INDEX idx_ai_responses_request ON ai_responses(request_id);
CREATE INDEX idx_ai_evidence_response ON ai_evidence(response_id);
CREATE INDEX idx_ai_validations_response ON ai_validations(response_id);
CREATE INDEX idx_ai_usage_org ON ai_usage_logs(organization_id);
CREATE INDEX idx_ai_feedback_response ON ai_feedback(response_id);

-- RLS
ALTER TABLE ai_assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_assistant_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_governance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY ai_assistants_policy ON ai_assistants FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY ai_assistant_versions_policy ON ai_assistant_versions FOR ALL USING (
  assistant_id IN (SELECT id FROM ai_assistants WHERE organization_id IN (SELECT auth_user_org_ids()))
);
CREATE POLICY ai_governance_policy ON ai_governance_settings FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY ai_requests_policy ON ai_requests FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY ai_responses_policy ON ai_responses FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY ai_evidence_policy ON ai_evidence FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY ai_validations_policy ON ai_validations FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY ai_usage_policy ON ai_usage_logs FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY ai_feedback_policy ON ai_feedback FOR ALL USING (organization_id IN (SELECT auth_user_org_ids()));
