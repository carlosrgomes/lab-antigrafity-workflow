import React, { useState, useEffect } from 'react';
import { IGame } from '../../shared/types.js';
import { GameCard } from './GameCard.js';
import { Search } from 'lucide-react';
import styles from './Catalog.module.css';

interface ICatalogProps {
  onSelectGame: (game: IGame) => void;
}

export const Catalog: React.FC<ICatalogProps> = ({ onSelectGame }) => {
  const [games, setGames] = useState<IGame[]>([]);
  const [search, setSearch] = useState('');
  const [selectedConsole, setSelectedConsole] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [loading, setLoading] = useState(true);

  const consoles = ['All', 'NES', 'SNES', 'MegaDrive', 'PS1', 'N64', 'GameBoy'];
  const rarities = ['All', 'Common', 'Rare', 'UltraRare'];

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedConsole !== 'All')
          params.append('console', selectedConsole);
        if (selectedRarity !== 'All') params.append('rarity', selectedRarity);

        const response = await fetch(`/api/games?${params.toString()}`);
        const data = await response.json();
        setGames(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error fetching games', e);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchGames();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedConsole, selectedRarity]);

  return (
    <div className={styles.container}>
      <div className={styles.filtersSection}>
        <div className={`${styles.searchBox} glass`}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Console:</span>
          <div className={styles.filterButtons}>
            {consoles.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedConsole(c)}
                className={`${styles.filterBtn} ${selectedConsole === c ? styles.active : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Rarity:</span>
          <div className={styles.filterButtons}>
            {rarities.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRarity(r)}
                className={`${styles.filterBtn} ${selectedRarity === r ? styles.active : ''}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.statusMsg}>Loading catalog...</div>
      ) : games.length === 0 ? (
        <div className={styles.statusMsg}>
          No games found. Try adjusting filters.
        </div>
      ) : (
        <div className={styles.grid}>
          {games.map((game) => (
            <GameCard key={game.id} game={game} onSelect={onSelectGame} />
          ))}
        </div>
      )}
    </div>
  );
};
