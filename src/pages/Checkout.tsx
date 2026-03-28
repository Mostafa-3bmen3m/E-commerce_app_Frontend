import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useTheme } from '../store/useTheme';
import api from '../api/axios';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    address: '', city: '', zipCode: '', country: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/orders', {
        orderItems: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalPrice,
        ...formData
      });
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => navigate('/profile'), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-custom-primary text-custom-primary transition-colors duration-300">
        <CheckCircle2 size={80} className="text-green-500 mb-6" />
        <h2 className="text-4xl font-extrabold text-custom-primary mb-4">Order Confirmed!</h2>
        <p className="text-custom-secondary text-lg">Thank you for your purchase. Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-custom-primary min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold text-custom-primary mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-custom-primary p-8 rounded-3xl border border-custom-secondary shadow-sm space-y-6">
            <h3 className="text-xl font-bold flex items-center text-custom-primary">
              <Truck className="mr-3 text-accent" size={24} />
              Shipping Information
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Shipping Address"
                required
                className="w-full px-4 py-3 bg-custom-secondary border border-transparent rounded-xl focus:bg-custom-primary focus:border-accent text-custom-primary outline-none transition-all placeholder:text-custom-secondary/50"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  required
                  className="w-full px-4 py-3 bg-custom-secondary border border-transparent rounded-xl focus:bg-custom-primary focus:border-accent text-custom-primary outline-none transition-all placeholder:text-custom-secondary/50"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  required
                  className="w-full px-4 py-3 bg-custom-secondary border border-transparent rounded-xl focus:bg-custom-primary focus:border-accent text-custom-primary outline-none transition-all placeholder:text-custom-secondary/50"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
              <input
                type="text"
                placeholder="Country"
                required
                className="w-full px-4 py-3 bg-custom-secondary border border-transparent rounded-xl focus:bg-custom-primary focus:border-accent text-custom-primary outline-none transition-all placeholder:text-custom-secondary/50"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number"
                required
                className="w-full px-4 py-3 bg-custom-secondary border border-transparent rounded-xl focus:bg-custom-primary focus:border-accent text-custom-primary outline-none transition-all placeholder:text-custom-secondary/50"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-custom-primary p-8 rounded-3xl border border-custom-secondary shadow-sm space-y-6">
            <h3 className="text-xl font-bold flex items-center text-custom-primary">
              <CreditCard className="mr-3 text-accent" size={24} />
              Payment
            </h3>

            <div className="bg-custom-secondary/50 p-4 rounded-xl text-custom-secondary text-sm font-medium border border-dashed border-custom-secondary">
              Payment method: Cash on Delivery / Pro Forma
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg disabled:opacity-50 ${theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b]' : 'bg-accent text-white hover:bg-accent-hover shadow-indigo-200/50'
              }`}
          >
            {loading ? 'Processing...' : `Place Order - $${totalPrice.toFixed(2)}`}
          </button>
        </form>

        <div className="space-y-8">
          <div className="bg-custom-secondary p-8 rounded-3xl border border-custom-secondary shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-custom-primary">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-custom-primary">
                  <div className="flex items-center space-x-4 text-custom-primary">
                    <div className="w-12 h-12 bg-custom-primary rounded-lg overflow-hidden shrink-0 border border-custom-secondary">
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <p className="font-bold text-sm truncate w-40">{item.name}</p>
                      <p className="text-custom-secondary text-xs">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-custom-secondary pt-6 space-y-2">
              <div className="flex justify-between text-custom-secondary">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="flex justify-between text-xl text-custom-primary font-extrabold pt-2">
                <span>Total</span>
                <span className={theme === 'gold' ? 'text-gold' : ''}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
