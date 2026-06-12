import prismaClient from "../../prisma/index";

export async function recalculateOrderStatus(order_id: string) {
  const items = await prismaClient.item.findMany({
    where: { order_id },
    select: { status: true },
  });

  if (items.length === 0) {
    await prismaClient.order.update({
      where: { id: order_id },
      data: { status: "PENDING" },
    });
    return;
  }

  const statusSet = new Set(items.map((i) => i.status));

  if (statusSet.size === 1) {
    const singleStatus = items[0]!.status;
    await prismaClient.order.update({
      where: { id: order_id },
      data: { status: singleStatus },
    });
    return;
  }

  if (statusSet.has("PENDING")) {
    await prismaClient.order.update({
      where: { id: order_id },
      data: { status: "PENDING" },
    });
    return;
  }

  if (statusSet.has("IN_PRODUCTION")) {
    await prismaClient.order.update({
      where: { id: order_id },
      data: { status: "IN_PRODUCTION" },
    });
    return;
  }

  if (statusSet.has("READY")) {
    await prismaClient.order.update({
      where: { id: order_id },
      data: { status: "READY" },
    });
    return;
  }

  if (statusSet.has("SERVED")) {
    await prismaClient.order.update({
      where: { id: order_id },
      data: { status: "SERVED" },
    });
    return;
  }
}
