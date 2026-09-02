import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Header } from "../components/Header";
import { GuaranteesRow } from "../components/GuaranteesRow";
import { Colors, Spacing, Layout } from "../constants/theme";
import { Product, JewelryFinish, ProductVariant } from "../types/Product";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";

interface ProductDetailScreenProps {
  route?: any;
  navigation?: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const product: Product = route?.params?.product || require("../services/catalogData").CATALOG_PRODUCTS[0];
  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useWishlistStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState<JewelryFinish>(
    product.availableFinishes[0] || "PVD Or 18K"
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.availableSizes ? product.availableSizes[0] : undefined
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Find matching variant
  const currentVariant = product.variants.find((v) => {
    const matchFinish = v.finish === selectedFinish || !v.finish;
    const matchSize = selectedSize ? v.size === selectedSize : true;
    return matchFinish && matchSize;
  }) || product.variants[0];

  const price = currentVariant ? currentVariant.price : product.price;
  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    addItem(product, currentVariant, selectedFinish, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <View style={styles.screen}>
      <Header
        showBack
        onBack={() => navigation.goBack()}
        onCartPress={() => navigation.navigate("Cart")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Gallery Carousel */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setActiveImageIndex(slide);
            }}
            scrollEventThrottle={16}
          >
            {product.images.map((imgUrl, idx) => (
              <Image
                key={idx}
                source={{ uri: imgUrl }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          {product.images.length > 1 && (
            <View style={styles.dotsContainer}>
              {product.images.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    activeImageIndex === idx && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Badges Overlay */}
          <View style={styles.badgesOverlay}>
            <View style={styles.waterproofPill}>
              <Text style={styles.waterproofText}>💧 100% WATERPROOF</Text>
            </View>
            <View style={styles.steelPill}>
              <Text style={styles.steelText}>🛡️ ACIER 316L</Text>
            </View>
          </View>

          {/* Favorite Toggle */}
          <TouchableOpacity
            style={styles.favFloatingButton}
            onPress={() => toggleFavorite(product.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.favFloatingIcon}>{favorited ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>

        {/* Product Details Section */}
        <View style={styles.contentContainer}>
          <Text style={styles.categoryName}>{product.productType.toUpperCase()}</Text>
          <Text style={styles.productTitle}>{product.title}</Text>

          {/* Price & Reviews */}
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{price.toFixed(2)} €</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.starsText}>★★★★★</Text>
              <Text style={styles.ratingScore}>{product.rating} ({product.reviewCount} avis)</Text>
            </View>
          </View>

          {/* Parure Reminder */}
          <TouchableOpacity
            style={styles.parureCallout}
            onPress={() => navigation.navigate("Parure")}
            activeOpacity={0.85}
          >
            <Text style={styles.parureIcon}>✨</Text>
            <View style={styles.parureTextContainer}>
              <Text style={styles.parureTitle}>Inclus dans l'Offre Parure (-15%)</Text>
              <Text style={styles.parureDesc}>
                Assemblez 3 bijoux et bénéficiez de -15% automatique dans le panier.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Finish Selection */}
          {product.availableFinishes.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={styles.optionLabel}>
                FINITION : <Text style={styles.optionValue}>{selectedFinish}</Text>
              </Text>
              <View style={styles.finishOptions}>
                {product.availableFinishes.map((finish) => {
                  const isSelected = selectedFinish === finish;
                  return (
                    <TouchableOpacity
                      key={finish}
                      style={[
                        styles.finishButton,
                        isSelected && styles.finishButtonSelected,
                      ]}
                      onPress={() => setSelectedFinish(finish)}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.colorDot,
                          finish === "PVD Or 18K"
                            ? styles.goldDot
                            : styles.silverDot,
                        ]}
                      />
                      <Text
                        style={[
                          styles.finishButtonText,
                          isSelected && styles.finishButtonTextSelected,
                        ]}
                      >
                        {finish}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Size Selection */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={styles.optionLabel}>
                TAILLE DE TOUR DE DOIGT : <Text style={styles.optionValue}>{selectedSize}</Text>
              </Text>
              <View style={styles.sizeOptions}>
                {product.availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        isSelected && styles.sizeButtonSelected,
                      ]}
                      onPress={() => setSelectedSize(size)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.sizeButtonText,
                          isSelected && styles.sizeButtonTextSelected,
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.descHeading}>DÉTAILS DU BIJOU</Text>
            <Text style={styles.descBody}>{product.description}</Text>
          </View>

          {/* Guarantees */}
          <GuaranteesRow />
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceBox}>
          <Text style={styles.bottomPriceLabel}>Total</Text>
          <Text style={styles.bottomPriceValue}>{price.toFixed(2)} €</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addToCartBtn,
            addedAnimation && styles.addToCartBtnSuccess,
          ]}
          onPress={handleAddToCart}
          activeOpacity={0.9}
        >
          <Text style={styles.addToCartText}>
            {addedAnimation ? "✓ Ajouté au panier !" : "Ajouter au Panier"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  galleryContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    position: "relative",
    backgroundColor: "#F7F5F0",
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    alignSelf: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primaryGold,
  },
  badgesOverlay: {
    position: "absolute",
    top: 14,
    left: 14,
    gap: 6,
  },
  waterproofPill: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    ...Layout.shadow.card,
  },
  waterproofText: {
    color: Colors.waterproofCyan,
    fontSize: 9,
    fontWeight: "800",
  },
  steelPill: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    ...Layout.shadow.card,
  },
  steelText: {
    color: Colors.textPrimary,
    fontSize: 9,
    fontWeight: "800",
  },
  favFloatingButton: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: Layout.borderRadius.full,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    ...Layout.shadow.card,
  },
  favFloatingIcon: {
    fontSize: 18,
  },
  contentContainer: {
    padding: Spacing.md,
  },
  categoryName: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.textMuted,
    fontWeight: "700",
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.obsidian,
    lineHeight: 24,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  priceText: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primaryGoldDark,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsText: {
    color: Colors.primaryGold,
    fontSize: 12,
    marginRight: 4,
  },
  ratingScore: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  parureCallout: {
    flexDirection: "row",
    backgroundColor: Colors.secondaryChampagne,
    borderWidth: 1,
    borderColor: Colors.champagneBorder,
    padding: Spacing.sm,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Spacing.md,
    alignItems: "center",
  },
  parureIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  parureTextContainer: {
    flex: 1,
  },
  parureTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.obsidian,
  },
  parureDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  optionSection: {
    marginBottom: Spacing.md,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  optionValue: {
    color: Colors.textPrimary,
    fontWeight: "800",
  },
  finishOptions: {
    flexDirection: "row",
    gap: 10,
  },
  finishButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Layout.borderRadius.md,
  },
  finishButtonSelected: {
    borderColor: Colors.primaryGold,
    backgroundColor: "#FDFBF5",
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  goldDot: {
    backgroundColor: Colors.primaryGold,
  },
  silverDot: {
    backgroundColor: "#CBD5E1",
  },
  finishButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  finishButtonTextSelected: {
    color: Colors.primaryGoldDark,
    fontWeight: "700",
  },
  sizeOptions: {
    flexDirection: "row",
    gap: 8,
  },
  sizeButton: {
    width: 44,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.sm,
  },
  sizeButtonSelected: {
    borderColor: Colors.obsidian,
    backgroundColor: Colors.obsidian,
  },
  sizeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  sizeButtonTextSelected: {
    color: "#FFFFFF",
  },
  descSection: {
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  descHeading: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  descBody: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Layout.shadow.floating,
  },
  bottomPriceBox: {
    paddingRight: Spacing.md,
  },
  bottomPriceLabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primaryGoldDark,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: Colors.obsidian,
    paddingVertical: 12,
    borderRadius: Layout.borderRadius.md,
    alignItems: "center",
  },
  addToCartBtnSuccess: {
    backgroundColor: Colors.success,
  },
  addToCartText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
