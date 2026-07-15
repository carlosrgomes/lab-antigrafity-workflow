import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext.js';
import { Catalog } from './components/Catalog.js';
import { GameDetails } from './components/GameDetails.js';
import { CartSidebar } from './components/CartSidebar.js';
import { Checkout } from './components/Checkout.js';
import { ShoppingBag, Gamepad2 } from 'lucide-react';
import { IGame } from '../shared/types.js';
import styles from './App.module.css';

interface IAppContentProps {
  view: 'catalog' | 'details' | 'checkout';
  selectedGame: IGame | null;
  onSelectGame: (game: IGame) => void;
  onBack: () => void;
}

const AppContent: React.FC<IAppContentProps> = ({
  view,
  selectedGame,
  onSelectGame,
  onBack,
}) => {
  if (view === 'details' && selectedGame) {
    return <GameDetails game={selectedGame} onBack={onBack} />;
  }
  if (view === 'checkout') {
    return <Checkout onBack={onBack} />;
  }
  return <Catalog onSelectGame={onSelectGame} />;
};

const MainApp: React.FC = () => {
  const { getCartCount } = useCart();
  const [view, setView] = useState<'catalog' | 'details' | 'checkout'>(
    'catalog',
  );
  const [selectedGame, setSelectedGame] = useState<IGame | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const handleSelectGame = (game: IGame) => {
    setSelectedGame(game);
    setView('details');
  };

  const handleStartCheckout = () => {
    setCartOpen(false);
    setView('checkout');
  };

  return (
    <div className={styles.app}>
      <header className={`${styles.header} glass`}>
        <div className={styles.logo} onClick={() => setView('catalog')}>
          <Gamepad2 size={28} className={styles.logoIcon} />
          <span className={`${styles.logoText} text-gradient`}>RETROVAULT</span>
        </div>
        <button
          className={styles.cartIconBtn}
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag size={22} />
          {getCartCount() > 0 && (
            <span className={styles.badge}>{getCartCount()}</span>
          )}
        </button>
      </header>

      <main className={styles.main}>
        <AppContent
          view={view}
          selectedGame={selectedGame}
          onSelectGame={handleSelectGame}
          onBack={() => setView('catalog')}
        />
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 RetroVault E-commerce. Powered by Antigravity OS.</p>
      </footer>

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleStartCheckout}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
};
export default App;
