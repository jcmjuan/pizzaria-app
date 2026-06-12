import { Request, Response } from "express";
import { CreateOrderService } from "../../services/order/CreateOrderService";

class CreateOrderController {
  async handle(req: Request, res: Response) {
    const { table, name } = req.body;
    const user_id = req.user_id;

    const createOrder = new CreateOrderService();

    const order = await createOrder.execute({
      table: Number(table),
      name,
      user_id,
    });

   res.status(201).json(order);
  }
}

export { CreateOrderController };


