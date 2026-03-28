import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useCartStore } from '../store/useCartStore';
import { useTheme } from '../store/useTheme';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ 
    category: initialCategory, 
    sort: 'newest', 
    search: '', 
    page: 1 
  });
  const [pagination, setPagination] = useState({ pages: 1 });
  const addItem = useCartStore((state) => state.addItem);
  const { theme } = useTheme();


  useEffect(() => {
    const cat = searchParams.get('category') || '';
    if (cat !== filters.category) {
      setFilters(prev => ({ ...prev, category: cat, page: 1 }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products', { params: filters });
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFilters({ ...filters, category: val, page: 1 });
    if (val) {
      setSearchParams({ category: val });
    } else {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-custom-primary min-h-screen transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-custom-primary">Our Collection</h1>
          <p className="text-custom-secondary mt-2">Explore our range of premium products.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-custom-secondary" size={18} />
            <input 
              type="text" 
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 bg-custom-secondary border border-transparent rounded-xl text-custom-primary focus:ring-2 focus:ring-accent outline-none w-64 placeholder:text-custom-secondary/50"
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
          <select 
            value={filters.category}
            className="px-4 py-2 bg-custom-secondary border border-transparent rounded-xl text-custom-primary outline-none focus:ring-2 focus:ring-accent"
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select 
            className="px-4 py-2 bg-custom-secondary border border-transparent rounded-xl text-custom-primary outline-none focus:ring-2 focus:ring-accent"
            onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse bg-custom-secondary h-96 rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <div key={product.id} className="group bg-custom-primary rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-custom-secondary">
                <Link to={`/products/${product.id}`} className="block aspect-4/5 overflow-hidden relative">
                  <img 
                    src={product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={product.name}
                  />

                  <div className={`absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                    theme === 'gold' ? luxuryGradient + ' text-black' : 'bg-white/90 text-gray-900'
                  }`}>
                    PREMIUM
                  </div>
                </Link>
                <div className="p-6">
                  <p className="text-xs text-accent font-bold uppercase tracking-wider mb-2">{product.category?.name || 'Uncategorized'}</p>
                  <h3 className="text-lg font-bold text-custom-primary mb-2 truncate">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className={`text-xl font-extrabold ${theme === 'gold' ? 'text-gold' : 'text-custom-primary'}`}>
                      ${product.price}
                    </span>
                    <button 
                      onClick={() => addItem(product)}
                      className={`px-4 py-2 font-bold rounded-xl transition-all text-sm shrink-0 ${
                        theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b]' : 'bg-gray-900 text-white hover:bg-accent'
                      }`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
             <div className="text-center py-40 space-y-4">
                <Package className="mx-auto text-custom-secondary" size={64} />
                <h2 className="text-2xl font-bold text-custom-primary">No products found</h2>
                <p className="text-custom-secondary">Try adjusting your search or category filters.</p>
                <button 
                  onClick={() => setFilters({ category: '', sort: 'newest', search: '', page: 1 })}
                  className="text-accent font-bold hover:underline"
                >
                  Clear all filters
                </button>
             </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-16">
              <button 
                disabled={filters.page === 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                className="p-3 bg-custom-secondary border border-transparent rounded-xl disabled:opacity-50 hover:bg-custom-secondary/50 text-custom-primary transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-bold text-custom-primary bg-custom-secondary px-4 py-2 rounded-xl border border-custom-secondary">
                    {filters.page} / {pagination.pages}
                 </span>
              </div>
              <button 
                disabled={filters.page === pagination.pages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                className="p-3 bg-custom-secondary border border-transparent rounded-xl disabled:opacity-50 hover:bg-custom-secondary/50 text-custom-primary transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const luxuryGradient = "bg-linear-to-r from-[#d4af37] via-[#f9e5af] to-[#d4af37]";

export default Products;
