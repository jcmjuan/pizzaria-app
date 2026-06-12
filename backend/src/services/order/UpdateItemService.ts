import prismaClient from "../../prisma/index"

interface UpdateItemProps {
  item_id: string;
  amount: number;
}

class UpdateItemService {
  async execute({ item_id, amount }: UpdateItemProps) {
    const item = await prismaClient.item.findFirst({
      where: { id: item_id }
    });

    if (!item) {
      throw new Error("Item não encontrado");
    }

    if (amount <= 0) {
      await prismaClient.item.delete({
        where: { id: item_id }
      });

      return { message: "Item removido" };
    }

    const updatedItem = await prismaClient.item.update({
      where: { id: item_id },
      data: { amount },
      select: {
        id: true,
        amount: true,
        status: true,
        order_id: true,
        product_id: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            banner: true,
          }
        }
      }
    });

    return updatedItem;
  }
}

export { UpdateItemService }
