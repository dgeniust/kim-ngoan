import "server-only";
import { cache } from "react";
import { z } from "zod";
import * as lopxe from "@/lib/data/lopxe";
import * as satthep from "@/lib/data/satthep";
import type { CatalogProduct } from "@/types/catalog";
import { products as fertilizerSeed } from "@/lib/mock/products";
import type { Product } from "@/types/phanbon";
import { readJson, writeJson } from "@/lib/store/json-file";
import type { CatalogSite } from "@/lib/verticals";
import { catalogProductSchema, fertilizerProductSchema } from "./schema";

/**
 * Product store for the three sector sites: data/products-{phanbon|lopxe|satthep}.json.
 * No file yet → the sample data in code is used. The admin overwrites a sector's whole list.
 */
export type ProductSite = "phanbon" | CatalogSite;

const file = (site: ProductSite) => `products-${site}.json`;
const CATALOG_SEED: Record<CatalogSite, CatalogProduct[]> = { lopxe: lopxe.products, satthep: satthep.products };

export const getFertilizerProducts = cache(async (): Promise<Product[]> => {
  const raw = await readJson(file("phanbon"));
  if (raw === undefined) return fertilizerSeed;
  const parsed = z.array(fertilizerProductSchema).safeParse(raw);
  if (parsed.success) return parsed.data as Product[];
  console.warn("[products] products-phanbon.json không hợp lệ, dùng dữ liệu mẫu", parsed.error.issues[0]);
  return fertilizerSeed;
});

export const getFertilizerProduct = async (slug: string) => (await getFertilizerProducts()).find((p) => p.slug === slug);

export const getCatalogProducts = cache(async (site: CatalogSite): Promise<CatalogProduct[]> => {
  const raw = await readJson(file(site));
  if (raw === undefined) return CATALOG_SEED[site];
  const parsed = z.array(catalogProductSchema).safeParse(raw);
  if (parsed.success) return parsed.data as CatalogProduct[];
  console.warn(`[products] products-${site}.json không hợp lệ, dùng dữ liệu mẫu`, parsed.error.issues[0]);
  return CATALOG_SEED[site];
});

export const saveFertilizerProducts = (list: Product[]) => writeJson(file("phanbon"), list);
export const saveCatalogProducts = (site: CatalogSite, list: CatalogProduct[]) => writeJson(file(site), list);
