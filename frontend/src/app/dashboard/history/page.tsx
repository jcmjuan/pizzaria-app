import { HistoryOrders } from "@/components/dashboard/history-orders";
import { getToken } from "@/lib/auth";

export default async function History() {
  const token = await getToken();

  return <HistoryOrders token={token!} />;
}
