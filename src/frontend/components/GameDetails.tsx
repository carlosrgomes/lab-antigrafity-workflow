import React, { useState } from 'react';
import { IGame } from '../../shared/types.js';
import { useCart } from '../context/CartContext.js';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import styles from './GameDetails.module.css';

interface IGameDetailsProps {
  game: IGame;
  onBack: () => void;
}

export const GameDetails: React.FC<IGameDetailsProps> = ({ game, onBack }) => {
  const { addToCart } = useCart();
  const screenshots: string[] = JSON.parse(game.screenshots || '[]');
  const [activeImage, setActiveImage] = useState<string>(game.imageUrl);

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={`${styles.backBtn} glass`}>
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className={styles.content}>
        <div className={styles.media}>
          <div className={`${styles.mainImageContainer} glass`}>
            <img
              src={activeImage}
              alt={game.title}
              className={styles.mainImage}
            />
          </div>
          <div className={styles.carousel}>
            <div
              className={`${styles.thumbnail} ${activeImage === game.imageUrl ? styles.activeThumb : ''}`}
              onClick={() => setActiveImage(game.imageUrl)}
            >
              <img src={game.imageUrl} alt="Box Art" />
            </div>
            {screenshots.map((url, idx) => (
              <div
                key={idx}
                className={`${styles.thumbnail} ${activeImage === url ? styles.activeThumb : ''}`}
                onClick={() => setActiveImage(url)}
              >
                <img src={url} alt={`Screenshot ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.details} glass`}>
          <div className={styles.header}>
            <span className={styles.consoleBadge}>{game.console}</span>
            <span className={styles.rarity}>{game.rarity} Rarity</span>
          </div>

          <h1 className={styles.title}>{game.title}</h1>
          <p className={styles.description}>{game.description}</p>

          <div className={styles.specs}>
            <h3 className={styles.specsTitle}>Technical specs</h3>
            <div className={styles.specRow}>
              <span>Condition</span>
              <span>CIB (Complete in Box)</span>
            </div>
            <div className={styles.specRow}>
              <span>Stock Status</span>
              <span>
                {game.stock > 0
                  ? `${game.stock} units available`
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>${game.price.toFixed(2)}</span>
            <button
              onClick={() => addToCart(game)}
              className={styles.addBtn}
              disabled={game.stock === 0}
            >
              <ShoppingCart size={18} />
              {game.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
