-- Ativar a extensão de geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Criação da Tabela Profile (Perfis de Visualização)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criação da Tabela Fees (Taxas fixas e percentuais)
CREATE TABLE fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT CHECK (type IN ('fixed', 'percentage', 'per-sale', 'unique')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criação da Tabela Goals (Metas Financeiras)
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_amount NUMERIC NOT NULL,
    current_amount NUMERIC DEFAULT 0,
    deadline TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criação da Tabela Sales (Vendas e Retornos Concluídos)
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL, -- Retorno bruto da venda
    invested_amount NUMERIC NOT NULL, -- Dinheiro investido para fazer a venda
    apply_fees BOOLEAN DEFAULT TRUE, -- Se "false", ignora as taxas per-sale
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criação da Tabela Pending Investments (Vendas Registradas apenas como Gasto)
CREATE TABLE pending_investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    invested_amount NUMERIC NOT NULL, 
    registered_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_resolved BOOLEAN DEFAULT FALSE -- Fica true quando vinculam um retorno
);

-- POLÍTICAS DE SEGURANÇA (Row Level Security - RLS)
-- Isso garante que um usuário veja APENAS os dados do PRÓPRIO perfil.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_investments ENABLE ROW LEVEL SECURITY;

-- Política para Profiles
CREATE POLICY "Users can manage their own profiles"
ON profiles FOR ALL USING (auth.uid() = user_id);

-- Política para Fees (Garante que só veja as taxas do perfil dono)
CREATE POLICY "Users can manage fees for their profiles"
ON fees FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Política para Goals
CREATE POLICY "Users can manage goals for their profiles"
ON goals FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Política para Sales
CREATE POLICY "Users can manage sales for their profiles"
ON sales FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Política para Pending Investments
CREATE POLICY "Users can manage pending investments for their profiles"
ON pending_investments FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
