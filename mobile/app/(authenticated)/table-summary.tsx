import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "@/services/api";
import { Order } from "@/types";
import { colors, fontSize, spacing } from "@/constants/theme";
import { formatPrice } from "../../utils/format";
import { Ionicons } from "@expo/vector-icons";

export default function TableSummary() {
  const { table } = useLocalSearchParams<{ table: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTableOrders();
  }, []);

  async function loadTableOrders() {
    try {
      const response = await api.get<Order[]>(
        `/order/table-orders?table=${table}`
      );
      setOrders(response.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Falha ao carregar pedidos da mesa");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateNewOrder() {
    try {
      setCreating(true);
      const response = await api.post<Order>("/order", { table: Number(table) });
      router.push({
        pathname: "/(authenticated)/order",
        params: { table: table, order_id: response.data.id, name: existingName },
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Falha ao criar novo pedido");
    } finally {
      setCreating(false);
    }
  }

  function handleAddToOrder(orderId: string) {
    router.push({
      pathname: "/(authenticated)/order",
      params: { table: table, order_id: orderId, name: existingName },
    });
  }

  function calculateOrderTotal(order: Order) {
    if (!order.items) return 0;
    return order.items.reduce(
      (total, item) => total + item.product.price * item.amount,
      0
    );
  }

  const totalMesa = orders.reduce(
    (sum, order) => sum + calculateOrderTotal(order),
    0
  );

  const draftOrder = orders.find((o) => o.draft && o.status === "PENDING");
  const existingName = orders.find((o) => o.name)?.name || "";

  function getStatusLabel(status: string) {
    switch (status) {
      case "PENDING":
        return "Pendente";
      case "IN_PRODUCTION":
        return "Em Produção";
      case "READY":
        return "Pronto";
      case "SERVED":
        return "Servido";
      case "CANCELED":
        return "Cancelado";
      default:
        return status;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "PENDING":
        return "#FBBF24";
      case "IN_PRODUCTION":
        return "#3B82F6";
      case "READY":
        return "#10B981";
      case "SERVED":
        return "#8B5CF6";
      case "CANCELED":
        return "#EF4444";
      default:
        return colors.gray;
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mesa {table}</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <Text style={styles.sectionTitle}>Pedidos abertos</Text>

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum pedido aberto</Text>
          </View>
        ) : (
          orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => handleAddToOrder(order.id)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>
                  Pedido #{order.id.slice(0, 8)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.status) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(order.status) },
                    ]}
                  >
                    {getStatusLabel(order.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <Text style={styles.orderItems}>
                  {order.items?.length || 0} item
                  {(order.items?.length || 0) !== 1 ? "s" : ""}
                </Text>
                <Text style={styles.orderTotal}>
                  {formatPrice(calculateOrderTotal(order))}
                </Text>
              </View>

              {order.draft && order.status === "PENDING" && (
                <View style={styles.draftBadge}>
                  <Text style={styles.draftText}>Rascunho</Text>
                </View>
              )}

              {order.draft && order.status === "PENDING" && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddToOrder(order.id)}
                >
                  <Text style={styles.addButtonText}>Adicionar itens</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={[styles.newOrderButton, creating && styles.disabledButton]}
          onPress={handleCreateNewOrder}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.newOrderButtonText}>+ Criar novo pedido</Text>
          )}
        </TouchableOpacity>

        {orders.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total da mesa</Text>
            <Text style={styles.totalValue}>{formatPrice(totalMesa)}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: colors.red,
    padding: spacing.sm,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    color: colors.primary,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: colors.gray,
    fontSize: fontSize.md,
  },
  orderCard: {
    backgroundColor: colors.backgroundInput,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  orderId: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  orderItems: {
    color: colors.gray,
    fontSize: fontSize.sm,
  },
  orderTotal: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: "bold",
  },
  draftBadge: {
    backgroundColor: "#FBBF2420",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
  },
  draftText: {
    color: "#FBBF24",
    fontSize: fontSize.sm,
  },
  addButton: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 4,
    alignItems: "center",
  },
  addButtonText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  newOrderButton: {
    backgroundColor: colors.backgroundInput,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.brand,
    marginTop: spacing.md,
  },
  disabledButton: {
    opacity: 0.6,
  },
  newOrderButtonText: {
    color: colors.brand,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.backgroundInput,
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  totalLabel: {
    color: colors.gray,
    fontSize: fontSize.md,
  },
  totalValue: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: "bold",
  },
});
