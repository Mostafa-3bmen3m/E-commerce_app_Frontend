import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Star, Shield, Truck, RotateCcw, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../store/useTheme';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import api from '../api/axios';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProductSkeleton, CategorySkeleton } from '../components/common/Skeleton';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { theme } = useTheme();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const categoriesRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products', { params: { limit: 4, sort: 'newest' } }),
          api.get('/categories')
        ]);
        setLatestProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Hero Animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-badge', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8 })
        .fromTo('.hero-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, '-=0.5')
        .fromTo('.hero-text', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .fromTo('.hero-btns', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .fromTo('.hero-img', { opacity: 0, scale: 0.8, rotate: 10 }, { opacity: 1, scale: 1, rotate: 3, duration: 1.2, ease: 'back.out(1.7)' }, '-=1');

      // Featured Section Scroll Animation
      gsap.fromTo('.featured-card', 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.2,
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 80%',
          }
        }
      );

      // Categories Section Scroll Animation
      gsap.fromTo('.category-card',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.3,
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: 'top 80%',
          }
        }
      );
    }
  }, [loading]);

  const luxuryGradient = "bg-linear-to-r from-[#d4af37] via-[#f9e5af] to-[#d4af37]";
  const standardGradient = "bg-linear-to-r from-indigo-600 to-purple-600";
  const mainGradient = theme === 'gold' ? luxuryGradient : standardGradient;

  return (
    <div className="overflow-hidden bg-custom-primary min-h-screen">
      <section ref={heroRef} className="relative h-[95vh] flex items-center bg-custom-secondary px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8 z-10">
            <span className={`hero-badge inline-block px-4 py-1.5 text-sm font-semibold rounded-full ${
                theme === 'gold' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              New Collection 2024
            </span>
            <h1 className="hero-title text-6xl md:text-8xl font-black text-custom-primary leading-none tracking-tight">
              Elevate Your <br />
              <span className={`text-transparent bg-clip-text ${mainGradient}`}>
                Daily Routine
              </span>
            </h1>
            <p className="hero-text text-xl text-custom-secondary max-w-lg leading-relaxed">
              Discover a curated collection of premium essentials designed to improve your lifestyle and home. Experience the art of fine living.
            </p>
            <div className="hero-btns flex flex-wrap gap-4 pt-4">
              <Link to="/products" className={`${mainGradient} text-white px-10 py-5 rounded-2xl font-bold flex items-center space-x-3 hover:scale-105 active:scale-95 transition-all shadow-2xl ${theme === 'gold' ? 'shadow-[#d4af37]/30' : 'shadow-indigo-500/50'}`}>
                <span>Shop the Collection</span>
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/categories" className="bg-custom-primary border-2 border-custom-secondary text-custom-primary px-8 py-5 rounded-2xl hover:border-accent transition-all font-bold group">
                Explore Categories
              </Link>
            </div>
          </div>
          
          <div className="hero-img relative hidden lg:block perspective-1000">
            <div className={`absolute -inset-10 rounded-full blur-3xl opacity-20 animate-pulse ${theme === 'gold' ? 'bg-[#d4af37]' : 'bg-indigo-500'}`}></div>
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop" 
              alt="Hero Product" 
              className={`relative rounded-[40px] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-1000 border-4 ${theme === 'gold' ? 'border-[#d4af37]/30 shadow-[#d4af37]/20' : 'border-white/10 shadow-black/40'}`}
            />
          </div>
        </div>
        
        {/* Floating elements for visual depth */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-custom-secondary animate-bounce opacity-40">
            <span className="text-xs font-bold uppercase tracking-widest text-center">Scroll to explore</span>
            <div className="w-px h-10 bg-custom-secondary"></div>
        </div>
      </section>

      <section className="py-20 bg-custom-primary border-y border-custom-secondary relative z-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { Icon: Truck, title: "Next Day Delivery", desc: "Premium shipping on all orders" },
            { Icon: RotateCcw, title: "White Glove Service", desc: "Hassle-free 30-day returns" },
            { Icon: Shield, title: "Vault Security", desc: "100% encrypted transactions" },
            { Icon: Star, title: "Curated Luxury", desc: "Handpicked premium products" }
          ].map((feature, i) => (
            <div key={i} className="flex items-center space-x-5 p-6 bg-custom-secondary/30 rounded-[32px] hover:bg-custom-secondary/50 transition-all cursor-default border border-transparent hover:border-custom">
              <div className={`p-4 rounded-2xl ${theme === 'gold' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'bg-indigo-50 text-indigo-600'}`}>
                <feature.Icon size={28} />
              </div>
              <div>
                <h4 className="font-black text-custom-primary text-lg">{feature.title}</h4>
                <p className="text-sm text-custom-secondary font-medium">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section ref={featuredRef} className="py-32 px-4 bg-custom-secondary/20 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-custom-primary tracking-tight">Featured Selections</h2>
              <p className="text-custom-secondary text-lg max-w-xl">Intelligently crafted, beautifully designed. Elevate your everyday with our latest arrivals.</p>
            </div>
            <Link to="/products" className="group text-accent font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all pr-4">
              <span>View the full gallery</span> 
              <ArrowRight size={24} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {loading ? (
                Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              latestProducts.map((product: any) => (
                <div key={product.id} className="featured-card group bg-custom-primary rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-custom relative">
                  <Link to={`/products/${product.id}`} className="block aspect-4/5 overflow-hidden relative">
                    <img 
                      src={product.images[0] || `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={product.name}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                  
                  <button 
                    onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist({ id: product.id, name: product.name, price: product.price, images: product.images })}
                    className={`absolute top-5 right-5 p-3 rounded-full backdrop-blur-md transition-all z-20 ${
                      isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
                    }`}
                  >
                    <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  </button>

                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${theme === 'gold' ? 'text-[#d4af37]' : 'text-accent'}`}>
                                {product.category?.name}
                            </p>
                            <h3 className="text-xl font-bold text-custom-primary truncate leading-tight">{product.name}</h3>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-custom-primary">${product.price}</span>
                        <div className="flex items-center gap-1 mt-1">
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-bold text-custom-secondary">{product.rating || '4.8'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => addItem(product)}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-90 ${
                        theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b]' : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-black/10'
                      }`}>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section ref={categoriesRef} className="py-32 px-4 bg-custom-primary relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-6xl font-black text-custom-primary tracking-tighter">Shop by Experience</h2>
            <p className="text-custom-secondary text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Curated categories designed to help you find the perfect piece for your lifestyle and home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading ? (
                Array(3).fill(0).map((_, i) => <CategorySkeleton key={i} />)
            ) : (
                categories.map((cat: any) => (
                <Link 
                    key={cat.id} 
                    to={`/products?category=${cat.id}`}
                    className="category-card group relative h-[500px] rounded-[48px] overflow-hidden cursor-pointer shadow-2xl border border-custom"
                >
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/80 z-10 transition-all duration-700 group-hover:via-black/40"></div>
                    <img 
                    src={cat.image || `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
                    alt={cat.name} 
                    />
                    <div className="absolute bottom-12 left-12 z-20 space-y-4">
                    <h3 className="text-5xl font-black text-white leading-none tracking-tight group-hover:text-[#d4af37] transition-colors duration-500">{cat.name}</h3>
                    <div className="flex items-center gap-3">
                        <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest group-hover:bg-white/40 transition-colors">
                            {cat._count?.products || 0} Pieces
                        </span>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                            <ArrowRight size={20} className="text-black" />
                        </div>
                    </div>
                    </div>
                </Link>
                ))
            )}
          </div>
          
          <div className="text-center pt-8">
             <Link to="/categories" className="inline-flex items-center gap-4 bg-custom-secondary text-custom-primary px-10 py-5 rounded-full font-black text-lg hover:bg-accent hover:text-white transition-all transform hover:-translate-y-1">
                Explore All Collections
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <ArrowRight size={18} />
                </div>
             </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter / CTA Section */}
      <section className="py-24 px-4">
        <div className={`max-w-7xl mx-auto rounded-[60px] p-12 md:p-24 text-center space-y-8 relative overflow-hidden ${theme === 'gold' ? 'bg-[#d4af37] text-black shadow-[#d4af37]/40 shadow-2xl' : 'bg-gray-900 text-white shadow-2xl shadow-black/30'}`}>
            <div className="relative z-10 space-y-6">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Join the INNER CIRCLE</h2>
                <p className="max-w-xl mx-auto text-lg font-medium opacity-80">Be the first to receive exclusive access to new collections and invitations to our private events.</p>
                <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 pt-6" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className={`flex-1 px-8 py-5 rounded-3xl font-bold bg-white/10 backdrop-blur-md border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-white/50 placeholder:text-white/40 ${theme === 'gold' ? 'bg-black/10 text-black border-black/20 placeholder:text-black/40' : ''}`}
                    />
                    <button className={`px-10 py-5 rounded-3xl font-black transition-all transform hover:scale-105 active:scale-95 ${theme === 'gold' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-100'}`}>
                        Subscribe
                    </button>
                </form>
            </div>
            
            {/* Background art element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black opacity-10 blur-[80px] translate-y-1/2 -translate-x-1/2 rounded-full"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
