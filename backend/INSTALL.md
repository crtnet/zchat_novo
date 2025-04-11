# Instalação do Backend no macOS

## Requisitos

### 1. Homebrew
O Homebrew é o gerenciador de pacotes recomendado para macOS. Instale-o primeiro:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Node.js
Recomendamos usar o nvm (Node Version Manager) para gerenciar versões do Node.js:
```bash
# Instale o nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Instale o Node.js 14
nvm install 14
nvm use 14
```

### 3. PostgreSQL
```bash
# Instale o PostgreSQL 14
brew install postgresql@14

# Inicie o serviço
brew services start postgresql@14

# Configure o usuário postgres
createuser -s postgres
```

### 4. Redis
```bash
# Instale o Redis
brew install redis

# Inicie o serviço
brew services start redis
```

## Instalação Automática

1. Torne o script executável:
```bash
chmod +x install-backend.sh
```

2. Execute o script:
```bash
./install-backend.sh
```

## Instalação Manual

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Configurar Banco de Dados

#### Criar Banco de Dados
```bash
createdb -U postgres zchat
```

#### Executar Migrações
```bash
npx sequelize-cli db:migrate
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações da Aplicação
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001

# Configurações do Banco de Dados
DB_HOST=localhost
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=zchat
DB_PORT=5432

# Configurações do Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=

# Configurações de Autenticação
JWT_SECRET=sua_chave_secreta
JWT_REFRESH_SECRET=sua_chave_refresh

# Configurações do WhatsApp
WHATSAPP_API_URL=http://localhost:3000
WHATSAPP_API_KEY=sua_chave_api
```

### 4. Criar Diretório de Uploads
```bash
mkdir -p public/uploads
```

## Iniciando o Servidor

### Modo Desenvolvimento
```bash
npm run dev
```

### Modo Produção
```bash
npm run build
npm start
```

## Troubleshooting

### Problemas com PostgreSQL
- Verifique se o serviço está rodando: `brew services list`
- Inicie o serviço: `brew services start postgresql@14`
- Verifique os logs: `tail -f /usr/local/var/log/postgresql@14.log`

### Problemas com Redis
- Verifique se o serviço está rodando: `brew services list`
- Inicie o serviço: `brew services start redis`
- Verifique os logs: `tail -f /usr/local/var/log/redis.log`

### Problemas com Node.js
- Verifique a versão: `node -v`
- Limpe o cache: `npm cache clean --force`
- Reinstale as dependências: `rm -rf node_modules && npm install`

## Dicas

1. **Backup do Banco de Dados**
```bash
pg_dump -U postgres zchat > backup.sql
```

2. **Restaurar Backup**
```bash
psql -U postgres zchat < backup.sql
```

3. **Resetar Banco de Dados**
```bash
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

4. **Limpar Cache do Redis**
```bash
redis-cli FLUSHALL
```

## Suporte

Em caso de problemas, verifique:

1. Logs do servidor
2. Logs do PostgreSQL: `/usr/local/var/log/postgresql@14.log`
3. Logs do Redis: `/usr/local/var/log/redis.log`
4. Console do navegador (para erros de API) 