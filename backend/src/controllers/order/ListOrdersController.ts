import { Request, Response } from "express";
import { ListOrdersService } from "../../services/order/ListOrderService";

class ListOrdersController {
  async handle(req: Request, res: Response) {
    const draft = req.query?.draft as string | undefined;
    const status = req.query?.status as string | undefined;

    const listOrders = new ListOrdersService();

    const orders = await listOrders.execute({
      draft: draft,
      status: status,
    });

    res.json(orders);
  }
}

export { ListOrdersController }
