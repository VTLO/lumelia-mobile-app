import { Product } from "./Product";

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { product: Product };
  ParureBuilder: undefined;
  Checkout: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Catalog: { initialCategory?: string };
  Parure: undefined;
  Wishlist: undefined;
  Cart: undefined;
};
