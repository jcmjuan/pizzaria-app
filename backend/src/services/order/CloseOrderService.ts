import prismaClient from "../../prisma/index"

interface CloseOrderProps {
  order_id: string;
}

class CloseOrderService {
  async execute({ order_id }: CloseOrderProps) {
    const order = await prismaClient.order.findFirst({
      where: { id: order_id }
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    if (order.status !== "READY") {
      throw new Error("Pedido precisa estar como pronto para ser encerrado");
    }

    const updatedOrder = await prismaClient.order.update({
      where: { id: order_id },
      data: {
        status: "CLOSED",
      },
      select: {
        id: true,
        table: true,
        name: true,
        draft: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return updatedOrder;
  }
}

export { CloseOrderService }
