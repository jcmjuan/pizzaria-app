import { Request, Response } from 'express'
import { StartOrderService } from '../../services/order/StartOrderService';

class StartOrderController {
    async handle(req: Request, res: Response) {
        const { order_id, item_ids } = req.body;

        const startOrder = new StartOrderService();

        const order = await startOrder.execute({
            order_id,
            item_ids,
        });

        res.json(order);
    }
}

export { StartOrderController }
