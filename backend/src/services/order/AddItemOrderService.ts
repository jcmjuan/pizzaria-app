import prismaClient from "../../prisma/index"

interface ItemProps {
  order_id: string;
  product_id: string;
  amount: number;
}

class AddItemOrderService {
  async execute({ amount, order_id, product_id }: ItemProps) {
    const orderExists = await prismaClient.order.findFirst({
      where: { id: order_id }
    });

    if (!orderExists) {
      throw new Error("Order não encontrado");
    }

    const productExists = await prismaClient.product.findFirst({
      where: {
        id: product_id,
        disabled: false,
      }
    });

    if (!productExists) {
      throw new Error("Produto não encontrado");
    }

    const existingItem = await prismaClient.item.findFirst({
      where: {
        order_id: order_id,
        product_id: product_id,
      }
    });

    if (existingItem) {
      const item = await prismaClient.item.update({
        where: { id: existingItem.id },
        data: {
          amount: existingItem.amount + amount,
        },
        select: {
          id: true,
          amount: true,
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
