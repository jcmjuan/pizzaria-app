import prismaClient from "../../prisma/index";

class ListCategoryService {
  async execute() {
    try{
      const categories = await prismaClient.category.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
  
      return categories;

    } catch(err){
      throw new Error("Falha ao buscar categorias")
    }
    
  }
}

export { ListCategoryService };


