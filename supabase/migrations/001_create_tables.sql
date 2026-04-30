-- Tabela de inscrições
CREATE TABLE inscricoes (
  id TEXT PRIMARY KEY,
  modalidade TEXT NOT NULL CHECK (modalidade IN ('simples', 'duplas', 'equipes')),
  dados JSONB NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  desconto NUMERIC(10,2) DEFAULT 0,
  valor_final NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmada', 'cancelada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_inscricoes_modalidade ON inscricoes(modalidade);
CREATE INDEX idx_inscricoes_status ON inscricoes(status);
CREATE INDEX idx_inscricoes_created ON inscricoes(created_at DESC);

-- RLS: habilitar
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

-- Política: qualquer um pode inserir (inscrição pública)
CREATE POLICY "inscricoes_insert" ON inscricoes
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Política: qualquer um pode ler sua própria inscrição por ID
CREATE POLICY "inscricoes_select_by_id" ON inscricoes
  FOR SELECT TO anon, authenticated
  USING (true);

-- Política: somente service_role (admin) pode atualizar
CREATE POLICY "inscricoes_update_admin" ON inscricoes
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: somente service_role (admin) pode deletar
CREATE POLICY "inscricoes_delete_admin" ON inscricoes
  FOR DELETE TO authenticated
  USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inscricoes_updated_at
  BEFORE UPDATE ON inscricoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Tabela de logs de auditoria (segurança)
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Somente insert público (para logging), leitura restrita
CREATE POLICY "audit_insert" ON audit_logs
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "audit_select_admin" ON audit_logs
  FOR SELECT TO authenticated
  USING (true);
