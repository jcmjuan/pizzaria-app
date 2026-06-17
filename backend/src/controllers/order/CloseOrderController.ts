import { Request, Response } from 'express'
import { CloseOrderService } from '../../services/order/CloseOrderService';
import { CloseMultipleOrdersService } from '../../services/order/CloseOrderService';

class CloseOrderController {
  async handle(req: Request, res: Response) {
    const { order_id, order_ids } = req.body;

    if (order_ids && Array.isArray(order_ids) && order_ids.length > 0) {
      const closeMultiple = new CloseMultipleOrdersService();
      const updatedOrders = await closeMultiple.execute({ order_ids });
      res.json(updatedOrders);
      return;
    }

    const closeOrder = new CloseOrderService();
    const updatedOrder = await closeOrder.execute({ order_id });
    res.json(updatedOrder);
  }
}

export { CloseOrderController }
