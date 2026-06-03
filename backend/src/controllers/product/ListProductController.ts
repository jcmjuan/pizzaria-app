import { Request, Response } from "express";
import { ListProductService } from "../../services/product/ListProductService";

class ListProductController {
  async handle(req: Request, res: Response) {
    try {
      const { disabled } = req.query;

      let disabledFilter = false;

      if (typeof disabled === "string") {
        disabledFilter = disabled === "true";
      }

      const listProductService = new ListProductService();

      const products = await listProductService.execute({
        disabled: disabledFilter,
      });

      return res.status(200).json(products);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        error: error.message || "Erro interno do servidor",
      });
    }
  }
}

export { ListProductController };


