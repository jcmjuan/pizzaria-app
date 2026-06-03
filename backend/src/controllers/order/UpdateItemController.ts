import { Request, Response } from 'express'
import { UpdateItemService } from '../../services/order/UpdateItemService'

class UpdateItemController {
  async handle(req: Request, res: Response) {
    const { item_id, amount } = req.body;

    const updateItem = new UpdateItemService();

    const result = await updateItem.execute({ item_id, amount });

    res.json(result);
  }
}

export { UpdateItemController }
