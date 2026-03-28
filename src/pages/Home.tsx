import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Truck, RotateCcw, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../store/useTheme';
import api from '../api/axios';

const Home = () => {
  const { theme } = useTheme();
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const luxuryGradient = "bg-linear-to-r from-[#d4af37] via-[#f9e5af] to-[#d4af37]";
  const standardGradient = "bg-linear-to-r from-indigo-600 to-purple-600";
  const mainGradient = theme === 'gold' ? luxuryGradient : standardGradient;

  return (
    <div className="overflow-hidden bg-custom-primary">
      <section className="relative h-[90vh] flex items-center bg-custom-secondary px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`inline-block px-4 py-1.5 text-sm font-semibold rounded-full ${
                theme === 'gold' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              New Collection 2024
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-7xl font-extrabold text-custom-primary leading-[1.1]"
            >
              Elevate Your <br />
              <span className={`text-transparent bg-clip-text ${mainGradient}`}>
                Daily Routine
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-custom-secondary max-w-lg"
            >
              Discover a curated collection of premium essentials designed to improve your lifestyle and home.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products" className={`${mainGradient} text-white px-10 py-5 rounded-2xl font-bold flex items-center space-x-3 hover:scale-105 transition-transform shadow-2xl ${theme === 'gold' ? 'shadow-[#d4af37]/30' : 'shadow-indigo-500/50'}`}>
                Shop Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link to="/categories" className="bg-custom-primary border-2 border-custom-secondary text-custom-primary px-8 py-4 rounded-xl hover:border-accent transition-all font-semibold">
                Explore Categories
              </Link>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className={`absolute -inset-4 rounded-3xl blur-2xl opacity-20 animate-pulse ${theme === 'gold' ? 'bg-[#d4af37]' : 'bg-indigo-500'}`}></div>
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop" 
              alt="Hero Product" 
              className={`relative rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 border ${theme === 'gold' ? 'border-[#d4af37]' : 'border-transparent'}`}
            />
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-custom-primary border-y border-custom-secondary">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { Icon: Truck, title: "Free Shipping", desc: "On all orders over $100" },
            { Icon: RotateCcw, title: "30 Days Return", desc: "Money back guarantee" },
            { Icon: Shield, title: "Secure Payment", desc: "100% secure checkout" },
            { Icon: Star, title: "Premium Quality", desc: "Certified products only" }
          ].map((feature, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 hover:bg-custom-secondary/50 rounded-2xl transition-all">
              <div className={`p-3 rounded-2xl ${theme === 'gold' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'bg-indigo-50 text-indigo-600'}`}>
                <feature.Icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-custom-primary">{feature.title}</h4>
                <p className="text-sm text-custom-secondary">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 bg-custom-secondary">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-custom-primary">Featured Products</h2>
              <p className="text-custom-secondary mt-2">Latest items added to our premium collection.</p>
            </div>
            <Link to="/products" className="text-accent font-semibold flex items-center hover:underline">
              View All <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="animate-spin text-accent" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {latestProducts.map((product: any, i: number) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-custom-primary rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-custom-secondary"
                >
                  <Link to={`/products/${product.id}`} className="block aspect-4/5 overflow-hidden relative">
                    <img 
                      src={product.images[0] || `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={product.name}
                    />
                    <div className={`absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      theme === 'gold' ? 'bg-[#d4af37] text-black' : 'bg-white/90 text-gray-900'
                    }`}>
                      New
                    </div>
                  </Link>
                  <div className="p-6">
                    <p className="text-xs text-accent font-bold uppercase tracking-wider mb-2">{product.category?.name}</p>
                    <h3 className="text-lg font-bold text-custom-primary mb-2 truncate">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-extrabold text-custom-primary">${product.price}</span>
                      <Link to={`/products/${product.id}`} className={`p-3 rounded-xl transition-colors ${
                        theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b]' : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}>
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 px-4 bg-custom-primary">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-extrabold text-custom-primary">Shop by Category</h2>
            <p className="text-custom-secondary text-lg max-w-2xl mx-auto">
              Explore our diverse ranges of premium products tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat: any) => (
              <Link 
                key={cat.id} 
                to={`/products?category=${cat.id}`}
                className="group relative h-96 rounded-[40px] overflow-hidden cursor-pointer shadow-xl border border-custom-secondary"
              >
                <div className={`absolute inset-0 z-10 transition-all duration-500 ${
                  theme === 'gold' ? 'bg-black/40 group-hover:bg-black/20' : 'bg-gray-900/40 group-hover:bg-gray-900/20'
                }`}></div>
                <img 
                  src={`https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={cat.name} 
                />
                <div className="absolute bottom-10 left-10 z-20 space-y-2">
                  <h3 className={`text-4xl font-black text-white ${theme === 'gold' ? 'group-hover:text-gold' : ''} transition-colors`}>{cat.name}</h3>
                  <p className="text-white/80 font-bold flex items-center group-hover:translate-x-2 transition-transform">
                    {cat._count?.products || 0} Products <ArrowRight className="ml-2" size={20} />
                  </p>
                </div>
                {theme === 'gold' && (
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4af37]/50 rounded-[40px] z-30 pointer-events-none transition-all"></div>
                )}
              </Link>
            ))}
          </div>
          
          <div className="text-center">
             <Link to="/categories" className="inline-flex items-center text-accent font-bold text-lg hover:underline gap-2">
                View All Categories <ArrowRight size={20} />
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
