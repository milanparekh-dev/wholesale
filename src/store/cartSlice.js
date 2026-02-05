import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // {upc, qty, title, price, brand, vendor_name}
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const {
        upc,
        qty = 1,
        title,
        price,
        brand,
        vendor_name,
        sku,
      } = action.payload;
      const existing = state.items.find(
        (item) => item.upc === upc
      );

      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({
          upc,
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
      const { upc } = action.payload;
      const existing = state.items.find(
        (item) => item.upc === upc
      );

      if (existing) {
        existing.qty -= 1;
        if (existing.qty <= 0) {
          // remove item if qty <= 0
          state.items = state.items.filter(
            (item) => item.upc !== upc
          );
        }
      }
    },
    removeFromCart(state, action) {
      const { upc } = action.payload;
      state.items = state.items.filter(
        (item) => item.upc !== upc
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
