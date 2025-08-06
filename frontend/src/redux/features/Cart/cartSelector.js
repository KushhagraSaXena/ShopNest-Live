// Select total quantity of items in the cart
export const selectTotalQty = (state) =>
  state.cart.cartItems.reduce((sum, item) => sum + Number(item.qty || 1), 0);

// Format quantity for badge UI
export const selectQtyBadge = (state) => {
  const qty = selectTotalQty(state);
  if (qty === 0) return null;      // Hide badge when cart is empty
  if (qty > 99) return "99+";
  return qty.toString();           // Show 1–99 as "1", "2", etc.
};
