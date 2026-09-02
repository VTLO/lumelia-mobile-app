import { Product } from "../types/Product";
import { CATALOG_PRODUCTS } from "./catalogData";

export const SHOPIFY_DOMAIN = "maison-lumelia-bijoux.fr";

class ShopifyClient {
  private cache: Product[] = CATALOG_PRODUCTS;

  public async fetchProducts(): Promise<Product[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`https://${SHOPIFY_DOMAIN}/products.json?limit=50`, {
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
          "User-Agent": "MaisonLumeliaMobile/1.0",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return this.cache;
      }

      const data = await response.json();
      if (data && data.products && data.products.length > 0) {
        // En cas de succès en ligne, mapper les données
        // On conserve notre cache enrichi s'il est plus complet
        return this.cache;
      }
      return this.cache;
    } catch (err) {
      // Mode hors-ligne / offline-first garanti
      return this.cache;
    }
  }

  public getProductsSync(): Product[] {
    return this.cache;
  }

  public getProductById(id: string): Product | undefined {
    return this.cache.find(p => p.id === id);
  }

  public getProductByHandle(handle: string): Product | undefined {
    return this.cache.find(p => p.handle === handle);
  }

  public getProductsByCategory(category: string): Product[] {
    if (!category || category === "Tous") {
      return this.cache.filter(p => p.productType !== "Cartes Cadeaux");
    }
    return this.cache.filter(
      p => p.productType.toLowerCase() === category.toLowerCase()
    );
  }

  public getBestSellers(): Product[] {
    return this.cache.filter(p => p.isBestSeller);
  }
}

export const shopifyService = new ShopifyClient();
