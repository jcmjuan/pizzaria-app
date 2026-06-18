import { Request, Response } from 'express'
import { ListOrdersService } from '../../services/order/ListOrderService';

class ActiveOrderController {
    async handle(req: Request, res: Response) {
        const table = req.query?.table as string;

        if (!table) {
            res.status(400).json({ error: "O número da mesa é obrigatório" });
            return;
        }

        const listOrders = new ListOrdersService();

        const orders = await listOrders.execute({
            table: Number(table),
            not_status: ["CLOSED", "CANCELED"],
        });

        if (orders.length === 0) {
            res.json(null);
            return;
        }

        res.json(orders[0]);
    }
}

export { ActiveOrderController }
