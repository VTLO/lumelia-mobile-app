import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Product } from "../types/Product";
import { Colors, Spacing, Layout } from "../constants/theme";
import { useWishlistStore } from "../store/useWishlistStore";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  width?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DEFAULT_CARD_WIDTH = (SCREEN_WIDTH - Spacing.md * 3) / 2;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  width = DEFAULT_CARD_WIDTH,
}) => {
  const { toggleFavorite, isFavorite } = useWishlistStore();
  const favorited = isFavorite(product.id);

  return (
    <TouchableOpacity
      style={[styles.container, { width }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badges */}
        <View style={styles.badgesContainer}>
          {product.isBestSeller && (
            <View style={styles.bestSellerBadge}>
              <Text style={styles.bestSellerText}>BEST SELLER</Text>
            </View>
          )}
          {product.isWaterproof && (
            <View style={styles.waterproofBadge}>
              <Text style={styles.waterproofText}>WATERPROOF</Text>
            </View>
          )}
        </View>

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => toggleFavorite(product.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.favIcon}>{favorited ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.info}>
        <Text style={styles.category}>{product.productType.toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{product.price.toFixed(2)} €</Text>
          {product.rating ? (
            <View style={styles.ratingBox}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
          ) : null}
        </View>

        {/* Material Tag */}
        <Text style={styles.materialTag}>Acier 316L & Or 18K</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Layout.shadow.card,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F7F5F0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgesContainer: {
    position: "absolute",
    top: 6,
    left: 6,
    flexDirection: "column",
    gap: 4,
  },
  bestSellerBadge: {
    backgroundColor: Colors.primaryGold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestSellerText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  waterproofBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  waterproofText: {
    color: Colors.waterproofCyan,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  favButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: Layout.borderRadius.full,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  favIcon: {
    fontSize: 14,
  },
  info: {
    padding: Spacing.sm,
  },
  category: {
    fontSize: 9,
    letterSpacing: 1,
    color: Colors.textMuted,
    fontWeight: "600",
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textPrimary,
    lineHeight: 16,
    minHeight: 32,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primaryGoldDark,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    color: Colors.primaryGold,
    fontSize: 11,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  materialTag: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  },
});
