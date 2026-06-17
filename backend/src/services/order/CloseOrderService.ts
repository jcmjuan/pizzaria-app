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

interface CloseMultipleOrdersProps {
  order_ids: string[];
}

class CloseMultipleOrdersService {
  async execute({ order_ids }: CloseMultipleOrdersProps) {
    const orders = await prismaClient.order.findMany({
      where: { id: { in: order_ids } },
      include: { items: true },
    });

    if (orders.length === 0) {
      throw new Error("Nenhum pedido encontrado");
    }

    if (orders.length !== order_ids.length) {
      throw new Error("Alguns pedidos não foram encontrados");
    }

    for (const order of orders) {
      const allServedOrClosed = order.items.every(
        (item) => item.status === "SERVED" || item.status === "CLOSED"
      );

      if (!allServedOrClosed) {
        throw new Error(
          `Pedido ${order.id} possui itens que ainda não foram servidos`
        );
      }
    }

    const updatedOrders = await prismaClient.$transaction(async (tx) => {
      const results = [];

      for (const orderId of order_ids) {
        await tx.item.updateMany({
          where: { order_id: orderId, status: "SERVED" },
          data: { status: "CLOSED" },
        });

        await tx.order.update({
          where: { id: orderId },
          data: { status: "CLOSED" },
        });

        const updated = await tx.order.findFirst({
          where: { id: orderId },
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

        results.push(updated);
      }

      return results;
    });

    return updatedOrders;
  }
}

export { CloseMultipleOrdersService };
