import { Options, IntegrationApiKeys, Environment, WebpayPlus } from 'transbank-sdk';

export interface WebpayInitTransactionPayload {
  buyOrder: string;
  sessionId: string;
  amount: number;
  returnUrl: string;
}

export class WebpayService {
  private tx: WebpayPlus.Transaction;

  constructor() {
    const environment = process.env.WEBPAY_ENV === 'PRODUCTION' 
      ? Environment.Production 
      : Environment.Integration;

    const commerceCode = process.env.WEBPAY_COMMERCE_CODE || IntegrationApiKeys.WEBPAY_PLUS_COMMERCE_CODE;
    const apiKey = process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY_PLUS_API_KEY;

    this.tx = new WebpayPlus.Transaction(new Options(commerceCode, apiKey, environment));
  }

  async createTransaction(data: WebpayInitTransactionPayload) {
    try {
      const response = await this.tx.create(
        data.buyOrder,
        data.sessionId,
        data.amount,
        data.returnUrl
      );
      return response;
    } catch (error) {
      throw new Error(`Error en Transbank Webpay init: ${(error as Error).message}`);
    }
  }

  async commitTransaction(token: string) {
    try {
      const response = await this.tx.commit(token);
      return response;
    } catch (error) {
      throw new Error(`Error confirmando Webpay token (${token}): ${(error as Error).message}`);
    }
  }
}