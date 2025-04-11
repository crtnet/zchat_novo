# Sistema de Tickets

## Visão Geral
O sistema de tickets é o núcleo do atendimento ao cliente, gerenciando todas as interações entre clientes e atendentes. Cada conversa do WhatsApp é convertida em um ticket que pode ser atribuído, transferido e monitorado.

## Modelo de Dados

### Ticket
```typescript
interface Ticket {
  id: number;
  status: 'open' | 'pending' | 'closed';
  userId: number;        // Atendente responsável
  contactId: number;     // Cliente
  whatsappId: number;    // Conta WhatsApp
  queueId: number;       // Fila de atendimento
  companyId: number;     // Empresa
  createdAt: Date;
  updatedAt: Date;
}
```

### TicketTraking
```typescript
interface TicketTraking {
  id: number;
  ticketId: number;
  userId: number;        // Atendente
  queueId: number;       // Fila
  startedAt: Date;       // Início do atendimento
  finishedAt: Date;      // Fim do atendimento
  rating: number;        // Avaliação
}
```

## Fluxo de Atendimento

1. **Criação do Ticket**
   - Mensagem recebida do WhatsApp
   - Verificação de contato existente
   - Criação automática do ticket
   - Atribuição à fila apropriada

2. **Atribuição**
   - Distribuição automática por fila
   - Atribuição manual por supervisor
   - Notificação ao atendente

3. **Atendimento**
   - Histórico de mensagens
   - Transferência entre setores
   - Respostas rápidas
   - Anotações internas

4. **Encerramento**
   - Avaliação do cliente
   - Relatório de atendimento
   - Métricas de performance

## Filas de Atendimento

### Configuração
- Horários de funcionamento
- Capacidade de atendentes
- Regras de distribuição
- Prioridades

### Distribuição
1. **Round Robin**
   - Distribuição igualitária
   - Balanceamento de carga

2. **Prioridade**
   - Tickets urgentes
   - Clientes VIP
   - Tempo de espera

3. **Habilidades**
   - Atendentes especializados
   - Setores específicos

## Automação

### Respostas Automáticas
- Mensagens de boas-vindas
- Fora do horário
- Ausência de atendentes

### Fluxos de Atendimento
- Perguntas frequentes
- Coleta de informações
- Encaminhamento automático

## Relatórios

### Métricas
- Tempo de resposta
- Tempo de resolução
- Satisfação do cliente
- Volume de atendimentos

### Dashboards
- Tickets em aberto
- Performance por atendente
- Tempo médio de espera
- Taxa de resolução

## Integrações

### Chatbots
- Respostas automáticas
- Coleta de informações
- Encaminhamento inteligente

### CRM
- Histórico do cliente
- Dados cadastrais
- Interações anteriores

## Segurança

### Controle de Acesso
- Níveis de permissão
- Restrição por setor
- Auditoria de ações

### Privacidade
- Dados sensíveis
- Histórico de conversas
- Informações do cliente

## Manutenção

### Limpeza
- Tickets antigos
- Dados temporários
- Arquivos de mídia

### Backup
- Histórico de conversas
- Dados de tickets
- Configurações 