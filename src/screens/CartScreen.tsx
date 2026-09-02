import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Header } from "../components/Header";
import { Colors, Spacing, Layout } from "../constants/theme";
import { useCartStore } from "../store/useCartStore";

interface CartScreenProps {
  navigation?: any;
}

export const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { items, updateQuantity, removeItem, clearCart, getSummary } = useCartStore();
  const summary = getSummary();
  const [checkoutSimulated, setCheckoutSimulated] = useState(false);

  const handleCheckout = () => {
    setCheckoutSimulated(true);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="MON PANIER"
        subtitle="EXPÉDITION SOUS 24-48H"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Free Shipping Tracker */}
        <View style={styles.shippingBarContainer}>
          <View style={styles.shippingBarBg}>
            <View
              style={[
                styles.shippingBarFill,
                { width: `${summary.freeShippingProgress}%` },
              ]}
            />
          </View>
          <Text style={styles.shippingText}>
            {summary.shipping === 0
              ? "🎉 Félicitations ! La livraison offerte est débloquée !"
              : `Encore ${(50 - (summary.subtotal - summary.discountAmount)).toFixed(2)} € pour bénéficier de la livraison offerte.`}
          </Text>
        </View>

        {/* Parure Discount Active Banner */}
        {summary.isParureDiscountApplied && (
          <View style={styles.parureDiscountAlert}>
            <Text style={styles.alertSparkle}>✨</Text>
            <View style={styles.alertTextGroup}>
              <Text style={styles.alertTitle}>Offre Parure -15% Appliquée !</Text>
              <Text style={styles.alertDesc}>
                Vous économisez {summary.discountAmount.toFixed(2)} € sur votre commande.
              </Text>
            </View>
          </View>
        )}

        {/* Items List */}
        {items.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyTitle}>Votre panier est vide</Text>
            <Text style={styles.emptyDesc}>
              Découvrez nos créations waterproof en acier 316L et composez votre parure.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate("Catalog")}
              activeOpacity={0.85}
            >
              <Text style={styles.exploreBtnText}>Explorer le catalogue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {items.map((item) => (
              <View key={item.cartItemId} style={styles.cartCard}>
                <Image
                  source={{ uri: item.product.images[0] }}
                  style={styles.itemThumb}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.product.title}
                  </Text>
                  
                  <View style={styles.itemMeta}>
                    <Text style={styles.metaFinish}>
                      {item.finish}
                    </Text>
                    {item.size ? (
                      <Text style={styles.metaSize}>Taille {item.size}</Text>
                    ) : null}
                  </View>

                  <View style={styles.itemBottomRow}>
                    <Text style={styles.itemPrice}>
                      {(item.variant.price * item.quantity).toFixed(2)} €
                    </Text>

                    {/* Quantity Controls */}
                    <View style={styles.qtyControl}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() =>
                          updateQuantity(item.cartItemId, item.quantity - 1)
                        }
                      >
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.qtyValue}>{item.quantity}</Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() =>
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Order Summary Box */}
        {items.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>RÉCAPITULATIF COMMANDE</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>
                {summary.subtotal.toFixed(2)} €
              </Text>
            </View>

            {summary.isParureDiscountApplied && (
              <View style={styles.summaryRow}>
                <Text style={styles.discountLabel}>Remise Parure (-15%)</Text>
                <Text style={styles.discountValue}>
                  -{summary.discountAmount.toFixed(2)} €
                </Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={styles.summaryValue}>
                {summary.shipping === 0
                  ? "Offerte"
                  : `${summary.shipping.toFixed(2)} €`}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total TTC</Text>
              <Text style={styles.totalValue}>{summary.total.toFixed(2)} €</Text>
            </View>

            {/* Express Pay (Apple Pay / Google Pay) */}
            <TouchableOpacity
              style={styles.applePayBtn}
              onPress={handleCheckout}
              activeOpacity={0.9}
            >
              <Text style={styles.applePayText}> Pay / GPay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              activeOpacity={0.9}
            >
              <Text style={styles.checkoutText}>
                Passer la commande • {summary.total.toFixed(2)} €
              </Text>
            </TouchableOpacity>

            {/* Security Guarantee */}
            <Text style={styles.securityNote}>
              🔒 Paiement 100% sécurisé (Shopify Payments / CB / Apple Pay)
            </Text>
          </View>
        )}

        {/* Checkout Modal / Success Simulation */}
        {checkoutSimulated && (
          <View style={styles.successModal}>
            <Text style={styles.successEmoji}>✨💍</Text>
            <Text style={styles.successTitle}>Commande Préparée !</Text>
            <Text style={styles.successDesc}>
              Votre commande Maison Lumélia d'un montant de {summary.total.toFixed(2)} € est prête à être synchronisée via l'API Storefront Shopify.
            </Text>
            <TouchableOpacity
              style={styles.dismissSuccessBtn}
              onPress={() => {
                setCheckoutSimulated(false);
                clearCart();
                navigation.navigate("Home");
              }}
            >
              <Text style={styles.dismissSuccessText}>Retour à la boutique</Text>
            </TouchableOpacity>
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
  shippingBarContainer: {
    backgroundColor: Colors.card,
    padding: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shippingBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  shippingBarFill: {
    height: "100%",
    backgroundColor: Colors.primaryGold,
    borderRadius: 3,
  },
  shippingText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },
  parureDiscountAlert: {
    flexDirection: "row",
    backgroundColor: Colors.secondaryChampagne,
    borderColor: Colors.primaryGold,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    padding: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    alignItems: "center",
  },
  alertSparkle: {
    fontSize: 20,
    marginRight: 8,
  },
  alertTextGroup: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primaryGoldDark,
  },
  alertDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  itemsList: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  cartCard: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  itemThumb: {
    width: 70,
    height: 70,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: "#F7F5F0",
  },
  itemDetails: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  itemMeta: {
    flexDirection: "row",
    gap: 8,
    marginTop: 3,
  },
  metaFinish: {
    fontSize: 10,
    color: Colors.primaryGoldDark,
    fontWeight: "600",
  },
  metaSize: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  itemBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.obsidian,
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  qtyValue: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 6,
    color: Colors.textPrimary,
  },
  emptyCart: {
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
  summaryCard: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Layout.shadow.card,
  },
  summaryCardTitle: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "800",
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  discountLabel: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: "700",
  },
  discountValue: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.obsidian,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.primaryGoldDark,
  },
  applePayBtn: {
    backgroundColor: "#000000",
    paddingVertical: 12,
    borderRadius: Layout.borderRadius.md,
    alignItems: "center",
    marginBottom: 8,
  },
  applePayText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  checkoutBtn: {
    backgroundColor: Colors.primaryGold,
    paddingVertical: 12,
    borderRadius: Layout.borderRadius.md,
    alignItems: "center",
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  securityNote: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 10,
  },
  successModal: {
    backgroundColor: Colors.secondaryChampagne,
    borderColor: Colors.primaryGold,
    borderWidth: 1.5,
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    alignItems: "center",
  },
  successEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.obsidian,
  },
  successDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  dismissSuccessBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.obsidian,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.full,
  },
  dismissSuccessText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
