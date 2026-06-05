
CREATE TABLE inscricoes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  tamanho_camisa VARCHAR(5) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
