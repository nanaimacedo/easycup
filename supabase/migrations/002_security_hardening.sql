-- =============================================
-- SEGURANÇA AVANÇADA SUPABASE - EasyCup
-- =============================================

-- 1. Revogar acesso público direto às tabelas
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;

-- 2. Conceder apenas operações necessárias
GRANT INSERT ON inscricoes TO anon;
GRANT SELECT ON inscricoes TO anon;
GRANT INSERT ON audit_logs TO anon;
GRANT ALL ON inscricoes TO authenticated;
GRANT ALL ON audit_logs TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 3. Função segura para inserir inscrição (previne SQL injection via RPC)
CREATE OR REPLACE FUNCTION inserir_inscricao(
  p_id TEXT,
  p_modalidade TEXT,
  p_dados JSONB,
  p_valor NUMERIC,
  p_desconto NUMERIC DEFAULT 0,
  p_valor_final NUMERIC
) RETURNS inscricoes AS $$
DECLARE
  nova inscricoes;
BEGIN
  -- Validações server-side
  IF p_modalidade NOT IN ('simples', 'duplas', 'equipes') THEN
    RAISE EXCEPTION 'Modalidade inválida: %', p_modalidade;
  END IF;

  IF p_valor <= 0 OR p_valor_final <= 0 THEN
    RAISE EXCEPTION 'Valor inválido';
  END IF;

  IF length(p_id) < 5 THEN
    RAISE EXCEPTION 'ID inválido';
  END IF;

  INSERT INTO inscricoes (id, modalidade, dados, valor, desconto, valor_final)
  VALUES (p_id, p_modalidade, p_dados, p_valor, p_desconto, p_valor_final)
  RETURNING * INTO nova;

  -- Log de auditoria automático
  INSERT INTO audit_logs (action, entity, entity_id, details)
  VALUES ('INSERT', 'inscricoes', p_id, jsonb_build_object('modalidade', p_modalidade, 'valor', p_valor_final));

  RETURN nova;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Função segura para atualizar status
CREATE OR REPLACE FUNCTION atualizar_status_inscricao(
  p_id TEXT,
  p_status TEXT
) RETURNS VOID AS $$
BEGIN
  IF p_status NOT IN ('pendente', 'confirmada', 'cancelada') THEN
    RAISE EXCEPTION 'Status inválido: %', p_status;
  END IF;

  UPDATE inscricoes SET status = p_status WHERE id = p_id;

  INSERT INTO audit_logs (action, entity, entity_id, details)
  VALUES ('UPDATE_STATUS', 'inscricoes', p_id, jsonb_build_object('novo_status', p_status));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Função para buscar inscrição por ID (read seguro)
CREATE OR REPLACE FUNCTION buscar_inscricao(p_id TEXT)
RETURNS inscricoes AS $$
  SELECT * FROM inscricoes WHERE id = p_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- 6. Criptografia de dados sensíveis (extensão pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 7. Índice para performance de auditoria
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- 8. Limitar tamanho dos dados JSONB (prevenir DoS)
ALTER TABLE inscricoes ADD CONSTRAINT check_dados_size
  CHECK (length(dados::text) < 50000);

-- 9. Prevenir IDs duplicados com constraint explícita
ALTER TABLE inscricoes ADD CONSTRAINT inscricoes_id_unique UNIQUE (id);

-- 10. View materializada para dashboard (performance)
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_stats AS
SELECT
  modalidade,
  status,
  COUNT(*) as total,
  SUM(valor_final) as receita,
  MIN(created_at) as primeira_inscricao,
  MAX(created_at) as ultima_inscricao
FROM inscricoes
GROUP BY modalidade, status;

CREATE UNIQUE INDEX ON dashboard_stats (modalidade, status);

-- Função para refresh da view
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
