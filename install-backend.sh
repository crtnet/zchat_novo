#!/bin/bash

echo "============================================"
echo "Instalador do Backend - Sistema de Atendimento WhatsApp"
echo "============================================"
echo

# Verificar se está no diretório correto
if [ ! -d "backend" ]; then
    echo "ERRO: O diretório backend não foi encontrado."
    echo "Por favor, execute este script no diretório raiz do projeto."
    exit 1
fi

# Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "Node.js não encontrado. Por favor, instale o Node.js versão 14 ou superior."
    echo "Recomendamos usar o nvm (Node Version Manager):"
    echo "1. Instale o nvm: https://github.com/nvm-sh/nvm"
    echo "2. Execute: nvm install 14"
    exit 1
fi
echo "Node.js encontrado."

# Verificar Redis
echo "Verificando Redis..."
if ! command -v redis-cli &> /dev/null; then
    echo "Redis não encontrado. Instalando via Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "Homebrew não encontrado. Instalando Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install redis
    brew services start redis
fi
echo "Redis encontrado."

# Verificar PostgreSQL
echo "Verificando PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL não encontrado. Instalando via Homebrew..."
    brew install postgresql@14
    brew services start postgresql@14
fi
echo "PostgreSQL encontrado."

# Criar banco de dados
echo "Criando banco de dados..."
if ! psql -U postgres -c "CREATE DATABASE zchat;" 2>/dev/null; then
    echo "ERRO: Não foi possível criar o banco de dados."
    echo "Verifique se o PostgreSQL está rodando e se o usuário postgres existe."
    echo "Dica: Execute 'brew services start postgresql@14' se o PostgreSQL não estiver rodando."
    exit 1
fi
echo "Banco de dados criado com sucesso."

# Instalar dependências
echo "Instalando dependências do Node.js..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao instalar as dependências."
    exit 1
fi
echo "Dependências instaladas com sucesso."

# Configurar variáveis de ambiente
echo "Configurando variáveis de ambiente..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Arquivo .env criado. Por favor, configure as variáveis de ambiente."
fi

# Executar migrações
echo "Executando migrações do banco de dados..."
npx sequelize-cli db:migrate
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao executar as migrações."
    exit 1
fi
echo "Migrações executadas com sucesso."

# Criar diretório de uploads
echo "Criando diretório de uploads..."
mkdir -p public/uploads

echo
echo "============================================"
echo "Instalação concluída com sucesso!"
echo
echo "Próximos passos:"
echo "1. Configure o arquivo .env com suas credenciais"
echo "2. Inicie o servidor com: npm run dev"
echo "============================================"
echo 