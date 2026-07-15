import React from 'react';
import { useCart } from '../context/CartContext.js';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import styles from './CartSidebar.module.css';

interface ICartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<ICartSidebarProps> = ({
  isOpen,
  onClose,
  onCheckout,
}) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.sidebar} glass`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className="text-gradient">Cart</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.itemsContainer}>
          {cartItems.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is empty.</p>
              <span className={styles.glitchText}>INSERT COIN</span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.gameId} className={`${styles.item} glass`}>
                <img
                  src={item.game?.imageUrl}
                  alt={item.game?.title}
                  className={styles.itemImage}
                />
                <div className={styles.itemInfo}>
                  <h4 className={styles.itemTitle}>{item.game?.title}</h4>
                  <p className={styles.itemConsole}>{item.game?.console}</p>
                  <span className={styles.itemPrice}>
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <div className={styles.actions}>
                  <div className={styles.quantityControls}>
                    <button
                      onClick={() =>
                        updateQuantity(item.gameId, item.quantity - 1)
                      }
                      className={styles.quantityBtn}
                    >
                      <Minus size={12} />
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.gameId, item.quantity + 1)
                      }
                      className={styles.quantityBtn}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.gameId)}
                    className={styles.removeBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Subtotal:</span>
              <span className={styles.totalAmount}>
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
            <button onClick={onCheckout} className={styles.checkoutBtn}>
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
