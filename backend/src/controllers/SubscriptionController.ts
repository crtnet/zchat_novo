import { Request, Response } from "express";
import express from "express";
import * as Yup from "yup";
import Gerencianet from "gn-api-sdk-typescript";
import AppError from "../errors/AppError";

import options from "../config/Gn";
import Company from "../models/Company";
import Invoices from "../models/Invoices";
import Subscriptions from "../models/Subscriptions";
import { getIO } from "../libs/socket";
import UpdateUserService from "../services/UserServices/UpdateUserService";

const app = express();

interface SubscriptionData {
  firstName: string;
  price: number;
  users: number;
  connections: number;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  plan: string;
  invoiceId: number;
}

interface PixWebhookData {
  txid: string;
  status?: string;
  solicitacaoPagador?: string;
}

interface WebhookBody {
  pix?: PixWebhookData[];
  evento?: string;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const gerencianet = new Gerencianet(options);
  return res.json(gerencianet.getSubscriptions());
};

export const createSubscription = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const gerencianet = new Gerencianet(options);
  const { companyId } = req.user;

  const schema = Yup.object().shape({
    price: Yup.number().required(),
    users: Yup.number().required(),
    connections: Yup.number().required()
  });

  if (!(await schema.isValid(req.body))) {
    throw new AppError("Validation fails", 400);
  }

  const {
    firstName,
    price,
    users,
    connections,
    address2,
    city,
    state,
    zipcode,
    country,
    plan,
    invoiceId
  } = req.body as SubscriptionData;

  const body = {
    calendario: {
      expiracao: 3600
    },
    valor: {
      original: price.toFixed(2)
    },
    chave: process.env.GERENCIANET_PIX_KEY || '',
    solicitacaoPagador: `#Fatura:${invoiceId}`
  };

  try {
    const pix = await gerencianet.pixCreateImmediateCharge(null, body);

    const qrcode = await gerencianet.pixGenerateQRCode({
      id: pix.loc.id
    });

    const updateCompany = await Company.findOne();

    if (!updateCompany) {
      throw new AppError("Company not found", 404);
    }


/*     await Subscriptions.create({
      companyId,
      isActive: false,
      userPriceCents: users,
      whatsPriceCents: connections,
      lastInvoiceUrl: pix.location,
      lastPlanChange: new Date(),
      providerSubscriptionId: pix.loc.id,
      expiresAt: new Date()
    }); */

/*     const { id } = req.user;
    const userData = {};
    const userId = id;
    const requestUserId = parseInt(id);
    const user = await UpdateUserService({ userData, userId, companyId, requestUserId }); */

    /*     const io = getIO();
        io.emit("user", {
          action: "update",
          user
        }); */


    return res.json({
      ...pix,
      qrcode,

    });
  } catch (error) {
    throw new AppError("Validation fails", 400);
  }
};

export const createWebhook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const gerencianet = new Gerencianet(options);

  const { webhookUrl } = req.body;

  const body = {
    webhookUrl
  };

  try {
    const webhook = await gerencianet.pixConfigWebhook(body);
    return res.json(webhook);
  } catch (error) {
    throw new AppError("ERR_CREATE_WEBHOOK", 400);
  }
};

export const webhook = async (
  req: Request<{ type: string }, {}, WebhookBody>,
  res: Response
): Promise<Response> => {
  const gerencianet = new Gerencianet(options);
  const { type } = req.params;
  const { evento, pix } = req.body;

  if (evento === "teste_webhook") {
    return res.json({ ok: true });
  }

  if (pix) {
    await Promise.all(pix.map(async (pixData: PixWebhookData) => {
      const detalhe = await gerencianet.pixDetailCharge({
        txid: pixData.txid
      });

      if (detalhe.status === "CONCLUIDA" && detalhe.solicitacaoPagador) {
        const invoiceId = detalhe.solicitacaoPagador.replace("#Fatura:", "");
        const invoice = await Invoices.findByPk(invoiceId);
        
        if (!invoice) {
          throw new AppError("Invoice not found", 404);
        }

        const company = await Company.findByPk(invoice.companyId);
        
        if (!company) {
          throw new AppError("Company not found", 404);
        }

        const expiresAt = new Date(company.dueDate);
        expiresAt.setDate(expiresAt.getDate() + 30);
        const date = expiresAt.toISOString().split("T")[0];

        await company.update({
          dueDate: date
        });

        await invoice.update({
          status: 'paid'
        });

        await company.reload();
        
        const io = getIO();
        const companyUpdate = await Company.findOne({
          where: {
            id: invoice.companyId
          }
        });

        io.emit(`company-${invoice.companyId}-payment`, {
          action: detalhe.status,
          company: companyUpdate
        });
      }
    }));
  }

  return res.json({ ok: true });
};
