import prismaClient from "../../prisma/index"

interface FinishOrderProps {
  order_id: string;
}

class FinishOrderService {
  async execute({ order_id }: FinishOrderProps) {
    const order = await prismaClient.order.findFirst({
      where: { id: order_id }
    });

    if (!order) {
      throw new Error("Falha ao finalizar pedido");
    }

    const updatedOrder = await prismaClient.order.update({
      where: { id: order_id },
      data: {
        status: "READY",
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

export { FinishOrderService }
