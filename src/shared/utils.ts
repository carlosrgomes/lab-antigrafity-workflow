/**
 * Calculates the subtotal of items in a shopping cart.
 * @param items - List of items with price and quantity.
 * @returns The computed subtotal value.
 */
export function calculateSubtotal(
  items: { price: number; quantity: number }[],
): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
