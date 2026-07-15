import React, { useState } from 'react';
import { useCart } from '../../context/CartContext.js';
import './Checkout.css';

interface ICheckoutProps {
  onBack: () => void;
  onSuccess: (order: any) => void;
}

/**
 * Checkout checkout system containing cart listings and billing details.
 *
 * @param {ICheckoutProps} props - Component properties.
 * @returns {React.ReactElement} The rendered Checkout component.
 */
export const Checkout: React.FC<ICheckoutProps> = ({ onBack, onSuccess }) => {
  const { cart, subtotal, clearCart } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [card, setCard] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !card) {
      setError('Please fill in all simulation details.');
      return;
    }
    setSubmitting(true);
    setError(null);

    const items = cart.map((item) => ({
      gameId: item.game.id,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error executing payment.');
      }
      clearCart();
      onSuccess(data);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
      <button className="btn-back" onClick={onBack}>
        &larr; ABORT DEPLOYMENT
      </button>

      <div className="checkout-grid">
        <form className="checkout-form glass-panel" onSubmit={handleSubmit}>
          <h2 className="text-neon-cyan">IDENTITY VERIFICATION</h2>
          <p className="form-sub">Provide simulated coordinates to clear stage.</p>

          {error && <div className="checkout-error">{error}</div>}

          <div className="form-group">
            <label>PILOT NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. SOLID SNAKE"
              required
            />
          </div>

          <div className="form-group">
            <label>COMM CHANNEL (EMAIL)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. snake@codec.com"
              required
            />
          </div>

          <div className="form-group">
            <label>CREDIT CHIP ID (SIMULATED CARD)</label>
            <input
              type="text"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              placeholder="4242 4242 4242 4242"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-pay-submit btn-cyber"
            disabled={submitting || cart.length === 0}
          >
            {submitting ? 'TRANSMITTING...' : 'INITIATE TRANSACTION'}
          </button>
        </form>

        <div className="checkout-summary glass-panel">
          <h2 className="text-neon-purple">CARGO DETAILS</h2>
          <div className="summary-list">
            {cart.map(({ game, quantity }) => (
              <div key={game.id} className="summary-item">
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="summary-thumb"
                />
                <div className="summary-info">
                  <h4>{game.title}</h4>
                  <p>
                    {quantity} x ${game.price.toFixed(2)}
                  </p>
                </div>
                <span className="summary-price">
                  ${(game.price * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <span>TOTAL CARGO VALUE:</span>
            <span className="total-val">${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
