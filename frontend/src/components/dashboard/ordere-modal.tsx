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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { finishOrderAction, startOrderAction, cancelOrderAction } from "@/actions/orders";
import { useRouter } from "next/navigation";

interface OrderModalProps {
  orderId: string | null;
  onClose: () => Promise<void>;
  token: string;
}

export function OrderModal({ onClose, orderId, token }: OrderModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"start" | "finish" | "cancel" | null>(null);
  const router = useRouter();

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
    async function loadOrders() {
      await fetchOrder();
    }

    loadOrders();
  }, [orderId]);

  const calculateTotal = () => {
    if (!order?.items) return 0;
    return order.items.reduce((total, item) => {
      return total + item.product.price * item.amount;
    }, 0);
  };

  const executeStartOrder = async () => {
    if (!orderId) return;
    setError(null);

    const result = await startOrderAction(orderId);

    if (!result.success) {
      setError(result.error);
    }

    if (result.success) {
      router.refresh();
      onClose();
    }
  };

  const executeFinishOrder = async () => {
    if (!orderId) return;
    setError(null);

    const result = await finishOrderAction(orderId);

    if (!result.success) {
      setError(result.error);
    }

    if (result.success) {
      router.refresh();
      onClose();
    }
  };

  const executeCancelOrder = async () => {
    if (!orderId) return;
    setError(null);

    const result = await cancelOrderAction(orderId);

    if (!result.success) {
      setError(result.error);
    }

    if (result.success) {
      router.refresh();
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (pendingAction === "start") await executeStartOrder();
    if (pendingAction === "finish") await executeFinishOrder();
    if (pendingAction === "cancel") await executeCancelOrder();
    setPendingAction(null);
  };

  const statusLabel = () => {
    if (!order) return { text: "", color: "" };
    switch (order.status) {
      case "PENDING":
        return { text: "Novo", color: "bg-yellow-500/20 text-yellow-500" };
      case "IN_PRODUCTION":
        return { text: "Em produção", color: "bg-orange-500/20 text-orange-500" };
      case "READY":
        return { text: "Pronto", color: "bg-green-500/20 text-green-500" };
      case "SERVED":
        return { text: "Servido", color: "bg-blue-500/20 text-blue-500" };
      case "CLOSED":
        return { text: "Finalizado", color: "bg-gray-500/20 text-gray-400" };
      case "CANCELED":
        return { text: "Cancelado", color: "bg-red-500/20 text-red-500" };
    }
  };

  const itemStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return { text: "Novo", color: "text-yellow-400" };
      case "IN_PRODUCTION": return { text: "Produção", color: "text-orange-400" };
      case "READY": return { text: "Pronto", color: "text-green-400" };
      case "SERVED": return { text: "Servido", color: "text-blue-400" };
      case "CLOSED": return { text: "Fechado", color: "text-gray-400" };
      case "CANCELED": return { text: "Cancelado", color: "text-red-400" };
      default: return { text: status, color: "text-gray-400" };
    }
  };

  const statusInfo = statusLabel();

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
            <div className="grid grid-cols-2 gap-4">
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
                <span className={`inline-block px-3 py-1 rounded-full font-medium text-xs ${statusInfo?.color || ""}`}>
                  {statusInfo?.text || ""}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Itens do pedido</h3>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => {
                    const subtotal = item.product.price * item.amount;
                    const itemStatus = itemStatusLabel(item.status);
                    return (
                      <div
                        key={item.id}
                        className="bg-app-background rounded-lg p-4 border border-app-border"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-base">
                                {item.product.name}
                              </h4>
                              <span className={`text-[10px] font-medium ${itemStatus.color}`}>
                                ({itemStatus.text})
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">
                              {item.product.description}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                              {formatPrice(item.product.price)} x {item.amount}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm text-gray-400 mb-1">
                              Qtd: {item.amount}
                            </p>
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

        <DialogFooter className="flex gap-3 sm:gap-3">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md w-full">{error}</p>
          )}
          <Button
            variant="outline"
            onClick={() => onClose()}
            className="flex-1 border-app-border hover:bg-transparent bg-transparent text-white hover:text-white"
          >
            Fechar
          </Button>
          {(order?.status === "PENDING" || order?.status === "IN_PRODUCTION") && (
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
              disabled={loading}
              onClick={() => setPendingAction("cancel")}
            >
              Cancelar Pedido
            </Button>
          )}
          {order?.status === "PENDING" && (
            <Button
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
              disabled={loading}
              onClick={() => setPendingAction("start")}
            >
              Iniciar Preparo
            </Button>
          )}
          {order?.status === "IN_PRODUCTION" && (
            <Button
              className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold"
              disabled={loading}
              onClick={() => setPendingAction("finish")}
            >
              Finalizar (Enviar p/ garçom)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={pendingAction !== null} onOpenChange={() => setPendingAction(null)}>
        <AlertDialogContent className="bg-app-card text-white border-app-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === "start" && "Tem certeza que deseja iniciar o preparo deste pedido?"}
              {pendingAction === "finish" && "Tem certeza que deseja finalizar e enviar para o garçom?"}
              {pendingAction === "cancel" && "Tem certeza que deseja cancelar este pedido?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-app-border text-white hover:bg-transparent hover:text-white">
              Fechar
            </AlertDialogCancel>
            <AlertDialogPrimitive.Action asChild>
              <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                Confirmar
              </Button>
            </AlertDialogPrimitive.Action>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
