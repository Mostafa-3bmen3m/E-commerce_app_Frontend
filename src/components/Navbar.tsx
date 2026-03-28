import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search, Sun, Moon, Sparkles, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useTheme } from '../store/useTheme';

const Navbar = () => {
  const { logout, isAuthenticated, user } = useAuthStore();
  const { items } = useCartStore();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const themeIcons = {
    light: <Sun size={20} />,
    dark: <Moon size={20} />,
    gold: <Sparkles size={20} className="text-yellow-500" />
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('gold');
    else setTheme('light');
  };

  return (
    <nav className="fixed w-full z-50 bg-custom-primary/80 backdrop-blur-md border-b border-custom shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className={`text-2xl font-bold ${theme === 'gold' ? 'text-custom-secondary' : 'bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'}`}>
              LUMINA
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-custom-secondary hover:text-accent transition-colors">Shop</Link>
            <Link to="/categories" className="text-custom-secondary hover:text-accent transition-colors">Categories</Link>
            <Link to="/about" className="text-custom-secondary hover:text-accent transition-colors">About</Link>
            <Link to="/contact" className="text-custom-secondary hover:text-accent transition-colors">Contact</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="flex items-center space-x-1 text-accent font-bold hover:opacity-80 transition-all">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={cycleTheme}
              className="p-2 text-custom-secondary hover:bg-custom-secondary/20 rounded-full transition-all hover:rotate-12"
              title={`Current Theme: ${theme}`}
            >
              {themeIcons[theme]}
            </button>

            <button className="p-2 text-custom-secondary hover:bg-custom-secondary/20 rounded-full transition-colors">
              <Search size={20} />
            </button>
            
            <Link to="/cart" className="p-2 text-custom-secondary hover:bg-custom-secondary/20 rounded-full transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="p-2 text-custom-secondary hover:bg-custom-secondary/20 rounded-full transition-colors">
                  <User size={20} />
                </Link>
                <button onClick={logout} className="p-2 text-custom-secondary hover:bg-custom-secondary/20 rounded-full transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors">
                Login
              </Link>
            )}

            <button className="md:hidden p-2 text-custom-secondary" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>


      {isOpen && (
        <div className="md:hidden bg-custom-primary border-b border-custom py-4 px-4 space-y-4">
          <Link to="/products" className="block text-custom-secondary">Shop</Link>
          <Link to="/categories" className="block text-custom-secondary">Categories</Link>
          <Link to="/about" className="block text-custom-secondary">About</Link>
          <Link to="/contact" className="block text-custom-secondary">Contact</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="flex items-center space-x-2 text-accent font-bold py-2 border-t border-custom mt-2" onClick={() => setIsOpen(false)}>
              <LayoutDashboard size={20} />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
