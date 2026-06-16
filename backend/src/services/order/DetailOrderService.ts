import prismaClient from "../../prisma";

interface DetailOrderServiceProps {
  order_id: string;
}

class DetailOrderService {
  async execute({ order_id }: DetailOrderServiceProps) {
    
    const order = await prismaClient.order.findFirst({
      where: {
        id: order_id,
      },
      select: {
        id: true,
        table: true,
        name: true,
        draft: true,
        status: true,
        user_id: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            amount: true,
            status: true,
            order_id: true,
            product_id: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
                banner: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order não encontrada");
    }

    return order;
  }
}

export { DetailOrderService };

