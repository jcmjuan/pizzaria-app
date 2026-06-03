import prismaClient from "../../prisma/index";

interface RemoveItemOrderServiceProps {
  item_id: string;
}

class RemoveItemOrderService {
  async execute({ item_id }: RemoveItemOrderServiceProps) {
    const itemExists = await prismaClient.item.findFirst({   // <-- verifica se o item existe 
      where: {
        id: item_id,
      },
    });

    if (!itemExists) {
      throw new Error("Item não encontrado");
    }

    await prismaClient.item.delete({
      where: {
        id: item_id,
      },
    }); 

    return { message: "Item removido com sucesso"}
  }

}

export { RemoveItemOrderService };

