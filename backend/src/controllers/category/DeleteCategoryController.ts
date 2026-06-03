import { Request, Response } from 'express'
import { DeleteCategoryService } from '../../services/category/DeleteCategoryService'

class DeleteCategoryController {
  async handle(req: Request, res: Response) {
    const { id } = req.params as { id: string };

    const deleteCategory = new DeleteCategoryService();

    await deleteCategory.execute({ id });

    res.json({ message: "Categoria deletada com sucesso" });
  }
}

export { DeleteCategoryController }
