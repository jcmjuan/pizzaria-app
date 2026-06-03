import prismaClient from "../../prisma";
import cloudinary from "../../config/cloudinary";
import { Readable } from "node:stream";

interface UpdateProductServiceProps {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  category_id?: string;
  imageBuffer?: Buffer;
  imageName?: string;
}

class UpdateProductService {
  async execute({
    id,
    name,
    price,
    description,
    category_id,
    imageBuffer,
    imageName
  }: UpdateProductServiceProps) {

    const product = await prismaClient.product.findFirst({
      where: { id }
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    if (category_id) {
      const categoryExists = await prismaClient.category.findFirst({
        where: { id: category_id }
      });

      if (!categoryExists) {
        throw new Error("Categoria não encontrada");
      }
    }

    let bannerUrl = product.banner;

    if (imageBuffer) {
      try {
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
              resource_type: "image",
              public_id: `${Date.now()}-${imageName ? imageName.split(".")[0] : "product"}`
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          const bufferStream = Readable.from(imageBuffer);
          bufferStream.pipe(uploadStream);
        });

        bannerUrl = result.secure_url;
      } catch (error) {
        console.error(error);
        throw new Error("Erro ao fazer o upload da imagem");
      }
    }

    const updatedProduct = await prismaClient.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(description !== undefined && { description }),
        ...(category_id !== undefined && { category_id }),
        ...(imageBuffer !== undefined && { banner: bannerUrl }),
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        banner: true,
        category_id: true,
        disabled: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return updatedProduct;
  }
}

export { UpdateProductService }
