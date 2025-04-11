# Documentação da API

## Visão Geral
A API RESTful do sistema permite a integração com outros sistemas e o gerenciamento de todas as funcionalidades do atendimento via WhatsApp.

## Autenticação

### JWT Token
```http
Authorization: Bearer <token>
```

### Obtenção do Token
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@empresa.com",
  "password": "senha123"
}
```

## Endpoints Principais

### Tickets

#### Listar Tickets
```http
GET /tickets
Authorization: Bearer <token>
```

Parâmetros:
- `status`: open, pending, closed
- `userId`: ID do atendente
- `queueId`: ID da fila
- `page`: número da página
- `limit`: itens por página

#### Criar Ticket
```http
POST /tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "contactId": 123,
  "whatsappId": 456,
  "queueId": 789
}
```

#### Atualizar Ticket
```http
PUT /tickets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "closed",
  "userId": 123
}
```

### Mensagens

#### Enviar Mensagem
```http
POST /messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "ticketId": 123,
  "body": "Olá, como posso ajudar?",
  "mediaUrl": "https://exemplo.com/imagem.jpg"
}
```

#### Listar Mensagens
```http
GET /messages
Authorization: Bearer <token>
```

Parâmetros:
- `ticketId`: ID do ticket
- `page`: número da página
- `limit`: itens por página

### WhatsApp

#### Listar Contas
```http
GET /whatsapp
Authorization: Bearer <token>
```

#### Criar Conta
```http
POST /whatsapp
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Atendimento Principal",
  "number": "5511999999999"
}
```

#### Obter QR Code
```http
GET /whatsapp/:id/qrcode
Authorization: Bearer <token>
```

### Filas

#### Listar Filas
```http
GET /queues
Authorization: Bearer <token>
```

#### Criar Fila
```http
POST /queues
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Suporte Técnico",
  "color": "#FF0000",
  "greetingMessage": "Bem-vindo ao suporte técnico"
}
```

## WebSocket

### Eventos

#### Ticket
```javascript
socket.on('ticket', (data) => {
  // data: { action: 'create' | 'update' | 'delete', ticket: Ticket }
});
```

#### Mensagem
```javascript
socket.on('message', (data) => {
  // data: { action: 'create' | 'update' | 'delete', message: Message }
});
```

#### WhatsApp
```javascript
socket.on('whatsappSession', (data) => {
  // data: { action: 'update', session: Whatsapp }
});
```

## Códigos de Resposta

- `200`: Sucesso
- `201`: Criado
- `400`: Requisição inválida
- `401`: Não autorizado
- `403`: Proibido
- `404`: Não encontrado
- `500`: Erro interno

## Paginação

Todos os endpoints de listagem suportam paginação:

```json
{
  "data": [...],
  "count": 100,
  "hasMore": true,
  "page": 1,
  "limit": 10
}
```

## Filtros

### Operadores
- `eq`: igual
- `ne`: diferente
- `gt`: maior que
- `lt`: menor que
- `gte`: maior ou igual
- `lte`: menor ou igual
- `like`: contém

### Exemplo
```http
GET /tickets?status=eq:open&createdAt=gt:2023-01-01
```

## Ordenação

```http
GET /tickets?orderBy=createdAt:desc
```

## Limites de Requisição

- 100 requisições por minuto por IP
- 1000 requisições por hora por usuário

## Versão da API

A versão atual da API é v1. Todas as requisições devem incluir o prefixo `/api/v1/`.

## Exemplos de Uso

### Enviar Mensagem com Mídia
```javascript
const formData = new FormData();
formData.append('ticketId', '123');
formData.append('body', 'Confira esta imagem');
formData.append('media', fileInput.files[0]);

fetch('/api/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

### WebSocket Connection
```javascript
const socket = io('http://api.exemplo.com', {
  query: {
    token: 'jwt_token'
  }
});

socket.on('connect', () => {
  console.log('Conectado ao WebSocket');
});

socket.on('ticket', (data) => {
  if (data.action === 'create') {
    console.log('Novo ticket:', data.ticket);
  }
});
``` 