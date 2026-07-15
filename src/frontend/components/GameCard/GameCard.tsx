import React from 'react';
import { useCart } from '../../context/CartContext.js';
import './GameCard.css';

interface IGame {
  id: string;
  title: string;
  price: number;
  rarity: string;
  console: string;
  stock: number;
  imageUrl: string;
  condition: string;
  developer: string;
  releaseYear: number;
}

interface IGameCardProps {
  game: IGame;
  onSelectGame: (gameId: string) => void;
}

/**
 * Interactive product card showing game visual art, pricing, console type, condition, and availability.
 *
 * @param {IGameCardProps} props - Component properties.
 * @returns {React.ReactElement} The rendered GameCard component.
 */
export const GameCard: React.FC<IGameCardProps> = ({ game, onSelectGame }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (game.stock > 0) {
      addToCart(game);
    }
  };

  const getRarityClass = () => {
    switch (game.rarity) {
      case 'UltraRare':
        return 'rarity-ultra';
      case 'Rare':
        return 'rarity-rare';
      default:
        return 'rarity-common';
    }
  };

  return (
    <div className="game-card glass-panel" onClick={() => onSelectGame(game.id)}>
      <div className="card-image-container">
        <img src={game.imageUrl} alt={game.title} className="card-image" />
        <span className={`rarity-badge ${getRarityClass()}`}>
          {game.rarity === 'UltraRare' ? 'ULTRA RARE' : game.rarity.toUpperCase()}
        </span>
        <span className="console-tag">{game.console}</span>
      </div>

      <div className="card-content">
        <h3 className="game-title">{game.title}</h3>
        <div className="game-meta">
          <span className="condition-badge">{game.condition}</span>
          <span className="stock-info">
            {game.stock > 0 ? `${game.stock} IN STOCK` : 'OUT OF STOCK'}
          </span>
        </div>
        <div className="card-footer">
          <span className="price">${game.price.toFixed(2)}</span>
          <button
            className="btn-add-cart btn-cyber"
            disabled={game.stock === 0}
            onClick={handleAddToCart}
          >
            {game.stock > 0 ? 'BUY' : 'SOLD'}
          </button>
        </div>
      </div>
    </div>
  );
};
