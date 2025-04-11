# Instalação e Configuração

## Requisitos do Sistema

### Servidor
- Node.js 14.x ou superior
- PostgreSQL 12.x ou superior
- Redis 6.x ou superior
- NPM 6.x ou superior
- 4GB de RAM (mínimo)
- 20GB de espaço em disco

### Sistema Operacional
- Linux (recomendado)
- Windows Server
- macOS (desenvolvimento)

## Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/zchat.git
cd zchat
```

### 2. Instale as Dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure o Banco de Dados
```bash
# Crie o banco de dados
createdb zchat

# Execute as migrações
cd backend
npx sequelize-cli db:migrate
```

### 4. Configure as Variáveis de Ambiente

#### Backend (.env)
```env
# Aplicação
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001

# Banco de Dados
DB_HOST=localhost
DB_USER=postgres
DB_PASS=senha
DB_NAME=zchat
DB_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=

# JWT
JWT_SECRET=sua_chave_secreta
JWT_REFRESH_SECRET=sua_chave_secreta_refresh

# Sentry
SENTRY_DSN=sua_dsn_do_sentry

# WhatsApp
WHATSAPP_API_URL=http://localhost:3000
WHATSAPP_API_KEY=sua_chave_api
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SOCKET_URL=http://localhost:3000
```

### 5. Inicie os Serviços

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm start
```

## Configuração Inicial

### 1. Crie uma Empresa
- Acesse o sistema
- Cadastre os dados da empresa
- Configure os planos e limites

### 2. Configure o WhatsApp
- Adicione uma conta WhatsApp
- Escaneie o QR Code
- Configure as mensagens automáticas

### 3. Crie Filas de Atendimento
- Defina os setores
- Configure os horários
- Adicione atendentes

### 4. Configure Usuários
- Crie perfis de acesso
- Adicione atendentes
- Defina permissões

## Backup e Restauração

### Backup do Banco de Dados
```bash
pg_dump -U postgres zchat > backup.sql
```

### Restauração
```bash
psql -U postgres zchat < backup.sql
```

## Atualização

### 1. Backup
```bash
# Backup do banco
pg_dump -U postgres zchat > backup.sql

# Backup dos arquivos
tar -czf backup.tar.gz /caminho/do/sistema
```

### 2. Atualização do Código
```bash
git pull origin main
```

### 3. Atualização das Dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Executar Migrações
```bash
cd backend
npx sequelize-cli db:migrate
```

## Troubleshooting

### Problemas Comuns

#### Conexão com WhatsApp
- Verifique se o número está ativo
- Confira as configurações da API
- Verifique o status da sessão

#### Banco de Dados
- Verifique as credenciais
- Confira se o serviço está rodando
- Verifique os logs de erro

#### Performance
- Aumente os recursos do servidor
- Otimize as consultas
- Configure cache

### Logs

#### Backend
```bash
tail -f backend/logs/app.log
```

#### Frontend
- Console do navegador
- Ferramentas de desenvolvimento

## Segurança

### Recomendações
- Use HTTPS
- Mantenha o sistema atualizado
- Faça backups regulares
- Monitore os logs
- Configure firewall

### Certificados SSL
```bash
# Gerar certificado
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout private.key -out certificate.crt
```

## Monitoramento

### Métricas
- Uso de CPU
- Uso de memória
- Conexões ativas
- Tickets em aberto

### Alertas
- Configurar no Sentry
- Configurar no servidor
- Configurar no banco de dados 