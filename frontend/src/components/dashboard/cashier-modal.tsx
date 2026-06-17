import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { closeOrderAction } from "@/actions/orders";
import { useRouter } from "next/navigation";

interface CashierModalProps {
  orders: Order[] | null;
  onClose: () => Promise<void>;
  token: string;
}

export function CashierModal({ onClose, orders, token }: CashierModalProps) {
  const [detailedOrders, setDetailedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (orders && orders.length > 0) {
      setLoading(true);
      Promise.all(
        orders.map(o =>
          apiClient<Order>(`/order/detail?order_id=${o.id}`, {
            method: "GET",
            token: token,
          })
        )
      )
        .then(setDetailedOrders)
        .catch(console.log)
        .finally(() => setLoading(false));
    } else {
      setDetailedOrders([]);
    }
  }, [orders]);

  const calculateTotal = () => {
    return detailedOrders.reduce((total, order) => {
      return total + (order.items?.reduce((itemTotal, item) => {
        return itemTotal + item.product.price * item.amount;
      }, 0) || 0);
    }, 0);
  };

  const handleCloseOrder = async () => {
    if (!orders || orders.length === 0) return;

    const orderIds = orders.map(o => o.id);
    const result = await closeOrderAction(orderIds);

    if (!result.success) {
      console.log(result.error);
      alert(result.error);
    }

    if (result.success) {
      router.refresh();
      onClose();
    }
  };

  return (
    <Dialog open={orders !== null} onOpenChange={() => onClose()}>
      <DialogContent className="p-6 bg-app-card text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Cobrança da mesa
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Carregando...</p>
          </div>
        ) : detailedOrders.length > 0 ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Mesa</p>
              <p className="text-lg font-semibold">Mesa {detailedOrders[0].table}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                {detailedOrders.length} pedido{detailedOrders.length > 1 ? 's' : ''}
              </h3>
              <div className="space-y-4">
                {detailedOrders.map(order => (
                  <div key={order.id}>
                    <h4 className="text-sm text-gray-400 mb-2">
                      Pedido {order.id.slice(0, 8)} — {order.name || "Sem nome"}
                    </h4>
                    <div className="space-y-3">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => {
                          const subtotal = item.product.price * item.amount;
                          return (
                            <div
                              key={item.id}
                              className="bg-app-background rounded-lg p-4 border border-app-border"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-base mb-1">
                                    {item.product.name}
                                  </h4>
                                  <p className="text-sm text-gray-400">
                                    {formatPrice(item.product.price)} x {item.amount}
                                  </p>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="font-semibold text-lg">
                                    {formatPrice(subtotal)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-400 text-center py-4">
                          Nenhum item no pedido
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-app-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold text-brand-primary">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onClose()}
            className="flex-1 border-app-border hover:bg-transparent bg-transparent text-white hover:text-white"
          >
            Fechar
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
            disabled={loading}
            onClick={handleCloseOrder}
          >
            Cobrar e encerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
