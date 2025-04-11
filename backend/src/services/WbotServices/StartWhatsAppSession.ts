/**
 * Serviço responsável por iniciar uma sessão do WhatsApp
 * Este serviço é chamado para cada conta WhatsApp que precisa ser conectada
 */

import { initWASocket } from "../../libs/wbot";
import Whatsapp from "../../models/Whatsapp";
import { wbotMessageListener } from "./wbotMessageListener";
import { getIO } from "../../libs/socket";
import wbotMonitor from "./wbotMonitor";
import { logger } from "../../utils/logger";
import * as Sentry from "@sentry/node";

/**
 * Inicia uma sessão do WhatsApp para uma conta específica
 * @param whatsapp - Objeto contendo as configurações da conta WhatsApp
 * @param companyId - ID da empresa dona da conta
 */
export const StartWhatsAppSession = async (
  whatsapp: Whatsapp,
  companyId: number
): Promise<void> => {
  // Atualiza o status da sessão para "OPENING"
  await whatsapp.update({ status: "OPENING" });

  // Notifica o frontend sobre a atualização do status
  const io = getIO();
  io.emit("whatsappSession", {
    action: "update",
    session: whatsapp
  });

  try {
    // Inicializa a conexão com o WhatsApp
    const wbot = await initWASocket(whatsapp);
    
    // Configura os listeners de mensagens
    wbotMessageListener(wbot, companyId);
    
    // Inicia o monitoramento da sessão
    wbotMonitor(wbot, whatsapp, companyId);
  } catch (err) {
    // Registra erros no Sentry e no log local
    Sentry.captureException(err);
    logger.error(err);
  }
};
