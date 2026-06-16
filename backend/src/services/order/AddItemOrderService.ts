import prismaClient from "../../prisma/index"

interface ItemProps {
  order_id: string;
  product_id: string;
  amount: number;
}

class AddItemOrderService {
  async execute({ amount, order_id, product_id }: ItemProps) {
    const orderExists = await prismaClient.order.findFirst({
      where: { id: order_id },
      select: { id: true, status: true }
    });

    if (!orderExists) {
      throw new Error("Order não encontrado");
    }

    if (orderExists.status !== "PENDING") {
      throw new Error("Não é possível adicionar itens a um pedido cujo preparo já foi iniciado ou concluído");
    }

    const productExists = await prismaClient.product.findFirst({
      where: {
        id: product_id,
        disabled: false,
      },
      select: { id: true }
    });

    if (!productExists) {
      throw new Error("Produto não encontrado");
    }

    const existingItem = await prismaClient.item.findFirst({
      where: {
        order_id: order_id,
        product_id: product_id,
      },
      select: { id: true, amount: true }
    });

    if (existingItem) {
      const item = await prismaClient.item.update({
        where: { id: existingItem.id },
        data: {
          amount: existingItem.amount + amount,
          status: "PENDING",
        },
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

      return item;
    }

    const item = await prismaClient.item.create({
      data: {
        order_id: order_id,
        product_id: product_id,
        amount: amount
      },
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

    return item;
  }
}

export { AddItemOrderService }
