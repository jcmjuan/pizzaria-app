import prismaClient from "../../prisma/index"

interface DeleteCategoryProps {
  id: string;
}

class DeleteCategoryService {
  async execute({ id }: DeleteCategoryProps) {
    const category = await prismaClient.category.findFirst({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    if (category._count.products > 0) {
      throw new Error("Não é possível excluir uma categoria com produtos vinculados");
    }

    await prismaClient.category.delete({
      where: { id }
    });

    return { message: "Categoria deletada com sucesso" };
  }
}

export { DeleteCategoryService }
