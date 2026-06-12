import prismaClient from "../../prisma/index";

interface CreateOrderServiceProps {
  table: number;
  name: string;
  user_id: string;
}

class CreateOrderService {
  async execute({ table, name, user_id }: CreateOrderServiceProps) {
    try {
      const order = await prismaClient.order.create({
        data: {
          table: table,
          name: name ?? "",
          user_id: user_id,
        },
        select: {
          id: true,
          table: true,
          status: true,
          draft: true,
          name: true,
          user_id: true,
          createdAt: true,
        },
      });

      return order;
    } catch (err) {
      throw new Error("Falha ao criar pedido");
    }
  }
}

export { CreateOrderService };
