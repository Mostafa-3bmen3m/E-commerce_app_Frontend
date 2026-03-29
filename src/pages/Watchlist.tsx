import { useEffect, useRef } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { useTheme } from '../store/useTheme';
import { useAuthStore } from '../store/useAuthStore';
import gsap from 'gsap';

const Watchlist = () => {
  const { items, toggleWatchlist, fetchWatchlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const pageRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user, fetchWatchlist]);

  useEffect(() => {
    if (items.length > 0) {
      gsap.fromTo('.watchlist-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [items]);

  const luxuryGradient = "bg-linear-to-r from-[#d4af37] via-[#f9e5af] to-[#d4af37]";
  const standardGradient = "bg-linear-to-r from-indigo-600 to-purple-600";
  const mainGradient = theme === 'gold' ? luxuryGradient : standardGradient;

  return (
    <div ref={pageRef} className="min-h-screen bg-custom-primary py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-custom-primary tracking-tighter">THE WATCHLIST</h1>
            <p className="text-custom-secondary text-lg max-w-xl font-medium">Your curated collection of premium essentials. Pieces that define excellence.</p>
          </div>
          <div className="flex items-center gap-4 text-custom-secondary font-black text-xs uppercase tracking-[0.2em]">
            <Heart size={16} className="text-red-500 fill-red-500" />
            <span>{items.length} CURATED PIECES</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-custom-secondary/20 border-2 border-dashed border-custom-secondary rounded-[60px] p-32 text-center space-y-8">
            <div className="w-24 h-24 bg-custom-secondary/50 rounded-full flex items-center justify-center mx-auto">
                <Heart size={40} className="text-custom-secondary/40" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-custom-primary tracking-tight uppercase">Your Vault is Empty</h2>
                <p className="text-custom-secondary font-medium">Discover excellence and start curating your dream collection.</p>
            </div>
            <Link 
              to="/products" 
              className={`inline-flex items-center gap-4 ${mainGradient} text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl ${theme === 'gold' ? 'shadow-[#d4af37]/30' : 'shadow-indigo-500/50'}`}
            >
              Explore Collections
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((product) => (
              <div key={product.id} className="watchlist-item group bg-custom-primary border-4 border-custom-secondary rounded-[48px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative">
                <div className="aspect-4/5 overflow-hidden relative">
                    <img 
                        src={product.images[0] || 'https://via.placeholder.com/500'} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        alt={product.name} 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent text-white p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="flex gap-2 mb-4">
                            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-[10px] font-black tracking-widest">4.9 RATING</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-custom-primary tracking-tighter truncate">{product.name}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-custom-secondary">Authentic series</p>
                        </div>
                        <span className={`text-3xl font-black tracking-tighter ${theme === 'gold' ? 'text-[#d4af37]' : 'text-custom-primary'}`}>
                            ${product.price}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => toggleWatchlist(product)}
                            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-custom-secondary/50 text-custom-secondary hover:text-red-500 hover:bg-red-500/10 transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            <Trash2 size={16} />
                            Remove
                        </button>
                        <button 
                            onClick={() => addItem(product)}
                            className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-white transition-all shadow-lg active:scale-95 font-black uppercase tracking-widest text-[10px] ${
                                theme === 'gold' ? 'bg-[#d4af37] text-black shadow-[#d4af37]/20' : 'bg-gray-900 text-white shadow-black/20'
                            }`}
                        >
                            <ShoppingBag size={16} />
                            Acquire
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
