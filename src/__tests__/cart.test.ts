import { Cart } from '../shared/cart.js';
import { IGame } from '../shared/types.js';

describe('Cart Calculations', () => {
  let cart: Cart;
  const mockGame: IGame = {
    id: 'game-123',
    title: 'Chrono Trigger',
    description: 'Best RPG ever.',
    price: 99.99,
    rarity: 'Rare',
    console: 'SNES',
    stock: 5,
    imageUrl: 'chrono.png',
    screenshots: '[]',
  };

  beforeEach(() => {
    cart = new Cart();
  });

  test('should add an item to the cart', () => {
    cart.addItem(mockGame, 2);
    expect(cart.getItems().length).toBe(1);
    expect(cart.getItems()[0].quantity).toBe(2);
    expect(cart.getTotal()).toBe(199.98);
  });

  test('should throw error when adding negative or zero quantity', () => {
    expect(() => cart.addItem(mockGame, 0)).toThrow(
      'Quantity must be greater than zero.',
    );
  });

  test('should throw error if quantity exceeds stock', () => {
    expect(() => cart.addItem(mockGame, 6)).toThrow(
      'Cannot add more than available stock (5).',
    );
  });

  test('should stack quantities of the same item', () => {
    cart.addItem(mockGame, 2);
    cart.addItem(mockGame, 2);
    expect(cart.getItems().length).toBe(1);
    expect(cart.getItems()[0].quantity).toBe(4);
    expect(cart.getTotal()).toBe(399.96);
  });

  test('should remove item from cart', () => {
    cart.addItem(mockGame, 1);
    cart.removeItem(mockGame.id);
    expect(cart.getItems().length).toBe(0);
    expect(cart.getTotal()).toBe(0);
  });
});
