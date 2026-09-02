import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { Colors, Spacing, Layout } from "../constants/theme";
import { useWishlistStore } from "../store/useWishlistStore";
import { shopifyService } from "../services/shopifyClient";
import { Product } from "../types/Product";

interface WishlistScreenProps {
  navigation?: any;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({ navigation }) => {
  const { favorites } = useWishlistStore();
  const allProducts = shopifyService.getProductsSync();
  const wishlistedProducts = allProducts.filter((p) => favorites.includes(p.id));

  const handleProductPress = (product: Product) => {
    navigation.navigate("ProductDetail", { product });
  };

  return (
    <View style={styles.screen}>
      <Header
        title="MES FAVORIS"
        subtitle={`${wishlistedProducts.length} COUP(S) DE CŒUR`}
        onCartPress={() => navigation.navigate("Cart")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {wishlistedProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyTitle}>Aucun coup de cœur</Text>
            <Text style={styles.emptyDesc}>
              Enregistrez vos créations préférées pour les retrouver à tout moment.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate("Catalog")}
              activeOpacity={0.85}
            >
              <Text style={styles.exploreBtnText}>Découvrir les bijoux</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {wishlistedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onPress={() => handleProductPress(p)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.obsidian,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.full,
  },
  exploreBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
