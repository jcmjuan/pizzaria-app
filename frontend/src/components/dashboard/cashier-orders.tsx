"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Order } from "@/lib/types";
import { apiClient } from "@/lib/api";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { EyeIcon } from "lucide-react";
import { CashierModal } from "@/components/dashboard/cashier-modal";

interface CashierOrdersProps {
  token: string;
}

export function CashierOrders({ token }: CashierOrdersProps) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTableOrders, setSelectedTableOrders] = useState<Order[] | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await apiClient<Order[]>("/orders?draft=false&status=SERVED", {
        method: "GET",
        cache: "no-store",
        token: token,
      });

      setOrders(response);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 2000);
    return () => clearInterval(intervalId);
  }, [token]);

  const calculateOrderTotal = (order: Order) => {
    if (!order.items) return 0;
    return order.items.reduce((total, item) => {
      return total + item.product.price * item.amount;
    }, 0);
  };

  const groupedByTable = orders.reduce((acc, order) => {
    const tableKey = order.table;
    if (!acc[tableKey]) {
      acc[tableKey] = [];
    }
    acc[tableKey].push(order);
    return acc;
  }, {} as Record<number, Order[]>);

  const calculateTableTotal = (tableOrders: Order[]) => {
    return tableOrders.reduce((total, order) => {
      return total + calculateOrderTotal(order);
    }, 0);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Caixa</h1>
          <p className="text-sm sm:text-base mt-1">
            Pedidos servidos. Prontos para fechamento da conta.
          </p>
        </div>

        <Button
          className="bg-brand-primary text-white hover:bg-brand-primary"
          onClick={fetchOrders}
        >
          <RefreshCcw className="w-5 h-5" />
        </Button>
      </div>

      {loading ? (
        <div>
          <p className="text-center text-gray-300">Carregando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div>
          <p className="text-center text-gray-300">
            Nenhum pedido servido para fechamento da mesa.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupedByTable)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([tableNum, tableOrders]) => (
              <Card
                key={tableNum}
                className="bg-app-card border-app-border text-white"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg lg:text-xl font-bold">
                      Mesa {tableNum}
                    </CardTitle>
                    <Badge variant="default" className="bg-yellow-500/20 text-yellow-500 text-xs">
                      {tableOrders.length} pedido{tableOrders.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 mt-auto">
                  {tableOrders.map(order => (
                    <div key={order.id} className="bg-app-background rounded p-2 border border-app-border">
                      <p className="text-xs text-gray-400">
                        Pedido {order.id.slice(0, 8)} — {order.items?.length || 0} itens
                      </p>
                    </div>
                  ))}

                  <div className="flex flex-col items-end justify-between pt-4 border-t border-app-border gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-base font-bold text-brand-primary">
                        {formatPrice(calculateTableTotal(tableOrders))}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="bg-brand-primary hover:bg-brand-primary"
                      onClick={() => setSelectedTableOrders(tableOrders)}
                    >
                      <EyeIcon className="w-5 h-5" />
                      Fechar mesa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>
      )}

      <CashierModal
        orders={selectedTableOrders}
        onClose={async () => {
          setSelectedTableOrders(null);
          await fetchOrders();
        }}
        token={token}
      />
    </div>
  );
}
