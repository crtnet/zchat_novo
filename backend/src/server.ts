/**
 * Arquivo de inicialização do servidor
 * Responsável por iniciar o servidor HTTP e configurar os serviços necessários
 */

import gracefulShutdown from "http-graceful-shutdown";
import app from "./app";
import { initIO } from "./libs/socket";
import { logger } from "./utils/logger";
import { StartAllWhatsAppsSessions } from "./services/WbotServices/StartAllWhatsAppsSessions";
import Company from "./models/Company";
import { startQueueProcess } from "./queues";
import { TransferTicketQueue } from "./wbotTransferTicketQueue";
import cron from "node-cron";

// Inicia o servidor HTTP na porta configurada
const server = app.listen(process.env.PORT, async () => {
  // Busca todas as empresas cadastradas
  const companies = await Company.findAll();
  const allPromises: any[] = [];
  
  // Inicia as sessões do WhatsApp para cada empresa
  companies.map(async c => {
    const promise = StartAllWhatsAppsSessions(c.id);
    allPromises.push(promise);
  });

  // Após iniciar todas as sessões, inicia o processamento das filas
  Promise.all(allPromises).then(() => {
    startQueueProcess();
  });
  logger.info(`Server started on port: ${process.env.PORT}`);
});

// Configura um job cron para transferência automática de tickets
cron.schedule("* * * * *", async () => {
  try {
    logger.info(`Serviço de transferencia de tickets iniciado`);
    await TransferTicketQueue();
  }
  catch (error) {
    logger.error(error);
  }
});

// Inicializa o WebSocket
initIO(server);

// Configura o shutdown gracioso do servidor
gracefulShutdown(server);
