import prismaClient from "../../prisma";

interface ListOrdersServiceProps {
  draft?: string;
  status?: string;
}

class ListOrdersService {
  async execute({ draft, status }: ListOrdersServiceProps) {
    const where: any = {};

    if (draft !== undefined) {
      where.draft = draft === "true";
    }

    if (status !== undefined) {
      where.status = status;
    }

    const orders = await prismaClient.order.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        table: true,
        name: true,
        draft: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            amount: true,
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

    return orders;
  }
}

export { ListOrdersService }
