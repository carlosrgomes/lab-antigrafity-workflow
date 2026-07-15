import React from 'react';
import { IGame } from '../../shared/types.js';
import { useCart } from '../context/CartContext.js';
import { ShoppingCart } from 'lucide-react';
import styles from './GameCard.module.css';

interface IGameCardProps {
  game: IGame;
  onSelect: (game: IGame) => void;
}

export const GameCard: React.FC<IGameCardProps> = ({ game, onSelect }) => {
  const { addToCart } = useCart();

  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'UltraRare':
        return styles.rarityUltraRare;
      case 'Rare':
        return styles.rarityRare;
      default:
        return styles.rarityCommon;
    }
  };

  return (
    <div className={`${styles.card} glass`}>
      <div className={styles.imageContainer} onClick={() => onSelect(game)}>
        <img src={game.imageUrl} alt={game.title} className={styles.image} />
        <span className={`${styles.badge} ${getRarityClass(game.rarity)}`}>
          {game.rarity}
        </span>
        <span className={styles.consoleBadge}>{game.console}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title} onClick={() => onSelect(game)}>
          {game.title}
        </h3>
        <p className={styles.description}>{game.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>${game.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(game)}
            className={styles.button}
            disabled={game.stock === 0}
          >
            <ShoppingCart size={16} />
            {game.stock === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};
