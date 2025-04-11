# Integração com WhatsApp

## Visão Geral
O sistema utiliza uma API não oficial do WhatsApp para realizar a integração. Esta documentação descreve como o sistema se comunica com o WhatsApp e gerencia as sessões.

## Arquitetura da Integração

### Componentes Principais
1. **WbotServices**
   - Gerencia as sessões do WhatsApp
   - Monitora o status das conexões
   - Processa mensagens recebidas

2. **BaileysServices**
   - Implementa a comunicação direta com o WhatsApp
   - Gerencia o estado das conexões
   - Processa eventos do WhatsApp

3. **MessageServices**
   - Gerencia o envio e recebimento de mensagens
   - Processa diferentes tipos de mensagens (texto, mídia, etc.)
   - Mantém o histórico de conversas

## Fluxo de Conexão

1. **Inicialização da Sessão**
   ```typescript
   // 1. Atualiza status para "OPENING"
   await whatsapp.update({ status: "OPENING" });
   
   // 2. Notifica frontend
   io.emit("whatsappSession", { action: "update", session: whatsapp });
   
   // 3. Inicia conexão
   const wbot = await initWASocket(whatsapp);
   
   // 4. Configura listeners
   wbotMessageListener(wbot, companyId);
   wbotMonitor(wbot, whatsapp, companyId);
   ```

2. **Monitoramento**
   - Verifica status da conexão
   - Reconecta automaticamente em caso de falha
   - Atualiza status no banco de dados

3. **Processamento de Mensagens**
   - Recebe mensagens do WhatsApp
   - Cria/atualiza tickets
   - Notifica atendentes
   - Processa respostas automáticas

## Tipos de Mensagens Suportadas

1. **Texto**
   - Mensagens simples
   - Formatação básica

2. **Mídia**
   - Imagens
   - Vídeos
   - Documentos
   - Áudios

3. **Localização**
   - Coordenadas GPS
   - Endereços

4. **Contatos**
   - Compartilhamento de contatos

## Segurança

1. **Autenticação**
   - QR Code para conexão inicial
   - Tokens de sessão
   - Validação de dispositivos

2. **Criptografia**
   - Mensagens criptografadas
   - Armazenamento seguro de credenciais

## Monitoramento

1. **Status da Conexão**
   - Online/Offline
   - Última conexão
   - Erros de conexão

2. **Métricas**
   - Mensagens enviadas/recebidas
   - Taxa de entrega
   - Tempo de resposta

## Tratamento de Erros

1. **Reconexão Automática**
   - Tentativas de reconexão
   - Backoff exponencial
   - Notificações de falha

2. **Logs**
   - Erros de conexão
   - Falhas no envio
   - Problemas de autenticação

## Limitações

1. **API Não Oficial**
   - Risco de bloqueio
   - Mudanças frequentes
   - Limitações de funcionalidades

2. **Restrições do WhatsApp**
   - Limite de mensagens
   - Políticas de uso
   - Restrições de mídia

## Boas Práticas

1. **Manutenção**
   - Atualizações frequentes
   - Monitoramento constante
   - Backup de dados

2. **Uso Responsável**
   - Respeito aos limites
   - Políticas de privacidade
   - Termos de serviço

## Troubleshooting

1. **Problemas Comuns**
   - Falha na conexão
   - Mensagens não entregues
   - Erros de autenticação

2. **Soluções**
   - Verificar credenciais
   - Reiniciar sessão
   - Atualizar biblioteca 