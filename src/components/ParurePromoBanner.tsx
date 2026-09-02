import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, Spacing, Layout } from "../constants/theme";
import { useCartStore } from "../store/useCartStore";

interface ParurePromoBannerProps {
  onPress: () => void;
}

export const ParurePromoBanner: React.FC<ParurePromoBannerProps> = ({ onPress }) => {
  const summary = useCartStore((state) => state.getSummary());
  const jewelryCount = Math.min(3, summary.itemsCount);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.topRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>✨ OFFRE EXCLUSIVE PARURE</Text>
        </View>
        <Text style={styles.discountBadge}>-15%</Text>
      </View>

      <Text style={styles.title}>Créez votre Parure sur-mesure</Text>
      <Text style={styles.subtitle}>
        -15% appliqués automatiquement dès 3 bijoux dans votre panier
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(jewelryCount / 3) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {jewelryCount === 0
            ? "Choisissez 3 bijoux pour économiser 15%"
            : jewelryCount < 3
            ? `${jewelryCount}/3 bijou(x) — plus que ${3 - jewelryCount} pour débloquer -15% !`
            : "🎉 Félicitations ! Vos -15% sont appliqués !"}
        </Text>
      </View>

      <View style={styles.button}>
        <Text style={styles.buttonText}>Composer ma Parure →</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondaryChampagne,
    borderColor: Colors.champagneBorder,
    borderWidth: 1.5,
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    ...Layout.shadow.card,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  tag: {
    backgroundColor: Colors.badgeParureBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    color: Colors.badgeParureText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  discountBadge: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.primaryGoldDark,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.obsidian,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#E5DEC9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primaryGold,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.primaryGoldDark,
    marginTop: 4,
  },
  button: {
    backgroundColor: Colors.obsidian,
    paddingVertical: 8,
    borderRadius: Layout.borderRadius.md,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
