import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Package } from 'lucide-react';
import api from '../api/axios';
import { useTheme } from '../store/useTheme';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-primary">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-custom-primary min-h-screen transition-colors duration-300">
      <div className="mb-12 space-y-4">
        <h1 className="text-5xl font-extrabold text-custom-primary">Explore Categories</h1>
        <p className="text-xl text-custom-secondary max-w-2xl">
          Discover our wide range of premium collections, each curated for quality and style.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {categories.map((cat: any) => (
          <Link 
            key={cat.id} 
            to={`/products?category=${cat.id}`}
            className="group relative h-[450px] rounded-[50px] overflow-hidden cursor-pointer shadow-2xl border border-custom-secondary transition-all hover:shadow-accent/20"
          >
            <div className={`absolute inset-0 z-10 transition-all duration-500 ${
              theme === 'gold' ? 'bg-black/50 group-hover:bg-black/30' : 'bg-gray-900/50 group-hover:bg-gray-900/30'
            }`}></div>
            <img 
              src={`https://images.unsplash.com/photo-1540959733332-e94e270b2d42?w=800&auto=format&fit=crop`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
              alt={cat.name} 
            />
            
            <div className="absolute top-10 left-10 z-20">
               <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${
                 theme === 'gold' ? 'bg-[#d4af37] text-black' : 'bg-white text-gray-900'
               }`}>
                  <Package size={14} />
                  {cat._count?.products || 0} Products
               </div>
            </div>

            <div className="absolute bottom-12 left-12 z-20 space-y-4">
              <h3 className={`text-5xl font-black text-white ${theme === 'gold' ? 'group-hover:text-gold' : ''} transition-colors tracking-tighter`}>
                {cat.name}
              </h3>
              <p className="text-white/90 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                Shop Collection <ArrowRight className="text-accent" size={24} />
              </p>
            </div>

            {theme === 'gold' && (
              <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#d4af37]/30 rounded-[50px] z-30 pointer-events-none transition-all"></div>
            )}
            
            <div className={`absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t ${
               theme === 'gold' ? 'from-black/80 to-transparent' : 'from-gray-900/80 to-transparent'
            } z-15`}></div>
          </Link>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-40 space-y-6">
           <div className="w-24 h-24 bg-custom-secondary rounded-full flex items-center justify-center mx-auto">
              <Package size={40} className="text-custom-secondary" />
           </div>
           <h2 className="text-2xl font-bold text-custom-primary">No categories found</h2>
           <p className="text-custom-secondary">Check back soon for new collections.</p>
        </div>
      )}
    </div>
  );
};

export default Categories;
