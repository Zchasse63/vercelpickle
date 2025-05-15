/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as businessProfiles from "../businessProfiles.js";
import type * as cart from "../cart.js";
import type * as importProducts from "../importProducts.js";
import type * as importProductsFromJson from "../importProductsFromJson.js";
import type * as orders from "../orders.js";
import type * as pexels from "../pexels.js";
import type * as pexelsApi from "../pexelsApi.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
import type * as setup from "../setup.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  businessProfiles: typeof businessProfiles;
  cart: typeof cart;
  importProducts: typeof importProducts;
  importProductsFromJson: typeof importProductsFromJson;
  orders: typeof orders;
  pexels: typeof pexels;
  pexelsApi: typeof pexelsApi;
  products: typeof products;
  reviews: typeof reviews;
  seed: typeof seed;
  seedData: typeof seedData;
  setup: typeof setup;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
