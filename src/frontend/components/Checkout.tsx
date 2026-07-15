import React, { useState } from 'react';
import { useCart } from '../context/CartContext.js';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import styles from './Checkout.module.css';

interface ICheckoutProps {
  onBack: () => void;
}

export const Checkout: React.FC<ICheckoutProps> = ({ onBack }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOrderError('');

    try {
      const items = cartItems.map((i) => ({
        gameId: i.gameId,
        quantity: i.quantity,
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Checkout process failed.');
      }

      setOrderCompleted(true);
      clearCart();
    } catch (err: unknown) {
      setOrderError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className={styles.victoryScreen}>
        <div className={styles.victoryBanner}>
          <h1 className={styles.stageClear}>STAGE CLEAR!</h1>
          <p className={styles.victorySub}>ORDER SECURED SUCCESSFULLY</p>
        </div>
        <div className={`${styles.victoryCard} glass`}>
          <CheckCircle2 size={64} className={styles.victoryIcon} />
          <h2>VICTORY!</h2>
          <p>Thank you for buying from RetroVault. Your order is registered.</p>
          <button onClick={onBack} className={styles.backHomeBtn}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={`${styles.backBtn} glass`}>
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className={styles.layout}>
        <form onSubmit={handleSubmit} className={`${styles.form} glass`}>
          <h2 className="text-gradient">Secure Checkout</h2>
          <p className={styles.formSub}>Complete your transaction securely</p>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="gamer@retrovault.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="cardName">Name on Card</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              required
              value={formData.cardName}
              onChange={handleInputChange}
              placeholder="JOHN DOE"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              required
              maxLength={16}
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234567812345678"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="cardExpiry">Expiry Date</label>
              <input
                type="text"
                id="cardExpiry"
                name="cardExpiry"
                required
                maxLength={5}
                value={formData.cardExpiry}
                onChange={handleInputChange}
                placeholder="MM/YY"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="cardCvc">CVC</label>
              <input
                type="text"
                id="cardCvc"
                name="cardCvc"
                required
                maxLength={3}
                value={formData.cardCvc}
                onChange={handleInputChange}
                placeholder="123"
              />
            </div>
          </div>

          {orderError && <div className={styles.errorAlert}>{orderError}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
          </button>

          <div className={styles.secureBadge}>
            <ShieldCheck size={16} /> 128-bit SSL encryption
          </div>
        </form>

        <div className={`${styles.summary} glass`}>
          <h3>Order Summary</h3>
          <div className={styles.summaryItems}>
            {cartItems.map((item) => (
              <div key={item.gameId} className={styles.summaryItem}>
                <span>
                  {item.game?.title} <strong>x{item.quantity}</strong>
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className={styles.totalRow}>
            <span>Total:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
