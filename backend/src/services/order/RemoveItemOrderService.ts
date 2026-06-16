import prismaClient from "../../prisma/index";
import { recalculateOrderStatus } from "./RecalculateOrderStatus";

interface RemoveItemOrderServiceProps {
  item_id: string;
}

class RemoveItemOrderService {
  async execute({ item_id }: RemoveItemOrderServiceProps) {
    const itemExists = await prismaClient.item.findFirst({
      where: {
        id: item_id,
      },
      include: {
        order: {
          select: { status: true }
        }
      }
    });

    if (!itemExists) {
      throw new Error("Item não encontrado");
    }

    if (itemExists.order.status !== "PENDING") {
      throw new Error("Não é possível remover itens de um pedido cujo preparo já foi iniciado ou concluído");
    }

    const order_id = itemExists.order_id;

    await prismaClient.item.delete({
      where: {
        id: item_id,
      },
    });

    await recalculateOrderStatus(order_id);

    return { message: "Item removido com sucesso"}
  }

}

export { RemoveItemOrderService };

