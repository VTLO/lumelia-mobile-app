import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { ParurePromoBanner } from "../components/ParurePromoBanner";
import { GuaranteesRow } from "../components/GuaranteesRow";
import { Colors, Spacing, Layout } from "../constants/theme";
import { shopifyService } from "../services/shopifyClient";
import { Product } from "../types/Product";

interface HomeScreenProps {
  navigation?: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [products] = useState<Product[]>(shopifyService.getProductsSync());
  const bestSellers = shopifyService.getBestSellers();

  const handleProductPress = (product: Product) => {
    navigation.navigate("ProductDetail", { product });
  };

  const categories = [
    { label: "Colliers", icon: "📿", query: "Colliers" },
    { label: "Bagues", icon: "💍", query: "Bagues" },
    { label: "Bracelets", icon: "✨", query: "Bracelets" },
    { label: "Boucles", icon: "💎", query: "Boucles d'oreilles" },
  ];

  return (
    <View style={styles.screen}>
      <Header
        onCartPress={() => navigation.navigate("Cart")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Text style={styles.heroPreTitle}>NOUVELLE COLLECTION 2026</Text>
          <Text style={styles.heroTitle}>Bijoux Résistants à la Vie</Text>
          <Text style={styles.heroSubtitle}>
            Acier 316L chirurgical & Placage PVD Or 18K. 100% Waterproof, ne noircit jamais.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => navigation.navigate("Catalog", { initialCategory: "Tous" })}
            activeOpacity={0.85}
          >
            <Text style={styles.heroButtonText}>Explorer la collection</Text>
          </TouchableOpacity>
        </View>

        {/* Promo Parure Banner (-15%) */}
        <ParurePromoBanner
          onPress={() => navigation.navigate("Parure")}
        />

        {/* Categories Pills */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionHeading}>CATÉGORIES</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryChip}
                onPress={() => navigation.navigate("Catalog", { initialCategory: cat.query })}
                activeOpacity={0.75}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Guarantees */}
        <GuaranteesRow />

        {/* Best-Sellers Grid */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionPre}>SÉLECTION EMBLÉMATIQUE</Text>
            <Text style={styles.sectionTitle}>Les Bestsellers</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Catalog")}>
            <Text style={styles.seeAllText}>Voir tout ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {bestSellers.slice(0, 4).map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onPress={() => handleProductPress(item)}
            />
          ))}
        </View>

        {/* Reviews Callout */}
        <View style={styles.reviewsBanner}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.reviewsScore}>4.9 / 5 sur Judge.me</Text>
          <Text style={styles.reviewsQuote}>
            « Les bijoux sont d'une qualité incroyable. Je les porte sous la douche tous les jours, l'or ne bouge absolument pas ! »
          </Text>
          <Text style={styles.reviewsAuthor}>— Sarah M. (Acheteuse Vérifiée)</Text>
        </View>
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
  heroCard: {
    backgroundColor: Colors.obsidian,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.lg,
    alignItems: "center",
  },
  heroPreTitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.primaryGold,
    fontWeight: "700",
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 12,
    color: "#D1D5DB",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  heroButton: {
    backgroundColor: Colors.primaryGold,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Layout.borderRadius.full,
  },
  heroButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  categoriesSection: {
    marginTop: Spacing.md,
  },
  sectionHeading: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "800",
    color: Colors.textSecondary,
    marginLeft: Spacing.md,
    marginBottom: Spacing.sm,
  },
  categoriesList: {
    paddingHorizontal: Spacing.md,
    gap: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Layout.shadow.card,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionPre: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "700",
    color: Colors.primaryGoldDark,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.obsidian,
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.primaryGoldDark,
    fontWeight: "600",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
  },
  reviewsBanner: {
    backgroundColor: Colors.secondaryChampagne,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    borderRadius: Layout.borderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.champagneBorder,
  },
  stars: {
    color: Colors.primaryGold,
    fontSize: 16,
    letterSpacing: 2,
  },
  reviewsScore: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.obsidian,
    marginTop: 2,
  },
  reviewsQuote: {
    fontSize: 11,
    fontStyle: "italic",
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 6,
  },
  reviewsAuthor: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.primaryGoldDark,
    marginTop: 6,
  },
});
