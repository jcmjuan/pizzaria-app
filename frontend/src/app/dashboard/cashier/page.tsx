import { CashierOrders } from "@/components/dashboard/cashier-orders";
import { getToken } from "@/lib/auth";

export default async function Cashier() {
  const token = await getToken();

  return <CashierOrders token={token!} />;
}
