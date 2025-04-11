# Sistema de Atendimento via WhatsApp

## Visão Geral
Este é um sistema de atendimento ao cliente via WhatsApp que utiliza uma API não oficial para integração. O sistema permite gerenciar múltiplas contas de WhatsApp, criar tickets de atendimento, gerenciar filas de atendimento e automatizar respostas.

## Arquitetura
O sistema é dividido em duas partes principais:

### Backend
- Desenvolvido em Node.js com TypeScript
- Utiliza Express.js como framework web
- Integração com WhatsApp via API não oficial
- Sistema de filas para processamento assíncrono
- Banco de dados relacional
- WebSocket para comunicação em tempo real

### Frontend
- Interface web para gerenciamento do sistema
- Dashboard para acompanhamento de tickets
- Configuração de contas WhatsApp
- Gerenciamento de usuários e permissões

## Principais Funcionalidades
1. **Gerenciamento de Contas WhatsApp**
   - Conexão com múltiplas contas
   - Sessões independentes por empresa
   - Monitoramento de status das conexões

2. **Sistema de Tickets**
   - Criação automática de tickets
   - Atribuição a atendentes
   - Transferência entre setores
   - Histórico de conversas

3. **Filas de Atendimento**
   - Distribuição automática de tickets
   - Configuração de horários de atendimento
   - Priorização de tickets

4. **Automação**
   - Respostas automáticas
   - Mensagens programadas
   - Integração com chatbots

## Estrutura do Projeto

### Backend
```
backend/
├── src/
│   ├── config/         # Configurações do sistema
│   ├── controllers/    # Controladores da API
│   ├── database/       # Configurações do banco de dados
│   ├── errors/         # Tratamento de erros
│   ├── libs/           # Bibliotecas e utilitários
│   ├── middleware/     # Middlewares do Express
│   ├── models/         # Modelos do banco de dados
│   ├── routes/         # Rotas da API
│   ├── services/       # Lógica de negócios
│   └── utils/          # Funções utilitárias
```

### Frontend
```
frontend/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços de API
│   └── utils/          # Funções utilitárias
```

## Configuração do Ambiente

### Requisitos
- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Banco de dados PostgreSQL
- Redis (para filas)

### Instalação
1. Clone o repositório
2. Instale as dependências:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Copie `.env.example` para `.env`
   - Preencha as variáveis necessárias

4. Execute as migrações do banco de dados:
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   ```

5. Inicie os serviços:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm start
   ```

## Segurança
- Autenticação via JWT
- Criptografia de dados sensíveis
- Controle de acesso baseado em papéis (RBAC)
- Proteção contra ataques comuns (CORS, rate limiting)

## Monitoramento
- Integração com Sentry para monitoramento de erros
- Logs estruturados
- Métricas de performance

## Contribuição
Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das suas alterações
4. Abra um Pull Request

## Licença
[Inserir tipo de licença] 