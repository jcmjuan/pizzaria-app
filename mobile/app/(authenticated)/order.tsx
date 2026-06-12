import { Button } from "@/components/Button";
import { OrderItem } from "@/components/OrderItem";
import { Select } from "@/components/Select";
import { colors, fontSize, spacing } from "@/constants/theme";
import api from "@/services/api";
import { Category, Item, Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { QuantityControl } from "../../components/QuantityControl";
import { formatPrice } from "../../utils/format";

export default function Order() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { order_id, table } = useLocalSearchParams<{
    order_id: string;
    table: string;
  }>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingAddItem, setLoadingAddItem] = useState(false);
  const [loadingExistingItems, setLoadingExistingItems] = useState(true);

  const [items, setItems] = useState<Item[]>([]);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (highlightedItemId) {
      const timer = setTimeout(() => setHighlightedItemId(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [highlightedItemId]);

  useEffect(() => {
    async function loadInitial() {
      await Promise.all([loadCategories(), loadExistingItems()]);
    }
    loadInitial();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadProducts(selectedCategory);
    } else {
      setProducts([]);
      setSelectedCategory("");
    }
  }, [selectedCategory]);

  async function loadExistingItems() {
    try {
      if (!order_id) return;
      const response = await api.get(`/order/detail`, {
        params: { order_id },
      });
      if (response.data?.items) {
        setItems(response.data.items);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingExistingItems(false);
    }
  }

  async function loadCategories() {
    try {
      const response = await api.get<Category[]>("/category");
      setCategories(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingCategories(false);
    }
  }

  async function loadProducts(categoryId: string) {
    try {
      setLoadingProducts(true);

      const response = await api.get<Product[]>("/category/product", {
        params: { category_id: categoryId },
      });

      setProducts(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleAddItem() {
    try {
      setLoadingAddItem(true);

      const response = await api.post<Item>("/order/add", {
        order_id: order_id,
        product_id: selectedProduct,
        amount: quantity,
      });

      const existingIndex = items.findIndex(
        (item) => item.product_id === selectedProduct
      );

      if (existingIndex >= 0) {
        const updatedItems = [...items];
        updatedItems[existingIndex] = response.data;
        setItems(updatedItems);
      } else {
        setItems([...items, response.data]);
      }

      setHighlightedItemId(response.data.id);
      setSelectedProduct("");
      setQuantity(1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAddItem(false);
    }
  }

  async function handleRemoveItem(item_id: string) {
    try {
      await api.delete("/order/remove", {
        params: { item_id: item_id },
      });

      const updateditems = items.filter((item) => item.id !== item_id);
      setItems(updateditems);

      Alert.alert("Item removido", "Seu item foi removido da mesa!");
    } catch (err) {
      console.log(err);
      Alert.alert("Atenção", "Erro ao remover item da mesa.");
    }
  }

  async function handleUpdateItemQuantity(
    item_id: string,
    delta: number
  ) {
    try {
      const item = items.find((i) => i.id === item_id);
      if (!item) return;

      const newAmount = item.amount + delta;

      if (newAmount <= 0) {
        await api.delete("/order/remove", {
          params: { item_id: item_id },
        });

        setItems((prev) => prev.filter((i) => i.id !== item_id));
        return;
      }

      const response = await api.put<Item>("/order/item", {
        item_id: item_id,
        amount: newAmount,
      });

      setItems((prev) =>
        prev.map((i) => (i.id === item_id ? response.data : i))
      );
    } catch (err) {
      console.log(err);
    }
  }

  function handleAdvance() {
    if (items.length === 0) {
      return;
    }

    router.push({
      pathname: "/(authenticated)/finish",
      params: { order_id: order_id, table: table },
    });
  }

  if (loadingCategories || loadingExistingItems) {
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
          <Text style={styles.headerTitle}>Mesa {table}</Text>

          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View style={styles.addSection}>
          <Select
            label="Categorias"
            placeholder="Selecione a categoria..."
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            selectedValue={selectedCategory}
            onValueChange={setSelectedCategory}
          />

          {loadingProducts ? (
            <ActivityIndicator size="small" color={colors.brand} />
          ) : (
            selectedCategory && (
              <Select
                placeholder="Selecione um produto..."
                options={products.map((product) => ({
                  label: product.name,
                  value: product.id,
                }))}
                selectedValue={selectedProduct}
                onValueChange={setSelectedProduct}
              />
            )
          )}

          {selectedProduct && (
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantidade</Text>
              <QuantityControl
                quantity={quantity}
                onIncrement={() => setQuantity((quantity) => quantity + 1)}
                onDecrement={() => {
                  if (quantity <= 1) {
                    setQuantity(1);
                    return;
                  }

                  setQuantity((quantity) => quantity - 1);
                }}
              />
            </View>
          )}

          {selectedProduct && (
            <Button
              title="Adicionar"
              onPress={handleAddItem}
              loading={loadingAddItem}
            />
          )}
        </View>

        {items.length > 0 && (
          <View style={styles.itemsSection}>
            <Text style={styles.itemsTitle}>Itens adicionados ({items.length})</Text>
            {items.map((item) => (
              <OrderItem
                item={item}
                key={item.id}
                highlighted={item.id === highlightedItemId}
                onRemove={handleRemoveItem}
                onIncrement={(id) => handleUpdateItemQuantity(id, 1)}
                onDecrement={(id) => handleUpdateItemQuantity(id, -1)}
              />
            ))}
          </View>
        )}

        {items.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                {items.reduce((sum, item) => sum + item.amount, 0)} itens
              </Text>
              <Text style={styles.summaryTotal}>
                {formatPrice(
                  items.reduce(
                    (sum, item) => sum + item.product.price * item.amount,
                    0
                  )
                )}
              </Text>
            </View>
            <Button title="Avançar" onPress={handleAdvance} />
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
  headerTitle: {
    fontSize: fontSize.xl,
    color: colors.primary,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: colors.red,
    padding: spacing.sm,
    borderRadius: 8,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: 14,
  },
  addSection: {
    backgroundColor: colors.backgroundInput,
    borderRadius: 8,
    padding: spacing.md,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.brand,
  },
  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  quantityLabel: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: "bold",
  },
  itemsSection: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  itemsTitle: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: fontSize.lg,
  },
  footer: {
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.backgroundInput,
    borderRadius: 8,
    padding: spacing.md,
  },
  summaryText: {
    color: colors.gray,
    fontSize: fontSize.md,
  },
  summaryTotal: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: "bold",
  },
});
