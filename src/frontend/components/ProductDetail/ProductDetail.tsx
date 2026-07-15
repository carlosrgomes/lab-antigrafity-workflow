import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext.js';
import './ProductDetail.css';

interface IGameDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  rarity: string;
  console: string;
  stock: number;
  imageUrl: string;
  condition: string;
  developer: string;
  releaseYear: number;
  screenshots: { id: string; url: string }[];
}

interface IProductDetailProps {
  gameId: string;
  onBack: () => void;
}

/**
 * Product detail page showcasing box art hero zoom, screenshots carousel, tech specifications, and add-to-cart.
 *
 * @param {IProductDetailProps} props - Component properties.
 * @returns {React.ReactElement} The rendered ProductDetail component.
 */
export const ProductDetail: React.FC<IProductDetailProps> = ({
  gameId,
  onBack,
}) => {
  const { addToCart } = useCart();
  const [game, setGame] = useState<IGameDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`/api/games/${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setSelectedImage(data.imageUrl);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching game details:', err);
        setLoading(false);
      });
  }, [gameId]);

  if (loading) return <div className="detail-loading">INITIALIZING SYSTEM...</div>;
  if (!game) return <div className="detail-loading">GAME ACQUISITION ERROR.</div>;

  return (
    <div className="product-detail-container">
      <button className="btn-back" onClick={onBack}>
        &larr; BACK TO VAULT
      </button>

      <div className="product-detail glass-panel">
        <div className="media-gallery">
          <div className="main-display">
            <img src={selectedImage} alt={game.title} className="hero-img" />
          </div>
          <div className="gallery-carousel">
            <img
              src={game.imageUrl}
              alt="boxart thumb"
              className={`thumb-img ${selectedImage === game.imageUrl ? 'active' : ''}`}
              onClick={() => setSelectedImage(game.imageUrl)}
            />
            {game.screenshots.map((snap) => (
              <img
                key={snap.id}
                src={snap.url}
                alt="gameplay snap"
                className={`thumb-img ${selectedImage === snap.url ? 'active' : ''}`}
                onClick={() => setSelectedImage(snap.url)}
              />
            ))}
          </div>
        </div>

        <div className="spec-info">
          <h2 className="detail-title text-neon-cyan">{game.title}</h2>
          <span className="console-badge">{game.console} Hardware</span>
          <p className="detail-desc">{game.description}</p>

          <table className="tech-table">
            <tbody>
              <tr>
                <td>DEVELOPER:</td>
                <td>{game.developer}</td>
              </tr>
              <tr>
                <td>RELEASE YEAR:</td>
                <td>{game.releaseYear}</td>
              </tr>
              <tr>
                <td>CARTRIDGE CONDITION:</td>
                <td className="text-neon-purple">{game.condition}</td>
              </tr>
              <tr>
                <td>COLLECTIBILITY RARITY:</td>
                <td>{game.rarity}</td>
              </tr>
              <tr>
                <td>VAULT STOCK:</td>
                <td>{game.stock > 0 ? `${game.stock} UNITS` : 'OUT OF STOCK'}</td>
              </tr>
            </tbody>
          </table>

          <div className="spec-footer">
            <span className="price-tag">${game.price.toFixed(2)}</span>
            <button
              className="btn-buy-large btn-cyber"
              disabled={game.stock === 0}
              onClick={() => addToCart(game)}
            >
              {game.stock > 0 ? 'ACQUIRE GAME' : 'OUT OF STOCK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
