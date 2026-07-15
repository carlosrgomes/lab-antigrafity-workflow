import React from 'react';
import './VictoryScreen.css';

interface IVictoryScreenProps {
  order: any;
  onRestart: () => void;
}

/**
 * Animated success screen resembling arcade game victory screens ("STAGE CLEAR" / "GAME OVER").
 *
 * @param {IVictoryScreenProps} props - Component properties.
 * @returns {React.ReactElement} The rendered VictoryScreen component.
 */
export const VictoryScreen: React.FC<IVictoryScreenProps> = ({
  order,
  onRestart,
}) => {
  return (
    <div className="victory-container">
      <div className="victory-box glass-panel animate-victory">
        <h1 className="victory-title text-neon-cyan">STAGE CLEAR</h1>
        <div className="pixel-trophy">&#x1F3C6;</div>

        <div className="victory-details">
          <p className="status-text">MISSION ACCOMPLISHED</p>
          <div className="order-stats">
            <div>
              <span>SECTOR ID:</span>
              <span className="stat-val">{order.id}</span>
            </div>
            <div>
              <span>CREDITS TRANSFERRED:</span>
              <span className="stat-val text-neon-purple">
                ${order.total.toFixed(2)}
              </span>
            </div>
            <div>
              <span>SECURITY KEY:</span>
              <span className="stat-val">AUTHORIZED</span>
            </div>
          </div>
        </div>

        <button className="btn-restart btn-cyber" onClick={onRestart}>
          RETURN TO VAULT
        </button>
      </div>
    </div>
  );
};
