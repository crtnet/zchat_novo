/**
 * Arquivo principal de configuração da aplicação Express
 * Este arquivo configura os middlewares, rotas e tratamento de erros
 */

import "./bootstrap";
import "reflect-metadata";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";

import "./database";
import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";
import routes from "./routes";
import { logger } from "./utils/logger";
import { messageQueue, sendScheduledMessages } from "./queues";

// Inicializa o Sentry para monitoramento de erros apenas se a DSN estiver configurada e for válida
if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'sua_dsn_do_sentry_aqui') {
  Sentry.init({ 
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development'
  });
}

const app = express();

// Configura as filas de mensagens como propriedade da aplicação
app.set("queues", {
  messageQueue,
  sendScheduledMessages
});

// Configuração de CORS para permitir requisições do frontend
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"]
  })
);

// Middlewares básicos
app.use(cookieParser());
app.use(express.json());

// Adiciona o middleware do Sentry apenas se estiver configurado e for válido
if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'sua_dsn_do_sentry_aqui') {
  app.use(Sentry.Handlers.requestHandler());
}

// Configuração de arquivos estáticos
app.use("/public", express.static(uploadConfig.directory));

// Rotas da aplicação
app.use(routes);

// Handler de erros do Sentry apenas se estiver configurado e for válido
if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'sua_dsn_do_sentry_aqui') {
  app.use(Sentry.Handlers.errorHandler());
}

// Middleware de tratamento de erros global
app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(err);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

export default app;
