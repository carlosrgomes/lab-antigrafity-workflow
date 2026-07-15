import React from 'react';
import { useCart } from '../../context/CartContext.js';
import './Header.css';

interface IHeaderProps {
  onCartToggle: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  crtEnabled: boolean;
  onCrtToggle: () => void;
}

/**
 * Top navigation bar containing logo, navigation links, roles toggle, and cart indicator.
 *
 * @param {IHeaderProps} props - Component properties.
 * @returns {React.ReactElement} The rendered Header component.
 */
export const Header: React.FC<IHeaderProps> = ({
  onCartToggle,
  onNavigate,
  currentPage,
  crtEnabled,
  onCrtToggle,
}) => {
  const { totalItems, isAdmin, toggleAdmin } = useCart();

  return (
    <header className="header glass-panel">
      <div className="header-logo" onClick={() => onNavigate('catalog')}>
        <img
          src="https://img.icons8.com/isometric/50/retro-controller.png"
          alt="RetroVault Controller Logo"
          className="logo-icon"
        />
        <h1 className="logo-text text-neon-purple">RetroVault</h1>
      </div>

      <nav className="header-nav">
        <button
          className={`nav-link ${currentPage === 'catalog' ? 'active' : ''}`}
          onClick={() => onNavigate('catalog')}
        >
          Catalog
        </button>
        {isAdmin && (
          <button
            className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            Admin Panel
          </button>
        )}
      </nav>

      <div className="header-actions">
        <label
          className="crt-toggle-label"
          title="Toggle retro CRT scanlines overlay"
        >
          <input
            type="checkbox"
            checked={crtEnabled}
            onChange={onCrtToggle}
            className="crt-checkbox"
          />
          CRT EFFECT
        </label>

        <button
          className={`btn-role ${isAdmin ? 'admin' : 'customer'}`}
          onClick={toggleAdmin}
        >
          {isAdmin ? 'ADMIN MODE' : 'CUSTOMER MODE'}
        </button>

        <button className="cart-trigger" onClick={onCartToggle}>
          <svg
            className="cart-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>
    </header>
  );
};
