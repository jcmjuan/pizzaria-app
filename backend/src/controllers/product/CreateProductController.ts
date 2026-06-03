import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
  async handle(req: Request, res: Response) {
    try {
      const { name, price, description, category_id } = req.body;

      if (!req.file) {
        return res.status(400).json({
          error: "A imagem do produto é obrigatória"
        });
      }

      const priceNumber = Number(price);
      if (isNaN(priceNumber)) {
        return res.status(400).json({
          error: "Preço inválido"
        });
      }

      const createProduct = new CreateProductService();

      const product = await createProduct.execute({
        name,
        price: priceNumber,
        description,
        category_id,
        imageBuffer: req.file.buffer,
        imageName: req.file.originalname
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

export { CreateProductController };
