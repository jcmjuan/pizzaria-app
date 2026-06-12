import { Request, Response } from "express";
import { ListOrdersService } from "../../services/order/ListOrderService";

class ListOrdersController {
  async handle(req: Request, res: Response) {
    const draft = req.query?.draft as string | undefined;
    const status = req.query?.status as string | undefined;
    const user_id = req.query?.user_id as string | undefined;
    const table = req.query?.table as string | undefined;
    const not_status = req.query?.not_status as string | undefined;

    const listOrders = new ListOrdersService();

    const orders = await listOrders.execute({
      draft: draft,
      status: status,
      user_id: user_id,
      table: table ? Number(table) : undefined,
      not_status: not_status,
    });

    res.json(orders);
  }
}

export { ListOrdersController }
