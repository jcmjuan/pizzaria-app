import prismaClient from "../../prisma";

interface ListOrdersServiceProps {
  draft?: string;
  status?: string;
  user_id?: string;
  table?: number;
  not_status?: string | string[];
}

class ListOrdersService {
  async execute({ draft, status, user_id, table, not_status }: ListOrdersServiceProps) {
    const where: any = {};

    if (draft !== undefined) {
      where.draft = draft === "true";
    }

    if (status !== undefined) {
      const statuses = status.split(",");
      where.status = statuses.length === 1 ? statuses[0] : { in: statuses };
    }

    if (user_id !== undefined) {
      where.user_id = user_id;
    }

    if (table !== undefined) {
      where.table = table;
    }

    if (not_status !== undefined) {
      const excluded = Array.isArray(not_status) ? not_status : [not_status];
      where.status = { ...(where.status || {}), not: excluded.length === 1 ? excluded[0] : { in: excluded } };
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
