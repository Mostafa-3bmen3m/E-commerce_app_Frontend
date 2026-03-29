import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search, Sun, Moon, Sparkles, LayoutDashboard, Heart } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useTheme } from '../store/useTheme';
import { useDebounce } from '../hooks/useDebounce';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout, isAuthenticated, user } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const debouncedSearch = useDebounce(searchTerm, 500);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      if (debouncedSearch.trim()) {
        navigate(`/products?search=${encodeURIComponent(debouncedSearch.trim())}`);
      } else if (searchParams.get('search')) {
        navigate('/products');
      }
    }
  }, [debouncedSearch, navigate]);

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
        <div className="flex justify-between h-16 items-center gap-4">
          <div className="flex items-center">
            <Link to="/" className={`text-2xl font-bold ${theme === 'gold' ? 'text-custom-secondary' : 'bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'}`}>
              LUMINA
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            <Link to="/products" className="text-custom-secondary hover:text-accent font-medium transition-colors">Shop</Link>
            <Link to="/categories" className="text-custom-secondary hover:text-accent font-medium transition-colors">Categories</Link>
            <Link to="/about" className="text-custom-secondary hover:text-accent font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-custom-secondary hover:text-accent font-medium transition-colors">Contact</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="flex items-center space-x-1 text-accent font-bold hover:opacity-80 transition-all border-l border-custom pl-4">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Bar */}
            <div className={`relative flex items-center ${isSearchOpen ? 'w-full md:w-64' : 'w-10 md:w-10 overflow-hidden'} transition-all duration-300`}>
              <input
                type="text"
                placeholder="Search products..."
                className={`w-full bg-custom-secondary/10 border border-custom rounded-full py-1.5 pl-10 pr-4 focus:outline-hidden focus:ring-1 focus:ring-accent ${isSearchOpen ? 'opacity-100' : 'opacity-0 cursor-default'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => !searchTerm && setIsSearchOpen(false)}
              />
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute left-0 p-2 text-custom-secondary hover:bg-custom-secondary/20 rounded-full transition-colors flex items-center justify-center z-10"
              >
                <Search size={20} />
              </button>
            </div>

            <button
              onClick={cycleTheme}
              className="p-2 text-custom-secondary hover:bg-custom-secondary/20 rounded-full transition-all hover:rotate-12"
              title={`Current Theme: ${theme}`}
            >
              {themeIcons[theme]}
            </button>

            <Link to="/wishlist" className="p-2 text-custom-secondary hover:bg-custom-secondary/20 rounded-full transition-colors relative hidden sm:flex">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="p-2 text-custom-secondary hover:bg-custom-secondary/20 rounded-full transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-1 md:space-x-2">
                <Link to="/profile" className="p-2 text-custom-secondary hover:bg-custom-secondary/20 rounded-full transition-colors">
                  <User size={20} />
                </Link>
                <button onClick={logout} className="p-2 text-custom-secondary hover:bg-custom-secondary/20 rounded-full transition-colors text-red-500/80 hover:text-red-500">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-all transform hover:scale-105 active:scale-95 text-sm md:text-base">
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
        <div className="md:hidden bg-custom-primary border-b border-custom py-4 px-4 space-y-4 animate-in slide-in-from-top duration-300">
          <Link to="/products" className="block text-custom-secondary font-medium" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link to="/categories" className="block text-custom-secondary font-medium" onClick={() => setIsOpen(false)}>Categories</Link>
          <Link to="/about" className="block text-custom-secondary font-medium" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" className="block text-custom-secondary font-medium" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link to="/wishlist" className="block text-custom-secondary font-medium sm:hidden" onClick={() => setIsOpen(false)}>Wishlist ({wishlistCount})</Link>
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
