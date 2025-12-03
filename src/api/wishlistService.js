import http from "./http";
import ROUTES from "./routes";

/**
 * Normalizes backend wishlist items (Products OR Diamonds) into a common shape for ProductCard.
 */
function normalizeWishlistItem(row) {
  // 1. Identify if it's a Product or Diamond
  const itemType = row.itemType || (row.diamond ? "diamond" : "product");
  const data = itemType === "diamond" ? row.diamond : row.product;

  if (!data) return null;

  // 2. Common Fields
  const wishlistId = row._id || row.id;
  const productId = data._id || data.id;

  // 3. Extract Images
  let images = [];
  if (Array.isArray(data.images)) {
    images = data.images;
  } else if (data.image) {
    images = [data.image];
  } else {
    images =
      itemType === "diamond"
        ? ["/images/diamond.svg"]
        : ["/images/rings/gold.jpg"];
  }

  const base = images[0] || "";
  const hover = images[1] || base;

  // 4. Map Fields
  let title = "Unknown Item";
  let subtitle = "";
  let price = 0;

  if (itemType === "diamond") {
    title = `${data.carat || "?"} Carat ${data.shapeName || "Diamond"}`;
    subtitle = `${data.color || ""} | ${data.clarity || ""} | ${
      data.lab || "Lab"
    }`;
    price = data.price || 0;
  } else {
    title = data.productName || data.title || "Product";
    subtitle = data.description || data.productSku || "";
    price = data.price || data.default_price || 0;
  }

  return {
    wishlistId,
    id: productId,
    title,
    subtitle,
    price: `$${Number(price).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`,
    defaultColor: "gold",
    variants: { gold: base, white: base, rose: base },
    variantsHover: { gold: hover, white: hover, rose: hover },
    __type: itemType,
  };
}

function normalizeWishlist(list = []) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeWishlistItem).filter(Boolean);
}

/* ==========================================================
   📘 1️⃣ GET ALL WISHLIST ITEMS
   ========================================================== */
export async function fetchWishlist() {
  try {
    const res = await http.get(ROUTES.WISHLIST_GET_ALL);
    const payload = res.data || {};

    let rawItems = [];
    if (Array.isArray(payload)) {
      rawItems = payload;
    } else if (Array.isArray(payload.items)) {
      rawItems = payload.items;
    } else if (Array.isArray(payload.wishlist)) {
      rawItems = payload.wishlist;
    }

    return normalizeWishlist(rawItems);
  } catch (error) {
    console.error("[wishlistService] Fetch error:", error);
    throw error;
  }
}

/* ==========================================================
   📗 2️⃣ ADD PRODUCT TO WISHLIST (Fixed Payload Logic)
   ========================================================== */
export async function addProductToWishlist(rawPayload) {
  // Ensure we send the correct structure to the backend
  // If rawPayload is just { productId: "..." }, we add itemType: "product"
  const payload = {
    ...rawPayload,
    itemType: rawPayload.itemType || "product",
  };

  if (!payload.productId && !payload.productSku) {
    throw new Error("Missing productId or productSku");
  }

  try {
    console.log("[wishlistService] Adding:", payload);
    const res = await http.post(ROUTES.WISHLIST_ADD, payload);
    return res.data;
  } catch (error) {
    console.error("[wishlistService] Add error:", error);
    throw error;
  }
}

/* ==========================================================
   🗑️ 4️⃣ DELETE WISHLIST ITEM
   ========================================================== */
export async function deleteWishlistItem(wishlistId) {
  const url = `${ROUTES.WISHLIST_DELETE}/${wishlistId}`;
  try {
    const res = await http.delete(url);
    return res.data;
  } catch (error) {
    console.error("[wishlistService] Delete error:", error);
    throw error;
  }
}

export default {
  fetchWishlist,
  addProductToWishlist,
  deleteWishlistItem,
};
