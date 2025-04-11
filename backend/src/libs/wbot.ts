import * as Sentry from "@sentry/node";
import makeWASocket, {
  WASocket,
  proto,
  AuthenticationState,
  DisconnectReason,
  useMultiFileAuthState,
  makeInMemoryStore,
  SocketConfig,
  Browsers
} from "@whiskeysockets/baileys";
import P from "pino";

import Whatsapp from "../models/Whatsapp";
import { logger } from "../utils/logger";
import MAIN_LOGGER from "@whiskeysockets/baileys/lib/Utils/logger";
import authState from "../helpers/authState";
import { Boom } from "@hapi/boom";
import AppError from "../errors/AppError";
import { getIO } from "./socket";
import { Store as BaileysStore } from "./store";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import DeleteBaileysService from "../services/BaileysServices/DeleteBaileysService";
import NodeCache from 'node-cache';

const loggerBaileys = MAIN_LOGGER.child({});
loggerBaileys.level = "silent";

type Store = ReturnType<typeof makeInMemoryStore>;

interface CustomWASocket extends WASocket {
  id?: number;
  store?: Store;
}

const sessions: CustomWASocket[] = [];

const retriesQrCodeMap = new Map<number, number>();

export const getWbot = (whatsappId: number): CustomWASocket => {
  const sessionIndex = sessions.findIndex(s => s.id === whatsappId);

  if (sessionIndex === -1) {
    throw new AppError("ERR_WAPP_NOT_INITIALIZED");
  }
  return sessions[sessionIndex];
};

export const removeWbot = async (
  whatsappId: number,
  isLogout = true
): Promise<void> => {
  try {
    const sessionIndex = sessions.findIndex(s => s.id === whatsappId);
    if (sessionIndex !== -1) {
      if (isLogout) {
        await sessions[sessionIndex].logout();
      }

      sessions.splice(sessionIndex, 1);
    }
  } catch (err) {
    logger.error(err);
  }
};

export const initWASocket = async (whatsapp: Whatsapp): Promise<CustomWASocket> => {
  return new Promise((resolve, reject) => {
    try {
      (async () => {
        const { state, saveState } = await authState(whatsapp);

        const store = makeInMemoryStore({
          logger: loggerBaileys
        });

        const msgRetryCounterCache = new NodeCache();

        const socketConfig: Partial<SocketConfig> = {
          auth: state,
          logger: loggerBaileys,
          printQRInTerminal: false,
          browser: Browsers.macOS("Chrome"),
          markOnlineOnConnect: true,
          generateHighQualityLinkPreview: true,
          getMessage: async () => {
            return {
              conversation: "Hello"
            };
          },
          msgRetryCounterCache,
          defaultQueryTimeoutMs: 60000,
          emitOwnEvents: true,
          fireInitQueries: true,
          shouldIgnoreJid: () => false,
          patchMessageBeforeSending: (message) => message,
          options: {
            maxCachedMessages: 100
          }
        };

        const wsocket = makeWASocket(socketConfig) as CustomWASocket;

        wsocket.ev.on("creds.update", saveState);

        wsocket.id = whatsapp.id;
        wsocket.store = store;

        store.bind(wsocket.ev);

        sessions.push(wsocket);

        resolve(wsocket);
      })();
    } catch (error) {
      reject(error);
    }
  });
};
