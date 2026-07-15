import { calculateSubtotal } from '../shared/utils.js';

describe('Cart Subtotal Calculations', () => {
  test('should return 0 for an empty cart', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  test('should calculate subtotal for a single item', () => {
    const items = [{ price: 49.99, quantity: 2 }];
    expect(calculateSubtotal(items)).toBeCloseTo(99.98);
  });

  test('should calculate subtotal for multiple items', () => {
    const items = [
      { price: 49.99, quantity: 1 },
      { price: 19.99, quantity: 3 },
      { price: 5.0, quantity: 2 },
    ];
    // 49.99 + 59.97 + 10 = 119.96
    expect(calculateSubtotal(items)).toBeCloseTo(119.96);
  });
});
