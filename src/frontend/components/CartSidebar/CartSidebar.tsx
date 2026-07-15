import React from 'react';
import { useCart } from '../../context/CartContext.js';
import './CartSidebar.css';

interface ICartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

/**
 * Slide-over panel exhibiting added cart games, current subtotal, item managers, and checkout actions.
 *
 * @param {ICartSidebarProps} props - Component properties.
 * @returns {React.ReactElement} The rendered CartSidebar component.
 */
export const CartSidebar: React.FC<ICartSidebarProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { cart, updateQuantity, removeFromCart, subtotal } = useCart();

  if (!isOpen) return <></>;

  const handleCheckout = () => {
    onClose();
    onNavigate('checkout');
  };

  return (
    <div className="cart-sidebar-overlay" onClick={onClose}>
      <div className="cart-sidebar glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="text-neon-cyan">YOUR INVENTORY</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>NO GAMES ACQUIRED YET</p>
              <span className="cart-empty-icon">&#x1F579;</span>
            </div>
          ) : (
            cart.map(({ game, quantity }) => (
              <div key={game.id} className="cart-item">
                <img src={game.imageUrl} alt={game.title} className="item-thumb" />
                <div className="item-info">
                  <h4>{game.title}</h4>
                  <p className="item-price">${game.price.toFixed(2)}</p>
                  <div className="item-qty-controls">
                    <button
                      onClick={() => updateQuantity(game.id, quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => updateQuantity(game.id, quantity + 1)}
                      disabled={quantity >= game.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button className="btn-remove" onClick={() => removeFromCart(game.id)}>
                  🗑
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="subtotal-row">
              <span>TOTAL VALUE:</span>
              <span className="total-price">${subtotal.toFixed(2)}</span>
            </div>
            <button className="btn-checkout btn-cyber" onClick={handleCheckout}>
              CHECKOUT SYSTEM
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
