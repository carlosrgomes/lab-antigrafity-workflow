import React, { useState } from 'react';
import { CartProvider } from './context/CartContext.js';
import { Header } from './components/Header/Header.js';
import { Catalog } from './components/Catalog/Catalog.js';
import { ProductDetail } from './components/ProductDetail/ProductDetail.js';
import { CartSidebar } from './components/CartSidebar/CartSidebar.js';
import { Checkout } from './components/Checkout/Checkout.js';
import { VictoryScreen } from './components/VictoryScreen/VictoryScreen.js';
import { AdminPanel } from './components/AdminPanel/AdminPanel.js';

/**
 * Core Application Router component wrapping context and rendering page states.
 *
 * @returns {React.ReactElement} The main App component.
 */
const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('catalog');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('crt_enabled');
    return saved !== 'false';
  });

  const handleCrtToggle = () => {
    setCrtEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('crt_enabled', String(next));
      return next;
    });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedGameId(null);
  };

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentPage('detail');
  };

  const handleCheckoutSuccess = (order: any) => {
    setLastOrder(order);
    setCurrentPage('victory');
  };

  const renderPage = (): React.ReactElement => {
    switch (currentPage) {
      case 'detail':
        return (
          <ProductDetail
            gameId={selectedGameId || ''}
            onBack={() => handleNavigate('catalog')}
          />
        );
      case 'checkout':
        return (
          <Checkout
            onBack={() => handleNavigate('catalog')}
            onSuccess={handleCheckoutSuccess}
          />
        );
      case 'victory':
        return (
          <VictoryScreen
            order={lastOrder}
            onRestart={() => handleNavigate('catalog')}
          />
        );
      case 'admin':
        return <AdminPanel onBack={() => handleNavigate('catalog')} />;
      default:
        return <Catalog onSelectGame={handleSelectGame} />;
    }
  };

  return (
    <div className="app-layout">
      {crtEnabled && <div className="crt-overlay"></div>}
      <Header
        onCartToggle={() => setIsCartOpen((prev) => !prev)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        crtEnabled={crtEnabled}
        onCrtToggle={handleCrtToggle}
      />
      <main className="app-main">{renderPage()}</main>
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

/**
 * Main application entry point component.
 *
 * @returns {React.ReactElement} The entry point React component.
 */
export const App: React.FC = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};
