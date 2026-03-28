import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Truck, Plus, Minus, RotateCcw, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useCartStore } from '../store/useCartStore';
import { useTheme } from '../store/useTheme';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (error) {
        console.error(error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <div className="p-20 text-center animate-pulse text-custom-secondary italic">Loading product details...</div>;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-custom-primary min-h-screen transition-colors duration-300">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-custom-secondary hover:text-accent mb-8 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-4">
          <div className="aspect-4/5 rounded-3xl overflow-hidden bg-custom-secondary border border-custom-secondary shadow-lg">
            <img 
              src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'} 
              className="w-full h-full object-cover"
              alt={product.name}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.slice(0, 4).map((img: string, i: number) => (
              <div key={i} className="aspect-square bg-custom-secondary rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-accent transition-all border border-custom-secondary">
                <img src={img} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-accent font-bold uppercase tracking-widest text-sm mb-2">{product.category.name}</p>
            <h1 className="text-4xl font-extrabold text-custom-primary leading-tight">{product.name}</h1>
            <div className="flex items-center mt-4 space-x-4">
              <div className={`flex ${theme === 'gold' ? 'text-[#d4af37]' : 'text-yellow-400'}`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-custom-secondary text-sm">({product.reviews?.length || 0} reviews)</span>
            </div>
          </div>

          <div className="text-3xl font-extrabold text-custom-primary">${product.price}</div>

          <p className="text-custom-secondary leading-relaxed text-lg italic">
            {product.description || "This premium product is crafted with the finest materials and attention to detail, ensuring both style and durability for your everyday needs."}
          </p>

          <div className="space-y-4 border-y border-custom-secondary py-8">
            <div className="flex items-center justify-between">
              <span className="font-bold text-custom-primary">Quantity</span>
              <div className="flex items-center border border-custom-secondary rounded-xl px-2 py-1 bg-custom-secondary/30">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-custom-primary hover:text-accent"
                >
                  <Minus size={18} />
                </button>
                <span className="px-4 font-bold w-12 text-center text-custom-primary">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 text-custom-primary hover:text-accent"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            <button 
              onClick={() => addItem(product, quantity)}
              className={`w-full py-4 rounded-2xl flex items-center justify-center space-x-3 transition-all shadow-lg font-bold ${
                theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b]' : 'bg-gray-900 text-white hover:bg-accent shadow-indigo-200/50'
              }`}
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-custom-secondary rounded-2xl border border-custom-secondary">
              <Truck size={20} className="text-accent" />
              <span className="text-xs font-semibold text-custom-secondary">Free Shipping over $100</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-custom-secondary rounded-2xl border border-custom-secondary">
              <RotateCcw size={20} className="text-accent" />
              <span className="text-xs font-semibold text-custom-secondary">30-Day Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
