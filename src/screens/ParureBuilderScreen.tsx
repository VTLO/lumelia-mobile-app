import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Header } from "../components/Header";
import { Colors, Spacing, Layout } from "../constants/theme";
import { useParureStore } from "../store/useParureStore";
import { shopifyService } from "../services/shopifyClient";
import { Product } from "../types/Product";

interface ParureBuilderScreenProps {
  navigation?: any;
}

export const ParureBuilderScreen: React.FC<ParureBuilderScreenProps> = ({
  navigation,
}) => {
  const {
    slot1,
    slot2,
    slot3,
    activeStep,
    setActiveStep,
    selectProductForSlot,
    clearSlot,
    getParureSummary,
    addParureToCart,
  } = useParureStore();

  const summary = getParureSummary();

  // Products filtered for the active step
  const getProductsForStep = (step: 1 | 2 | 3): Product[] => {
    if (step === 1) {
      return shopifyService.getProductsByCategory("Colliers");
    } else if (step === 2) {
      const bagues = shopifyService.getProductsByCategory("Bagues");
      const bracelets = shopifyService.getProductsByCategory("Bracelets");
      return [...bagues, ...bracelets];
    } else {
      return shopifyService.getProductsByCategory("Boucles d'oreilles");
    }
  };

  const availableProducts = getProductsForStep(activeStep);

  const handleAddAndCheckout = () => {
    const success = addParureToCart();
    if (success) {
      navigation.navigate("Cart");
    }
  };

  return (
    <View style={styles.screen}>
      <Header
        title="CRÉER MA PARURE"
        subtitle="-15% AUTOMATIQUE DÈS 3 BIJOUX"
        onCartPress={() => navigation.navigate("Cart")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Step Indicator / Slots Row */}
        <View style={styles.slotsCard}>
          <Text style={styles.slotsCardTitle}>VOTRE PARURE SUR-MESURE (3 PIÈCES)</Text>
          
          <View style={styles.slotsRow}>
            {/* Slot 1: Collier */}
            <TouchableOpacity
              style={[
                styles.slotItem,
                activeStep === 1 && styles.slotItemActive,
                slot1.selectedProduct && styles.slotItemCompleted,
              ]}
              onPress={() => setActiveStep(1)}
              activeOpacity={0.85}
            >
              {slot1.selectedProduct ? (
                <Image
                  source={{ uri: slot1.selectedProduct.images[0] }}
                  style={styles.slotThumb}
                />
              ) : (
                <View style={styles.slotEmpty}>
                  <Text style={styles.slotEmptyIcon}>📿</Text>
                  <Text style={styles.slotEmptyLabel}>1. Collier</Text>
                </View>
              )}
              {slot1.selectedProduct && (
                <TouchableOpacity
                  style={styles.removeSlotBtn}
                  onPress={() => clearSlot(1)}
                >
                  <Text style={styles.removeSlotText}>✕</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            <Text style={styles.plusIcon}>+</Text>

            {/* Slot 2: Bague ou Bracelet */}
            <TouchableOpacity
              style={[
                styles.slotItem,
                activeStep === 2 && styles.slotItemActive,
                slot2.selectedProduct && styles.slotItemCompleted,
              ]}
              onPress={() => setActiveStep(2)}
              activeOpacity={0.85}
            >
              {slot2.selectedProduct ? (
                <Image
                  source={{ uri: slot2.selectedProduct.images[0] }}
                  style={styles.slotThumb}
                />
              ) : (
                <View style={styles.slotEmpty}>
                  <Text style={styles.slotEmptyIcon}>💍</Text>
                  <Text style={styles.slotEmptyLabel}>2. Bague/Jonc</Text>
                </View>
              )}
              {slot2.selectedProduct && (
                <TouchableOpacity
                  style={styles.removeSlotBtn}
                  onPress={() => clearSlot(2)}
                >
                  <Text style={styles.removeSlotText}>✕</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            <Text style={styles.plusIcon}>+</Text>

            {/* Slot 3: Boucles */}
            <TouchableOpacity
              style={[
                styles.slotItem,
                activeStep === 3 && styles.slotItemActive,
                slot3.selectedProduct && styles.slotItemCompleted,
              ]}
              onPress={() => setActiveStep(3)}
              activeOpacity={0.85}
            >
              {slot3.selectedProduct ? (
                <Image
                  source={{ uri: slot3.selectedProduct.images[0] }}
                  style={styles.slotThumb}
                />
              ) : (
                <View style={styles.slotEmpty}>
                  <Text style={styles.slotEmptyIcon}>💎</Text>
                  <Text style={styles.slotEmptyLabel}>3. Boucles</Text>
                </View>
              )}
              {slot3.selectedProduct && (
                <TouchableOpacity
                  style={styles.removeSlotBtn}
                  onPress={() => clearSlot(3)}
                >
                  <Text style={styles.removeSlotText}>✕</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Step Guide Banner */}
        <View style={styles.stepBanner}>
          <Text style={styles.stepTitle}>
            Étape {activeStep} / 3 : Choisissez votre{" "}
            {activeStep === 1
              ? "Collier"
              : activeStep === 2
              ? "Bague ou Bracelet"
              : "Paire de Boucles"}
          </Text>
          <Text style={styles.stepSubtitle}>
            Sélectionnez une pièce ci-dessous pour l'ajouter à la parure.
          </Text>
        </View>

        {/* Selection Grid for Active Step */}
        <View style={styles.selectionGrid}>
          {availableProducts.map((p) => {
            const currentSlot =
              activeStep === 1 ? slot1 : activeStep === 2 ? slot2 : slot3;
            const isSelected = currentSlot.selectedProduct?.id === p.id;

            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.selectCard,
                  isSelected && styles.selectCardActive,
                ]}
                onPress={() => {
                  selectProductForSlot(activeStep, p);
                  // Passer automatiquement à l'étape suivante s'il en reste
                  if (activeStep < 3) {
                    setActiveStep((activeStep + 1) as 2 | 3);
                  }
                }}
                activeOpacity={0.85}
              >
                <Image
                  source={{ uri: p.images[0] }}
                  style={styles.selectCardImage}
                />
                <View style={styles.selectCardInfo}>
                  <Text style={styles.selectCardTitle} numberOfLines={2}>
                    {p.title}
                  </Text>
                  <Text style={styles.selectCardPrice}>{p.price.toFixed(2)} €</Text>
                  <View
                    style={[
                      styles.selectBtn,
                      isSelected && styles.selectBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectBtnText,
                        isSelected && styles.selectBtnTextActive,
                      ]}
                    >
                      {isSelected ? "✓ Sélectionné" : "Choisir"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Live Bundle Calculator Sticky Bottom */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryValues}>
          {summary.isComplete ? (
            <View>
              <View style={styles.priceWithDiscountRow}>
                <Text style={styles.originalCrossed}>
                  {summary.originalPrice.toFixed(2)} €
                </Text>
                <Text style={styles.discountBadgeText}>
                  -15% (Économie : {summary.discountAmount.toFixed(2)} €)
                </Text>
              </View>
              <Text style={styles.finalTotal}>
                {summary.finalPrice.toFixed(2)} €
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.pendingLabel}>
                {3 -
                  (Number(Boolean(slot1.selectedProduct)) +
                    Number(Boolean(slot2.selectedProduct)) +
                    Number(Boolean(slot3.selectedProduct)))}{" "}
                bijou(x) manquant(s)
              </Text>
              <Text style={styles.pendingHint}>Pour débloquer les -15%</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutBundleBtn,
            !summary.isComplete && styles.checkoutBundleBtnDisabled,
          ]}
          onPress={handleAddAndCheckout}
          disabled={!summary.isComplete}
          activeOpacity={0.9}
        >
          <Text style={styles.checkoutBundleText}>
            {summary.isComplete ? "Ajouter la Parure" : "Compléter"}
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
    paddingBottom: 110,
  },
  slotsCard: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Layout.shadow.card,
  },
  slotsCardTitle: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "800",
    color: Colors.primaryGoldDark,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  slotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  slotItem: {
    width: 86,
    height: 86,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: "#FAF9F6",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  slotItemActive: {
    borderColor: Colors.primaryGold,
    backgroundColor: "#FDFBF5",
  },
  slotItemCompleted: {
    borderColor: Colors.success,
  },
  slotThumb: {
    width: "100%",
    height: "100%",
  },
  slotEmpty: {
    alignItems: "center",
  },
  slotEmptyIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  slotEmptyLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  removeSlotBtn: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  removeSlotText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  plusIcon: {
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: "700",
  },
  stepBanner: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.obsidian,
  },
  stepSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  selectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
  },
  selectCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  selectCardActive: {
    borderColor: Colors.primaryGold,
    borderWidth: 2,
  },
  selectCardImage: {
    width: "100%",
    aspectRatio: 1,
  },
  selectCardInfo: {
    padding: Spacing.sm,
  },
  selectCardTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textPrimary,
    lineHeight: 14,
    minHeight: 28,
  },
  selectCardPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primaryGoldDark,
    marginTop: 4,
  },
  selectBtn: {
    marginTop: 6,
    backgroundColor: Colors.background,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectBtnActive: {
    backgroundColor: Colors.primaryGold,
    borderColor: Colors.primaryGold,
  },
  selectBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  selectBtnTextActive: {
    color: "#FFFFFF",
  },
  summaryBar: {
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
  summaryValues: {
    flex: 1,
  },
  priceWithDiscountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  originalCrossed: {
    fontSize: 12,
    color: Colors.textMuted,
    textDecorationLine: "line-through",
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.success,
  },
  finalTotal: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primaryGoldDark,
  },
  pendingLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.obsidian,
  },
  pendingHint: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  checkoutBundleBtn: {
    backgroundColor: Colors.obsidian,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Layout.borderRadius.md,
  },
  checkoutBundleBtnDisabled: {
    backgroundColor: Colors.border,
  },
  checkoutBundleText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
