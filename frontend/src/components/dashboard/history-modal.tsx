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

interface HistoryModalProps {
  orderId: string | null;
  onClose: () => Promise<void>;
  token: string;
}

export function HistoryModal({ onClose, orderId, token }: HistoryModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    if (!orderId) {
      setOrder(null);
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient<Order>(
        `/order/detail?order_id=${orderId}`,
        {
          method: "GET",
          token: token,
        }
      );

      setOrder(response);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setOrder(null);
    }
  }, [orderId]);

  const calculateTotal = () => {
    if (!order?.items) return 0;
    return order.items.reduce((total, item) => {
      return total + item.product.price * item.amount;
    }, 0);
  };

  return (
    <Dialog open={orderId !== null} onOpenChange={() => onClose()}>
      <DialogContent className="p-6 bg-app-card text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalhe do pedido
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Carregando...</p>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Mesa</p>
                <p className="text-lg font-semibold">Mesa {order.table}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Cliente</p>
                <p className="text-lg font-semibold">
                  {order.name || "Sem nome"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full font-medium text-xs ${order.status === "CANCELED" ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-500"}`}>
                  {order.status === "CANCELED" ? "Cancelado" : "Finalizado"}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Itens do pedido</h3>
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

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onClose()}
            className="w-full border-app-border hover:bg-transparent bg-transparent text-white hover:text-white"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
