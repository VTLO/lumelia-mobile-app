import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { Colors, Spacing, Layout } from "../constants/theme";
import { shopifyService } from "../services/shopifyClient";
import { Product, ProductCategory } from "../types/Product";

interface CatalogScreenProps {
  route?: any;
  navigation?: any;
}

const CATEGORIES: ProductCategory[] = [
  "Tous",
  "Colliers",
  "Bagues",
  "Bracelets",
  "Boucles d'oreilles",
];

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  route,
  navigation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(
    route?.params?.initialCategory || "Tous"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const rawProducts = shopifyService.getProductsByCategory(selectedCategory);

  const filteredProducts = rawProducts
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.productType.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const handleProductPress = (product: Product) => {
    navigation.navigate("ProductDetail", { product });
  };

  return (
    <View style={styles.screen}>
      <Header
        title="CATALOGUE"
        subtitle="BIJOUX HYPOALLERGÉNIQUES"
        onCartPress={() => navigation.navigate("Cart")}
      />

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un collier, une bague..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills */}
      <View style={styles.categoryPillsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPills}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.pill,
                  isSelected && styles.pillSelected,
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.pillText,
                    isSelected && styles.pillTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Subheader with counter & sorting */}
      <View style={styles.subHeader}>
        <Text style={styles.resultCount}>
          {filteredProducts.length} pièce(s) trouvée(s)
        </Text>

        <TouchableOpacity
          style={styles.sortToggle}
          onPress={() => {
            if (sortBy === "featured") setSortBy("price-asc");
            else if (sortBy === "price-asc") setSortBy("price-desc");
            else setSortBy("featured");
          }}
        >
          <Text style={styles.sortToggleText}>
            Trier: {sortBy === "featured" ? "Vedettes" : sortBy === "price-asc" ? "Prix ↑" : "Prix ↓"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContent}
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💎</Text>
            <Text style={styles.emptyTitle}>Aucun bijou ne correspond</Text>
            <Text style={styles.emptyDesc}>
              Essayez une autre recherche ou réinitialisez les filtres.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProducts.map((p) => (
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    padding: 0,
  },
  clearSearch: {
    color: Colors.textMuted,
    fontSize: 14,
    padding: 4,
  },
  categoryPillsContainer: {
    marginTop: Spacing.sm,
  },
  categoryPills: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillSelected: {
    backgroundColor: Colors.obsidian,
    borderColor: Colors.obsidian,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  pillTextSelected: {
    color: "#FFFFFF",
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  resultCount: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "600",
  },
  sortToggle: {
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortToggleText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  gridContent: {
    paddingBottom: Spacing.xl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});
