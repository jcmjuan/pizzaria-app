"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Order } from "@/lib/types";
import { apiClient } from "@/lib/api";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { EyeIcon } from "lucide-react";
import { OrderModal } from "@/components/dashboard/ordere-modal";

interface OrdersProps {
  token: string;
}

export function Orders({ token }: OrdersProps) {
  const [loading, setLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [productionOrders, setProductionOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<null | string>(null);
  const prevPendingCount = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    function initAudio() {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      document.removeEventListener("click", initAudio);
    }
    document.addEventListener("click", initAudio);
    return () => document.removeEventListener("click", initAudio);
  }, []);

  function playBeep() {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 1000;
        osc.type = "sine";
        const startTime = ctx.currentTime + i * 0.5;
        gain.gain.setValueAtTime(0.8, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      }
    } catch {}
  }

  const fetchOrders = async () => {
    try {
      const [pending, production] = await Promise.all([
        apiClient<Order[]>("/orders?draft=false&status=PENDING", {
          method: "GET",
          cache: "no-store",
          token: token,
        }),
        apiClient<Order[]>("/orders?draft=false&status=IN_PRODUCTION", {
          method: "GET",
          cache: "no-store",
          token: token,
        }),
      ]);

      if (pending.length > prevPendingCount.current) {
        playBeep();
      }
      prevPendingCount.current = pending.length;

      setPendingOrders(pending);
      setProductionOrders(production);
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

    return () => {
      clearInterval(intervalId);
    };
  }, [token]);

  const calculateOrderTotal = (order: Order) => {
    if (!order.items) return 0;
    return order.items.reduce((total, item) => {
      return total + item.product.price * item.amount;
    }, 0);
  };

  const getItemStatusCount = (order: Order, status: string) => {
    if (!order.items) return 0;
    return order.items.filter((item) => item.status === status).length;
  };

  const renderOrderCard = (order: Order) => (
    <Card
      key={order.id}
      className="bg-app-card border-app-border text-white"
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg lg:text-xl font-bold">
            Mesa {order.table}
          </CardTitle>
          <Badge variant="secondary" className="text-xs select-none">
            {order.status === "PENDING" ? "novo" : "produção"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 mt-auto">
        <div>
          {order.items && order.items.length > 0 && (
            <div className="space-y-1">
              {order.items.slice(0, 3).map((item) => (
                <p
                  key={item.id}
                  className="text-xs sm:text-sm text-gray-300"
                >
                  <span className={
                    item.status === "PENDING" ? "text-yellow-400" :
                    item.status === "IN_PRODUCTION" ? "text-orange-400" :
                    item.status === "READY" ? "text-green-400" : ""
                  }>
                    ●
                  </span>{" "}
                  {item.amount}x {item.product.name}
                </p>
              ))}
              {order.items.length > 3 && (
                <p className="text-xs text-gray-500">
                  +{order.items.length - 3} itens...
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {getItemStatusCount(order, "PENDING") > 0 && (
            <Badge variant="outline" className="text-[10px] border-yellow-500/30 text-yellow-400">
              {getItemStatusCount(order, "PENDING")} novo
            </Badge>
          )}
          {getItemStatusCount(order, "IN_PRODUCTION") > 0 && (
            <Badge variant="outline" className="text-[10px] border-orange-500/30 text-orange-400">
              {getItemStatusCount(order, "IN_PRODUCTION")} produção
            </Badge>
          )}
          {getItemStatusCount(order, "READY") > 0 && (
            <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-400">
              {getItemStatusCount(order, "READY")} pronto
            </Badge>
          )}
          {getItemStatusCount(order, "CANCELED") > 0 && (
            <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-400">
              {getItemStatusCount(order, "CANCELED")} cancelado
            </Badge>
          )}
        </div>

        <div className="flex flex-col xl:flex-row items-center justify-between pt-4 border-t border-app-border gap-3">
          <div className="self-start">
            <p className="text-sm md:text-base text-gray-400">Total</p>
            <p className="text-base font-bold text-brand-primary">
              {formatPrice(calculateOrderTotal(order))}
            </p>
          </div>

          <Button
            size="sm"
            className="bg-brand-primary hover:bg-brand-primary w-full xl:w-auto"
            onClick={() => setSelectedOrder(order.id)}
          >
            <EyeIcon className="w-5 h-5" />
            Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Pedidos</h1>
          <p className="text-sm sm:text-base mt-1">
            Gerencie os pedidos da cozinha
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
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Novos Pedidos
            </h2>
            {pendingOrders.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhum pedido novo.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pendingOrders.map(renderOrderCard)}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              Em Produção
            </h2>
            {productionOrders.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhum pedido em produção.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {productionOrders.map(renderOrderCard)}
              </div>
            )}
          </div>
        </div>
      )}

      <OrderModal
        orderId={selectedOrder}
        onClose={async () => {
          setSelectedOrder(null);
          await fetchOrders();
        }}
        token={token}
      />
    </div>
  );
}
