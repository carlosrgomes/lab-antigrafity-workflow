import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface ICartItem {
  game: any;
  quantity: number;
}

interface ICartContext {
  cart: ICartItem[];
  addToCart: (game: any) => void;
  updateQuantity: (gameId: string, quantity: number) => void;
  removeFromCart: (gameId: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isAdmin: boolean;
  toggleAdmin: () => void;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

/**
 * CartProvider component to wrap the React application tree.
 *
 * @param {object} props - Component properties.
 * @param {ReactNode} props.children - Child components to render.
 * @returns {React.ReactElement} The rendered Provider component.
 */
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const addToCart = (game: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.game.id === game.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + 1, game.stock);
        return prev.map((item) =>
          item.game.id === game.id ? { ...item, quantity: nextQty } : item,
        );
      }
      return [...prev, { game, quantity: 1 }];
    });
  };

  const updateQuantity = (gameId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.game.id === gameId) {
          const nextQty = Math.max(1, Math.min(quantity, item.game.stock));
          return { ...item, quantity: nextQty };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (gameId: string) => {
    setCart((prev) => prev.filter((item) => item.game.id !== gameId));
  };

  const clearCart = () => setCart([]);
  const toggleAdmin = () => setIsAdmin((prev) => !prev);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.game.price * item.quantity,
    0,
  );
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalItems,
        isAdmin,
        toggleAdmin,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom React hook to consume shopping cart states.
 *
 * @returns {ICartContext} The active cart context.
 */
export const useCart = (): ICartContext => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
