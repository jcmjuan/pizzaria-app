import prismaClient from "../../prisma/index"
import { recalculateOrderStatus } from "./RecalculateOrderStatus";

interface UpdateItemProps {
  item_id: string;
  amount: number;
}

class UpdateItemService {
  async execute({ item_id, amount }: UpdateItemProps) {
    const item = await prismaClient.item.findFirst({
      where: { id: item_id },
      include: {
        order: {
          select: { status: true }
        }
      }
    });

    if (!item) {
      throw new Error("Item não encontrado");
    }

    if (item.order.status !== "PENDING") {
      throw new Error("Não é possível alterar itens de um pedido cujo preparo já foi iniciado ou concluído");
    }

    if (amount <= 0) {
      await prismaClient.item.delete({
        where: { id: item_id }
      });

      await recalculateOrderStatus(item.order_id);

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
