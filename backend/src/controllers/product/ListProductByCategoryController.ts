import { Request, Response } from "express";
import { ListProductByCategoryService } from "../../services/product/ListProductByCategoryService";

class ListProductByCategoryController {
  async handle(req: Request, res: Response) {
    try {
      const category_id = req.query?.category_id as string;

      const listProductByCategoryService = new ListProductByCategoryService();

      const products = await listProductByCategoryService.execute({ category_id });

      return res.status(200).json(products);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        error: error.message || "Erro interno do servidor",
      });
    }
  }
}

export { ListProductByCategoryController };


