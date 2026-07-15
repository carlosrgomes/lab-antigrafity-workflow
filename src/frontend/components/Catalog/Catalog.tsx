import React, { useEffect, useState } from 'react';
import { GameCard } from '../GameCard/GameCard.js';
import './Catalog.css';

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

interface ICatalogProps {
  onSelectGame: (gameId: string) => void;
}

/**
 * Product catalog displaying game search filters, console triggers, and responsive product grids.
 *
 * @param {ICatalogProps} props - Component properties.
 * @returns {React.ReactElement} The rendered Catalog component.
 */
export const Catalog: React.FC<ICatalogProps> = ({ onSelectGame }) => {
  const [games, setGames] = useState<IGame[]>([]);
  const [search, setSearch] = useState('');
  const [selectedConsole, setSelectedConsole] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = '/api/games';
    const params = [];
    if (search) params.push(`q=${encodeURIComponent(search)}`);
    if (selectedConsole)
      params.push(`console=${encodeURIComponent(selectedConsole)}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching catalog games:', err);
        setLoading(false);
      });
  }, [search, selectedConsole]);

  const filteredGames = games.filter((g) => {
    if (selectedRarity && g.rarity !== selectedRarity) return false;
    return true;
  });

  return (
    <div className="catalog-container">
      <aside className="catalog-sidebar glass-panel">
        <h2 className="text-neon-cyan">SEARCH FILTERS</h2>

        <div className="filter-section">
          <label>ROM RETRIEVAL</label>
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ROM title..."
          />
        </div>

        <div className="filter-section">
          <label>SYSTEM HARDWARE</label>
          <div className="console-buttons">
            <button
              className={`console-btn ${selectedConsole === '' ? 'active' : ''}`}
              onClick={() => setSelectedConsole('')}
            >
              ALL SYSTEMS
            </button>
            {['NES', 'SNES', 'MegaDrive', 'PS1', 'N64', 'GameBoy', 'PSP'].map(
              (sys) => (
                <button
                  key={sys}
                  className={`console-btn ${selectedConsole === sys ? 'active' : ''}`}
                  onClick={() => setSelectedConsole(sys)}
                >
                  {sys === 'MegaDrive'
                    ? 'MEGA DRIVE'
                    : sys === 'GameBoy'
                      ? 'GAME BOY'
                      : sys}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="filter-section">
          <label>COLLECTOR RARITY</label>
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="rarity-select"
          >
            <option value="">ALL VALUES</option>
            <option value="Common">COMMON</option>
            <option value="Rare">RARE</option>
            <option value="UltraRare">ULTRA RARE</option>
          </select>
        </div>
      </aside>

      <main className="catalog-main">
        <div className="crt-overlay"></div>
        {loading ? (
          <div className="catalog-loading">LOADING ROMS...</div>
        ) : filteredGames.length === 0 ? (
          <div className="catalog-empty">NO SOFTWARE DETECTED IN STORAGE.</div>
        ) : (
          <div className="catalog-grid">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} onSelectGame={onSelectGame} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
