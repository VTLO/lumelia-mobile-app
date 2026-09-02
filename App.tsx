import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, StyleSheet, StatusBar } from "react-native";

import { Colors } from "./src/constants/theme";
import { RootStackParamList, MainTabParamList } from "./src/types/Navigation";
import { useCartStore } from "./src/store/useCartStore";

// Screens
import { HomeScreen } from "./src/screens/HomeScreen";
import { CatalogScreen } from "./src/screens/CatalogScreen";
import { ParureBuilderScreen } from "./src/screens/ParureBuilderScreen";
import { ProductDetailScreen } from "./src/screens/ProductDetailScreen";
import { CartScreen } from "./src/screens/CartScreen";
import { WishlistScreen } from "./src/screens/WishlistScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabNavigator() {
  const summary = useCartStore((state) => state.getSummary());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primaryGoldDark,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{
          tabBarLabel: "Catalogue",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>💎</Text>,
        }}
      />
      <Tab.Screen
        name="Parure"
        component={ParureBuilderScreen}
        options={{
          tabBarLabel: "Parure -15%",
          tabBarIcon: () => (
            <View style={styles.parureTabBadge}>
              <Text style={styles.parureTabIcon}>✨</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarLabel: "Favoris",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🤍</Text>,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: "Panier",
          tabBarBadge: summary.itemsCount > 0 ? summary.itemsCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.primaryGold,
            fontSize: 9,
            fontWeight: "800",
          },
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🛍️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ presentation: "card" }}
          />
          <Stack.Screen
            name="Checkout"
            component={CartScreen}
            options={{ presentation: "modal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  parureTabBadge: {
    backgroundColor: Colors.badgeParureBg,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primaryGold,
  },
  parureTabIcon: {
    fontSize: 14,
  },
});
