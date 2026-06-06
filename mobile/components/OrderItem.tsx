import { QuantityControl } from "@/components/QuantityControl";
import { colors, fontSize, spacing } from "@/constants/theme";
import { Item } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { formatPrice } from "../utils/format";

interface OrderItemProps {
  item: Item;
  onRemove: (item_id: string) => Promise<void>;
  onIncrement: (item_id: string) => void;
  onDecrement: (item_id: string) => void;
  highlighted?: boolean;
}

export function OrderItem({
  item,
  onRemove,
  onIncrement,
  onDecrement,
  highlighted,
}: OrderItemProps) {
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (highlighted) {
      highlightAnim.setValue(1);
      Animated.timing(highlightAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }
  }, [highlighted]);

  const borderColor = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.borderColor, colors.green],
  });

  return (
    <Animated.View style={[styles.container, { borderColor }]}>
      <View style={styles.content}>
        <Text style={styles.productName}>{item.product?.name}</Text>
        <Text style={styles.productDetail}>
          {formatPrice(item.product.price * item.amount)}
        </Text>
      </View>

      <QuantityControl
        quantity={item.amount}
        onIncrement={() => onIncrement(item.id)}
        onDecrement={() => onDecrement(item.id)}
      />

      <Pressable style={styles.deleteButton} onPress={() => onRemove(item.id)}>
        <Feather name="trash" size={20} color={colors.primary} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundInput,
    borderRadius: 8,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.borderColor,
    gap: spacing.sm,
  },
  content: {
    flex: 1,
  },
  productName: {
    color: colors.primary,
    fontSize: fontSize.md,
    marginBottom: 4,
  },
  productDetail: {
    color: colors.gray,
  },
  deleteButton: {
    backgroundColor: colors.red,
    padding: 8,
    borderRadius: 4,
  },
});
