import { Request, Response } from 'express'
import { UpdateCategoryService } from '../../services/category/UpdateCategoryService'

class UpdateCategoryController {
  async handle(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const { name } = req.body;

    const updateCategory = new UpdateCategoryService();

    const category = await updateCategory.execute({ id, name });

    res.json(category);
  }
}

export { UpdateCategoryController }
