import prismaClient from "../../prisma/index";

interface CancelOrderProps {
  order_id: string;
  cancelReason?: string;
}

class CancelOrderService {
  async execute({ order_id, cancelReason }: CancelOrderProps) {
    const order = await prismaClient.order.findFirst({
      where: { id: order_id },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    if (order.status === "SERVED" || order.status === "CLOSED") {
      throw new Error("Não é possível cancelar um pedido já servido ou finalizado");
    }

    if (order.status === "CANCELED") {
      throw new Error("Pedido já foi cancelado");
    }

    await prismaClient.order.update({
      where: { id: order_id },
      data: { status: "CANCELED", cancelReason: cancelReason || null },
    });

    await prismaClient.item.updateMany({
      where: { order_id: order_id },
      data: { status: "CANCELED" },
    });

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

export { CancelOrderService };
