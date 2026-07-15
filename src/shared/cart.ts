import { IGame, IOrderItem } from './types.js';

/**
 * Handles shopping cart operations and calculations.
 */
export class Cart {
  private items: Map<string, IOrderItem> = new Map();

  /**
   * Adds a game to the cart or updates quantity if it already exists.
   * @param game The game model to add.
   * @param quantity The amount to add.
   */
  public addItem(game: IGame, quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero.');
    }
    const existing = this.items.get(game.id);
    const newQty = existing ? existing.quantity + quantity : quantity;

    if (newQty > game.stock) {
      throw new Error(`Cannot add more than available stock (${game.stock}).`);
    }

    this.items.set(game.id, {
      id: existing?.id || '',
      gameId: game.id,
      orderId: '',
      quantity: newQty,
      price: game.price,
      game,
    });
  }

  /**
   * Removes an item from the cart.
   * @param gameId The game identifier to remove.
   */
  public removeItem(gameId: string): void {
    this.items.delete(gameId);
  }

  /**
   * Gets list of all items in the cart.
   * @returns Array of order items.
   */
  public getItems(): IOrderItem[] {
    return Array.from(this.items.values());
  }

  /**
   * Calculates the total value of the cart.
   * @returns The total cart price.
   */
  public getTotal(): number {
    let total = 0;
    for (const item of this.items.values()) {
      total += item.price * item.quantity;
    }
    return Number(total.toFixed(2));
  }
}
