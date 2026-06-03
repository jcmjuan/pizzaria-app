import { Request, Response } from "express";
import { UpdateProductService } from "../../services/product/UpdateProductService";

class UpdateProductController {
  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { name, price, description, category_id } = req.body;

      const priceNumber = price ? Number(price) : undefined;
      if (price !== undefined && isNaN(priceNumber!)) {
        return res.status(400).json({ error: "Preço inválido" });
      }

      const updateProduct = new UpdateProductService();

      const product = await updateProduct.execute({
        id,
        name,
        price: priceNumber,
        description,
        category_id,
        ...(req.file ? {
          imageBuffer: req.file.buffer,
          imageName: req.file.originalname
        } : {})
      });

      return res.json(product);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        error: error.message || "Erro interno do servidor"
      });
    }
  }
}

export { UpdateProductController }
