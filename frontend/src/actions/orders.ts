"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function finishOrderAction(orderId: string, itemIds?: string[]) {
  if (!orderId) {
    return { success: false, error: "Falha ao finalizar o pedido" };
  }

  try {
    const token = await getToken();

    if (!token) {
      return { success: false, error: "Falha ao finalizar o pedido" };
    }

    const data: any = {
      order_id: orderId,
    };

    if (itemIds && itemIds.length > 0) {
      data.item_ids = itemIds;
    }

    await apiClient("/order/finish", {
      method: "PUT",
      body: JSON.stringify(data),
      token: token,
    });

    revalidatePath("/dashboard");

    return { success: true, error: "" };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Falha ao finalizar o pedido" };
  }
}

export async function startOrderAction(orderId: string, itemIds?: string[]) {
  if (!orderId) {
    return { success: false, error: "Falha ao iniciar o preparo" };
  }

  try {
    const token = await getToken();

    if (!token) {
      return { success: false, error: "Falha ao iniciar o preparo" };
    }

    const data: any = {
      order_id: orderId,
    };

    if (itemIds && itemIds.length > 0) {
      data.item_ids = itemIds;
    }

    await apiClient("/order/start", {
      method: "PUT",
      body: JSON.stringify(data),
      token: token,
    });

    revalidatePath("/dashboard");

    return { success: true, error: "" };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Falha ao iniciar o preparo" };
  }
}

export async function closeOrderAction(orderId: string) {
  if (!orderId) {
    return { success: false, error: "Falha ao encerrar o pedido" };
  }

  try {
    const token = await getToken();

    if (!token) {
      return { success: false, error: "Falha ao encerrar o pedido" };
    }

    const data = {
      order_id: orderId,
    };

    await apiClient("/order/close", {
      method: "PUT",
      body: JSON.stringify(data),
      token: token,
    });

    revalidatePath("/dashboard/cashier");

    return { success: true, error: "" };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Falha ao encerrar o pedido" };
  }
}
