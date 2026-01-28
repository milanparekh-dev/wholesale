import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // {upc, vendor, qty, title, price}
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const {
        upc,
        vendor,
        qty = 1,
        title,
        price,
        brand,
        vendor_name,
        sku,
      } = action.payload;
      const existing = state.items.find(
        (item) => item.upc === upc && item.vendor === vendor
      );

      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({
          upc,
          vendor,
          qty,
          title,
          price,
          brand,
          vendor_name,
          sku,
        });
      }
    },
    decreaseQty(state, action) {
      const { upc, vendor } = action.payload;
      const existing = state.items.find(
        (item) => item.upc === upc && item.vendor === vendor
      );

      if (existing) {
        existing.qty -= 1;
        if (existing.qty <= 0) {
          // remove item if qty <= 0
          state.items = state.items.filter(
            (item) => !(item.upc === upc && item.vendor === vendor)
          );
        }
      }
    },
    removeFromCart(state, action) {
      const { upc, vendor } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.upc === upc && item.vendor === vendor)
      );
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, decreaseQty, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
