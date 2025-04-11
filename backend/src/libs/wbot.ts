import * as Sentry from "@sentry/node";
import {
  makeWASocket,
  WASocket,
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
  CacheStore,
  makeInMemoryStore,
  makeWALegacySocket,
  proto,
  AuthenticationState
} from "@adiwajshing/baileys";
import P from "pino";

import Whatsapp from "../models/Whatsapp";
import { logger } from "../utils/logger";
import MAIN_LOGGER from "@adiwajshing/baileys/lib/Utils/logger";
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

type Session = WASocket & {
  id?: number;
  store?: Store;
};

const sessions: Session[] = [];

const retriesQrCodeMap = new Map<number, number>();

export const getWbot = (whatsappId: number): Session => {
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

export const initWASocket = async (whatsapp: Whatsapp): Promise<Session> => {
  return new Promise((resolve, reject) => {
    try {
      (async () => {
        const { version } = await fetchLatestBaileysVersion();

        const { state, saveState } = await authState(whatsapp);

        const store = makeInMemoryStore({
          logger: loggerBaileys
        });

        const wsocket = makeWASocket({
          version,
          browser: Browsers.macOS("Chrome"),
          auth: state,
          logger: loggerBaileys,
          printQRInTerminal: false,
          markOnlineOnConnect: true,
          syncFullHistory: false,
          connectTimeoutMs: 60000,
          defaultQueryTimeoutMs: 60000,
          emitOwnEvents: true,
          retryRequestDelayMs: 2000,
          getMessage: async () => {
            return {
              conversation: "Hello World"
            }
          }
        });

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
