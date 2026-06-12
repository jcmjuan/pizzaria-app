import prismaClient from "../../prisma/index";
import { recalculateOrderStatus } from "./RecalculateOrderStatus";

interface CloseOrderProps {
  order_id: string;
}

class CloseOrderService {
  async execute({ order_id }: CloseOrderProps) {
    const order = await prismaClient.order.findFirst({
      where: { id: order_id },
      include: { items: true },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    const allServedOrClosed = order.items.every(
      (item) => item.status === "SERVED" || item.status === "CLOSED"
    );

    if (!allServedOrClosed) {
      throw new Error(
        "Todos os itens precisam estar como servidos para encerrar o pedido"
      );
    }

    await prismaClient.item.updateMany({
      where: {
        order_id: order_id,
        status: "SERVED",
      },
      data: { status: "CLOSED" },
    });

    await recalculateOrderStatus(order_id);

    const updatedOrder = await prismaClient.order.findFirst({
      where: { id: order_id },
      select: {
        id: true,
        table: true,
        name: true,
        draft: true,
        status: true,
        user_id: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedOrder;
  }
}

export { CloseOrderService };
