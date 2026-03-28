import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useTheme } from '../store/useTheme';

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const { theme } = useTheme();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 bg-custom-primary text-custom-primary transition-colors duration-300">
        <div className="p-6 bg-custom-secondary rounded-full">
          <ShoppingBag size={64} className="text-custom-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-custom-primary">Your cart is empty</h2>
        <p className="text-custom-secondary">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-accent-hover transition-all">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-custom-primary min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold text-custom-primary mb-12">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center p-6 bg-custom-primary border border-custom-secondary rounded-3xl space-x-6 relative group overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="w-24 h-24 bg-custom-secondary rounded-2xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="grow min-w-0">
                <h3 className="font-bold text-custom-primary truncate">{item.name}</h3>
                <p className="text-accent font-extrabold mt-1">${item.price}</p>
                
                <div className="flex items-center mt-4 space-x-4">
                  <div className="flex items-center border border-custom-secondary bg-custom-secondary/30 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1 text-custom-primary hover:text-accent"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 font-bold text-sm w-10 text-center text-custom-primary">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                      className="p-1 text-custom-primary hover:text-accent"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-custom-secondary hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className={`${theme === 'gold' ? 'bg-black border border-[#d4af37]' : 'bg-gray-900'} text-white p-8 rounded-3xl shadow-xl space-y-6 sticky top-24`}>
            <h3 className={`text-xl font-bold ${theme === 'gold' ? 'text-gold' : 'text-white'}`}>Order Summary</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className={theme === 'gold' ? 'text-gold' : 'text-white'}>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className={`border-t ${theme === 'gold' ? 'border-[#d4af37]/30' : 'border-gray-800'} pt-4 flex justify-between`}>
                <span className={theme === 'gold' ? 'text-gold font-bold' : 'text-white font-bold'}>Total</span>
                <span className={`${theme === 'gold' ? 'text-gold' : 'text-white'} font-extrabold text-2xl`}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center group transition-all ${
                theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b]' : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              Checkout
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
