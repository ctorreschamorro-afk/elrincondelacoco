import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { WebpayService } from "../../../services/webpay";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { amount, buyOrder, sessionId, returnUrl } = req.body as any;

  if (!amount || !buyOrder || !sessionId || !returnUrl) {
    return res.status(400).json({ message: "Parámetros incompletos para Webpay" });
  }

  try {
    const webpayService = new WebpayService();
    const result = await webpayService.createTransaction({
      amount: Math.round(amount),
      buyOrder,
      sessionId,
      returnUrl,
    });

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};