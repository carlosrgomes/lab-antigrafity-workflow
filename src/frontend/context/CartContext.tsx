import React, { createContext, useContext, useState, useEffect } from 'react';
import { IGame, IOrderItem } from '../../shared/types.js';

interface ICartContext {
  cartItems: IOrderItem[];
  addToCart: (game: IGame, quantity?: number) => void;
  removeFromCart: (gameId: string) => void;
  updateQuantity: (gameId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<IOrderItem[]>([]);

  // Load cart from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('retrovault_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load cart', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('retrovault_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (game: IGame, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.gameId === game.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > game.stock) return prev; // Limit to stock
        return prev.map((item) =>
          item.gameId === game.id ? { ...item, quantity: newQty } : item,
        );
      }
      return [
        ...prev,
        {
          id: '',
          gameId: game.id,
          orderId: '',
          quantity,
          price: game.price,
          game,
        },
      ];
    });
  };

  const removeFromCart = (gameId: string) => {
    setCartItems((prev) => prev.filter((item) => item.gameId !== gameId));
  };

  const updateQuantity = (gameId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(gameId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.gameId !== gameId) return item;
        const maxStock = item.game?.stock ?? 99;
        return { ...item, quantity: Math.min(quantity, maxStock) };
      }),
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return Number(
      cartItems
        .reduce((acc, item) => acc + item.price * item.quantity, 0)
        .toFixed(2),
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
