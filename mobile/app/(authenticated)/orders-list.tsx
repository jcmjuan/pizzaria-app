import { Button } from "@/components/Button";
import { colors, fontSize, spacing, borderRadius } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { Order } from "@/types";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatPrice } from "../../utils/format";

type TabType = "pending" | "production" | "ready" | "served";

export default function OrdersList() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("production");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [servingOrderId, setServingOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await api.get<Order[]>("/orders", {
        params: { draft: "false" },
      });

      const filtered = response.data.filter(
        (o) => o.status !== "CLOSED" && o.status !== "CANCELED"
      );

      setOrders(filtered);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "pending") return o.status === "PENDING";
    if (activeTab === "production") return o.status === "IN_PRODUCTION";
    if (activeTab === "ready") return o.status === "READY";
    return o.status === "SERVED";
  });

  const handleServe = async (orderId: string) => {
    try {
      setServingOrderId(orderId);
      await api.put("/order/serve", { order_id: orderId });
      Alert.alert("Sucesso", "Pedido marcado como servido!");
      fetchOrders();
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Falha ao marcar como servido.");
    } finally {
      setServingOrderId(null);
    }
  };

  const handleAddMoreItems = (order: Order) => {
    router.push({
      pathname: "/(authenticated)/order",
      params: {
        table: order.table.toString(),
        order_id: order.id,
        name: order.name || "",
      },
    });
  };

  const tabs: { key: TabType; label: string; color: string }[] = [
    { key: "pending", label: "Enviados", color: "#FBBF24" },
    { key: "production", label: "Em Produção", color: colors.brand },
    { key: "ready", label: "Pronto", color: colors.green },
    { key: "served", label: "Servidos", color: "#3B82F6" },
  ];

  const calculateOrderTotal = (order: Order) => {
    if (!order.items) return 0;
    return order.items.reduce(
      (sum, item) => sum + item.product.price * item.amount,
      0
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" backgroundColor={colors.background} />

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && {
                borderBottomColor: tab.color,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && { color: tab.color },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            Nenhum pedido encontrado nesta aba.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: order }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Mesa {order.table}</Text>
                <Text style={styles.cardStatus}>
                  {order.status === "PENDING"
                    ? "Enviado"
                    : order.status === "IN_PRODUCTION"
                    ? "Em produção"
                    : order.status === "READY"
                    ? "Pronto"
                    : "Servido"}
                </Text>
              </View>

              {order.name ? (
                <Text style={styles.clientName}>{order.name}</Text>
              ) : null}

              <View style={styles.itemsList}>
                {order.items?.slice(0, 3).map((item) => (
                  <Text key={item.id} style={styles.itemText}>
                    {item.amount}x {item.product.name}
                  </Text>
                ))}
                {(order.items?.length || 0) > 3 && (
                  <Text style={styles.moreItems}>
                    +{order.items!.length - 3} itens...
                  </Text>
                )}
              </View>

              <Text style={styles.total}>
                Total: {formatPrice(calculateOrderTotal(order))}
              </Text>

              <View style={styles.cardActions}>
                {order.status === "READY" && (
                  <Button
                    title="Servir"
                    loading={servingOrderId === order.id}
                    onPress={() => handleServe(order.id)}
                  />
                )}
                {order.status === "PENDING" && (
                  <TouchableOpacity
                    style={styles.addMoreButton}
                    onPress={() => handleAddMoreItems(order)}
                  >
                    <Text style={styles.addMoreText}>
                      + Adicionar mais itens
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    marginHorizontal: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  tabText: {
    color: colors.gray,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.gray,
    fontSize: fontSize.md,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderColor,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: "bold",
  },
  cardStatus: {
    color: colors.gray,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  clientName: {
    color: colors.gray,
    fontSize: fontSize.sm,
  },
  itemsList: {
    gap: 2,
  },
  itemText: {
    color: colors.primary,
    fontSize: fontSize.md,
  },
  moreItems: {
    color: colors.gray,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  total: {
    color: colors.green,
    fontSize: fontSize.lg,
    fontWeight: "bold",
  },
  cardActions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  addMoreButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.brand,
  },
  addMoreText: {
    color: colors.brand,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
});
