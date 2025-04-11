#!/bin/bash

echo "============================================"
echo "Instalador do Frontend - Sistema de Atendimento WhatsApp"
echo "============================================"
echo

# Verificar se está no diretório correto
if [ ! -d "frontend" ]; then
    echo "ERRO: O diretório frontend não foi encontrado."
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

# Verificar npm
echo "Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "npm não encontrado. Por favor, instale o Node.js que inclui o npm."
    exit 1
fi
echo "npm encontrado."

# Instalar dependências
echo "Instalando dependências do Node.js..."
cd frontend
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

# Verificar se o backend está rodando
echo "Verificando conexão com o backend..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "AVISO: O backend não parece estar rodando em http://localhost:3000"
    echo "Certifique-se de que o backend está rodando antes de iniciar o frontend."
fi

echo
echo "============================================"
echo "Instalação concluída com sucesso!"
echo
echo "Próximos passos:"
echo "1. Configure o arquivo .env com suas credenciais"
echo "2. Inicie o servidor de desenvolvimento com: npm start"
echo "3. Acesse http://localhost:3001 no navegador"
echo "============================================"
echo 