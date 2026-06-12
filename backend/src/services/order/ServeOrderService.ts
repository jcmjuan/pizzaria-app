import prismaClient from "../../prisma/index";
import { recalculateOrderStatus } from "./RecalculateOrderStatus";

interface ServeOrderProps {
  order_id: string;
  item_ids?: string[];
}

class ServeOrderService {
  async execute({ order_id, item_ids }: ServeOrderProps) {
    const order = await prismaClient.order.findFirst({
      where: { id: order_id },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    if (item_ids && item_ids.length > 0) {
      await prismaClient.item.updateMany({
        where: {
          id: { in: item_ids },
          order_id: order_id,
          status: "READY",
        },
        data: { status: "SERVED" },
      });
    } else {
      await prismaClient.item.updateMany({
        where: {
          order_id: order_id,
          status: "READY",
        },
        data: { status: "SERVED" },
      });
    }

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
        items: {
          select: {
            id: true,
            amount: true,
            status: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return updatedOrder;
  }
}

export { ServeOrderService };
