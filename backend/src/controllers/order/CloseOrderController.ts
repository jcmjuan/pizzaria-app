import { Request, Response } from 'express'
import { CloseOrderService } from '../../services/order/CloseOrderService';

class CloseOrderController {
  async handle(req: Request, res: Response) {
    const { order_id } = req.body;

    const closeOrder = new CloseOrderService();

    const updatedOrder = await closeOrder.execute({ order_id });

    res.json(updatedOrder);
  }
}

export { CloseOrderController }
