-- JurisMind — RLS completo, storage e políticas de signup
-- Execute após 001_initial_schema.sql

-- Remover políticas genéricas da migration 001
DROP POLICY IF EXISTS profiles_self ON profiles;
DROP POLICY IF EXISTS org_member ON organizations;
DROP POLICY IF EXISTS org_members_policy ON organization_members;
DROP POLICY IF EXISTS clients_policy ON clients;
DROP POLICY IF EXISTS cases_policy ON cases;
DROP POLICY IF EXISTS deadlines_policy ON deadlines;
DROP POLICY IF EXISTS publications_policy ON publications;
DROP POLICY IF EXISTS tasks_policy ON tasks;
DROP POLICY IF EXISTS documents_policy ON documents;
DROP POLICY IF EXISTS notifications_policy ON notifications;
DROP POLICY IF EXISTS activity_policy ON activity_logs;

-- Função: usuário é admin do escritório
CREATE OR REPLACE FUNCTION auth_user_is_org_admin(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
      AND user_id = auth.uid()
      AND role = 'admin'
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES
CREATE POLICY profiles_select ON profiles FOR SELECT USING (id = auth.uid() OR id IN (
  SELECT om.user_id FROM organization_members om
  WHERE om.organization_id IN (SELECT auth_user_org_ids())
));
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ORGANIZATIONS
CREATE POLICY organizations_select ON organizations FOR SELECT
  USING (id IN (SELECT auth_user_org_ids()));
CREATE POLICY organizations_insert ON organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY organizations_update ON organizations FOR UPDATE
  USING (auth_user_is_org_admin(id)) WITH CHECK (auth_user_is_org_admin(id));

-- ORGANIZATION MEMBERS
CREATE POLICY org_members_select ON organization_members FOR SELECT
  USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY org_members_insert ON organization_members FOR INSERT
  WITH CHECK (user_id = auth.uid() OR auth_user_is_org_admin(organization_id));
CREATE POLICY org_members_update ON organization_members FOR UPDATE
  USING (auth_user_is_org_admin(organization_id)) WITH CHECK (auth_user_is_org_admin(organization_id));
CREATE POLICY org_members_delete ON organization_members FOR DELETE
  USING (auth_user_is_org_admin(organization_id));

-- ORGANIZATION SETTINGS
CREATE POLICY org_settings_select ON organization_settings FOR SELECT
  USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY org_settings_insert ON organization_settings FOR INSERT
  WITH CHECK (
    organization_id IN (SELECT auth_user_org_ids())
    OR NOT EXISTS (SELECT 1 FROM organization_members WHERE user_id = auth.uid())
  );
CREATE POLICY org_settings_update ON organization_settings FOR UPDATE
  USING (organization_id IN (SELECT auth_user_org_ids()))
  WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));

-- CLIENTS
CREATE POLICY clients_select ON clients FOR SELECT USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY clients_insert ON clients FOR INSERT WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY clients_update ON clients FOR UPDATE USING (organization_id IN (SELECT auth_user_org_ids())) WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY clients_delete ON clients FOR DELETE USING (organization_id IN (SELECT auth_user_org_ids()));

-- CASES
CREATE POLICY cases_select ON cases FOR SELECT USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY cases_insert ON cases FOR INSERT WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY cases_update ON cases FOR UPDATE USING (organization_id IN (SELECT auth_user_org_ids())) WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY cases_delete ON cases FOR DELETE USING (organization_id IN (SELECT auth_user_org_ids()));

-- DEADLINES
CREATE POLICY deadlines_select ON deadlines FOR SELECT USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY deadlines_insert ON deadlines FOR INSERT WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY deadlines_update ON deadlines FOR UPDATE USING (organization_id IN (SELECT auth_user_org_ids())) WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY deadlines_delete ON deadlines FOR DELETE USING (organization_id IN (SELECT auth_user_org_ids()));

-- PUBLICATIONS
CREATE POLICY publications_select ON publications FOR SELECT USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY publications_insert ON publications FOR INSERT WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY publications_update ON publications FOR UPDATE USING (organization_id IN (SELECT auth_user_org_ids())) WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY publications_delete ON publications FOR DELETE USING (organization_id IN (SELECT auth_user_org_ids()));

-- PUBLICATION ANALYSES (via publication org)
CREATE POLICY pub_analyses_select ON publication_analyses FOR SELECT USING (
  publication_id IN (SELECT id FROM publications WHERE organization_id IN (SELECT auth_user_org_ids()))
);
CREATE POLICY pub_analyses_insert ON publication_analyses FOR INSERT WITH CHECK (
  publication_id IN (SELECT id FROM publications WHERE organization_id IN (SELECT auth_user_org_ids()))
);
CREATE POLICY pub_analyses_update ON publication_analyses FOR UPDATE USING (
  publication_id IN (SELECT id FROM publications WHERE organization_id IN (SELECT auth_user_org_ids()))
);
CREATE POLICY pub_analyses_delete ON publication_analyses FOR DELETE USING (
  publication_id IN (SELECT id FROM publications WHERE organization_id IN (SELECT auth_user_org_ids()))
);

-- TASKS
CREATE POLICY tasks_select ON tasks FOR SELECT USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY tasks_insert ON tasks FOR INSERT WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY tasks_update ON tasks FOR UPDATE USING (organization_id IN (SELECT auth_user_org_ids())) WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY tasks_delete ON tasks FOR DELETE USING (organization_id IN (SELECT auth_user_org_ids()));

-- DOCUMENTS
CREATE POLICY documents_select ON documents FOR SELECT USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY documents_insert ON documents FOR INSERT WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY documents_update ON documents FOR UPDATE USING (organization_id IN (SELECT auth_user_org_ids())) WITH CHECK (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY documents_delete ON documents FOR DELETE USING (organization_id IN (SELECT auth_user_org_ids()));

-- NOTIFICATIONS
CREATE POLICY notifications_select ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY notifications_insert ON notifications FOR INSERT WITH CHECK (
  user_id = auth.uid() AND organization_id IN (SELECT auth_user_org_ids())
);
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY notifications_delete ON notifications FOR DELETE USING (user_id = auth.uid());

-- ACTIVITY LOGS
CREATE POLICY activity_select ON activity_logs FOR SELECT USING (organization_id IN (SELECT auth_user_org_ids()));
CREATE POLICY activity_insert ON activity_logs FOR INSERT WITH CHECK (
  organization_id IN (SELECT auth_user_org_ids()) AND (user_id = auth.uid() OR user_id IS NULL)
);

-- STORAGE: bucket documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY storage_documents_select ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1]::uuid IN (SELECT auth_user_org_ids())
  );

CREATE POLICY storage_documents_insert ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1]::uuid IN (SELECT auth_user_org_ids())
  );

CREATE POLICY storage_documents_delete ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1]::uuid IN (SELECT auth_user_org_ids())
  );
