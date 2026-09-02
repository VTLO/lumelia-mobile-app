import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing, Layout } from "../constants/theme";

export const GuaranteesRow: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.icon}>💧</Text>
        <Text style={styles.title}>100% Waterproof</Text>
        <Text style={styles.desc}>Résiste à l'eau, douche & parfum</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <Text style={styles.icon}>🛡️</Text>
        <Text style={styles.title}>Acier 316L & PVD</Text>
        <Text style={styles.desc}>10x plus durable, hypoallergénique</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <Text style={styles.icon}>📦</Text>
        <Text style={styles.title}>Envoi 24-48h</Text>
        <Text style={styles.desc}>Livraison soignée avec écrin</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "space-around",
  },
  item: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  title: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  desc: {
    fontSize: 8,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
});
