import prismaClient from "../../prisma/index"

interface UpdateCategoryProps {
  id: string;
  name: string;
}

class UpdateCategoryService {
  async execute({ id, name }: UpdateCategoryProps) {
    const category = await prismaClient.category.findFirst({
      where: { id }
    });

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    const updatedCategory = await prismaClient.category.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        name: true,
        createdAt: true
      }
    });

    return updatedCategory;
  }
}

export { UpdateCategoryService }
