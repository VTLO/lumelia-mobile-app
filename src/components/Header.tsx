import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, Spacing, Layout } from "../constants/theme";
import { useCartStore } from "../store/useCartStore";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onCartPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = "MAISON LUMÉLIA",
  subtitle = "PARIS • ACIER 316L & OR 18K",
  showBack = false,
  onBack,
  onCartPress,
}) => {
  const summary = useCartStore((state) => state.getSummary());

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.sparkleBox}>
            <Text style={styles.sparkleIcon}>✦</Text>
          </View>
        )}
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={onCartPress} style={styles.cartButton}>
          <Text style={styles.cartIcon}>🛍️</Text>
          {summary.itemsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{summary.itemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  left: {
    width: 44,
    alignItems: "flex-start",
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  right: {
    width: 44,
    alignItems: "flex-end",
  },
  iconButton: {
    padding: 4,
  },
  backText: {
    fontSize: 28,
    lineHeight: 28,
    color: Colors.textPrimary,
    fontWeight: "300",
  },
  sparkleBox: {
    padding: 4,
  },
  sparkleIcon: {
    fontSize: 16,
    color: Colors.primaryGold,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 2,
    color: Colors.obsidian,
  },
  subtitle: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: Colors.primaryGoldDark,
    marginTop: 2,
    fontWeight: "600",
  },
  cartButton: {
    position: "relative",
    padding: 6,
  },
  cartIcon: {
    fontSize: 20,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 0,
    backgroundColor: Colors.primaryGold,
    borderRadius: Layout.borderRadius.full,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
