import prismaClient from "../../prisma/index";

interface ListProductServiceProps {
  disabled: boolean;
}

class ListProductService {
  async execute({ disabled }: ListProductServiceProps) {
    try {
      const products = await prismaClient.product.findMany({
        where: {
          disabled,
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          banner: true,
          disabled: true,
          category_id: true,
          createdAt: true,
          updatedAt: true,
          category:{
            select:{
                id: true,
                name: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return products;
    } catch (err) {
      throw new Error("Falha ao buscar produtos");
    }
  }
}

export { ListProductService };


