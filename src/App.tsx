import { useState, useEffect } from 'react';
import { Switch, Route, Router as WouterRouter } from 'wouter';
import { ProductsProvider } from './context/ProductsContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { UserProfileProvider } from './context/UserProfileContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio';
import Recommendations from './pages/Recommendations';
import NotFound from './pages/NotFound';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/profile" component={Profile} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/recommendations" component={Recommendations} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('fintech_dark') === 'true'; } catch { return false; }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('fintech_dark', String(darkMode));
  }, [darkMode]);

  return (
    <ProductsProvider>
      <PortfolioProvider>
        <UserProfileProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode(v => !v)} />
            <Router />
          </WouterRouter>
        </UserProfileProvider>
      </PortfolioProvider>
    </ProductsProvider>
  );
}

export default App;
