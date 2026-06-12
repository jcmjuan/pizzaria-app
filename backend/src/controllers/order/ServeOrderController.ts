import { Request, Response } from 'express'
import { ServeOrderService } from '../../services/order/ServeOrderService';

class ServeOrderController {
    async handle(req: Request, res: Response) {
        const { order_id, item_ids } = req.body;

        const serveOrder = new ServeOrderService();

        const order = await serveOrder.execute({
            order_id,
            item_ids,
        });

        res.json(order);
    }
}

export { ServeOrderController }
