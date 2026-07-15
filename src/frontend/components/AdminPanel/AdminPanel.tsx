import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

interface IGameAdmin {
  id: string;
  title: string;
  price: number;
  console: string;
  stock: number;
}

interface IAdminPanelProps {
  onBack: () => void;
}

/**
 * Administrative panel to insert, review, and delete retro games in the inventory.
 *
 * @param {IAdminPanelProps} props - Component properties.
 * @returns {React.ReactElement} The rendered AdminPanel component.
 */
export const AdminPanel: React.FC<IAdminPanelProps> = ({ onBack }) => {
  const [games, setGames] = useState<IGameAdmin[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rarity, setRarity] = useState<'Common' | 'Rare' | 'UltraRare'>('Common');
  const [consoleName, setConsoleName] = useState('SNES');
  const [stock, setStock] = useState('10');
  const [condition, setCondition] = useState('CIB');
  const [developer, setDeveloper] = useState('');
  const [releaseYear, setReleaseYear] = useState('1990');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = () => {
    fetch('/api/games')
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((err) => console.error('Error fetching admin games:', err));
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      title,
      description,
      price: parseFloat(price),
      rarity,
      consoleName,
      stock: parseInt(stock),
      condition,
      developer,
      releaseYear: parseInt(releaseYear),
      screenshots: [
        '/images/screenshots/placeholder_1.png',
        '/images/screenshots/placeholder_2.png',
      ],
    };

    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create game.');
      }
      setTitle('');
      setDescription('');
      setPrice('');
      setDeveloper('');
      fetchGames();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/games/${id}`, { method: 'DELETE' });
      fetchGames();
    } catch (err) {
      console.error('Error deleting game:', err);
    }
  };

  return (
    <div className="admin-container">
      <button className="btn-back" onClick={onBack}>
        &larr; BACK TO VAULT
      </button>

      <div className="admin-grid">
        <form className="admin-form glass-panel" onSubmit={handleSubmit}>
          <h2 className="text-neon-cyan">INSERT RETRO ROM DATA</h2>
          {error && <div className="admin-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>ROM TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Super Metroid"
                required
              />
            </div>
            <div className="form-group">
              <label>CONSOLE HARDWARE</label>
              <select
                value={consoleName}
                onChange={(e) => setConsoleName(e.target.value)}
              >
                <option value="NES">NES</option>
                <option value="SNES">SNES</option>
                <option value="MegaDrive">Mega Drive</option>
                <option value="PS1">PlayStation 1</option>
                <option value="N64">Nintendo 64</option>
                <option value="GameBoy">Game Boy</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>DESCRIPTION LOGS</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter game mission specifications..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>PRICE (USD)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.99"
                required
              />
            </div>
            <div className="form-group">
              <label>INITIAL STOCK</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="5"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>COLLECTOR CONDITION</label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="Mint, CIB, Good"
                required
              />
            </div>
            <div className="form-group">
              <label>RARITY INDEX</label>
              <select
                value={rarity}
                onChange={(e) =>
                  setRarity(e.target.value as 'Common' | 'Rare' | 'UltraRare')
                }
              >
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="UltraRare">Ultra Rare</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>DEVELOPER GROUP</label>
              <input
                type="text"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                placeholder="Intelligent Systems"
                required
              />
            </div>
            <div className="form-group">
              <label>RELEASE YEAR</label>
              <input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                placeholder="1994"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-admin-submit btn-cyber"
            disabled={submitting}
          >
            {submitting ? 'COMPILING DATA...' : 'WRITE TO VAULT DATABASE'}
          </button>
        </form>

        <div className="admin-list-panel glass-panel">
          <h2 className="text-neon-purple">DATABASE DIRECTORY</h2>
          <div className="admin-games-list">
            {games.map((g) => (
              <div key={g.id} className="admin-game-row">
                <div className="admin-game-info">
                  <h4>{g.title}</h4>
                  <span className="console-tag">{g.console}</span>
                  <p>
                    ${g.price.toFixed(2)} | {g.stock} units
                  </p>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(g.id)}
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
