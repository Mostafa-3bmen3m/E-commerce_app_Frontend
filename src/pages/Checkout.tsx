import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle2, ArrowLeft, ShieldCheck, Zap, Package, Loader2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useTheme } from '../store/useTheme';
import api from '../api/axios';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    address: '', city: '', zipCode: '', country: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const containerRef = useRef(null);
  const successRef = useRef(null);

  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate('/cart');
    }

    gsap.fromTo('.checkout-anim', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, [items, navigate, orderSuccess]);

  useEffect(() => {
    if (orderSuccess) {
      gsap.fromTo(successRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.7)' }
      );
    }
  }, [orderSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing time for "premium" feel
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await api.post('/orders', {
        orderItems: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalPrice,
        ...formData
      });
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => navigate('/profile'), 4000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div ref={successRef} className="min-h-screen flex flex-col items-center justify-center p-8 bg-custom-primary text-center">
        <div className={`p-8 rounded-full mb-8 ${theme === 'gold' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'bg-green-100 text-green-600'}`}>
            <CheckCircle2 size={100} strokeWidth={1.5} />
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-custom-primary mb-6 tracking-tighter">SUCCESSFUL!</h2>
        <p className="text-custom-secondary text-xl max-w-md mx-auto leading-relaxed mb-12 font-medium">
            Your premium order has been received and is being prepared with excellence.
        </p>
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-1 bg-custom-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent animate-progress-fast"></div>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-custom-secondary">Redirecting to account</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-custom-primary min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-12 checkout-anim">
            <Link to="/cart" className="p-3 rounded-full bg-custom-secondary hover:bg-custom-secondary/80 text-custom-primary transition-all">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-custom-primary tracking-tighter">SECURE CHECKOUT</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-10">
            <form onSubmit={handleSubmit} id="checkout-form" className="space-y-10">
              <div className="checkout-anim bg-custom-secondary/30 p-10 rounded-[40px] border border-custom space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black flex items-center text-custom-primary tracking-tight">
                    <Truck className="mr-4 text-accent" size={28} />
                    SHIPPING LOGISTICS
                    </h3>
                    <div className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black tracking-widest uppercase">
                        Complimentary Shipping
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary ml-2">Street Address</label>
                    <input
                        type="text"
                        placeholder="e.g. 123 Luxury Ave, Beverly Hills"
                        required
                        className="w-full px-6 py-4 bg-custom-primary border-2 border-transparent rounded-2xl focus:border-accent text-custom-primary outline-none transition-all font-medium"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary ml-2">City</label>
                    <input
                        type="text"
                        placeholder="Los Angeles"
                        required
                        className="w-full px-6 py-4 bg-custom-primary border-2 border-transparent rounded-2xl focus:border-accent text-custom-primary outline-none transition-all font-medium"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary ml-2">Postal Code</label>
                    <input
                        type="text"
                        placeholder="90210"
                        required
                        className="w-full px-6 py-4 bg-custom-primary border-2 border-transparent rounded-2xl focus:border-accent text-custom-primary outline-none transition-all font-medium"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary ml-2">Country</label>
                    <input
                        type="text"
                        placeholder="United States"
                        required
                        className="w-full px-6 py-4 bg-custom-primary border-2 border-transparent rounded-2xl focus:border-accent text-custom-primary outline-none transition-all font-medium"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary ml-2">Direct Contact</label>
                    <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        required
                        className="w-full px-6 py-4 bg-custom-primary border-2 border-transparent rounded-2xl focus:border-accent text-custom-primary outline-none transition-all font-medium"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-anim bg-custom-secondary/30 p-10 rounded-[40px] border border-custom space-y-8">
                <h3 className="text-2xl font-black flex items-center text-custom-primary tracking-tight">
                  <CreditCard className="mr-4 text-accent" size={28} />
                  PREMIUM PAYMENT
                </h3>

                <div className="p-8 rounded-3xl bg-custom-primary border-2 border-accent/20 flex items-center gap-6 group hover:border-accent transition-all cursor-pointer">
                    <div className="p-4 rounded-full bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                        <p className="font-black text-custom-primary tracking-tighter">Pro Forma Payment / Cash</p>
                        <p className="text-xs text-custom-secondary font-medium">Accelerated processing for loyal members</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <ShieldCheck size={18} className="text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Secure</span>
                    </div>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="checkout-anim sticky top-24 space-y-8">
                <div className="bg-custom-primary p-10 rounded-[48px] border-4 border-custom-secondary shadow-2xl space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Package size={120} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-custom-primary tracking-tight">MANIFEST</h3>
                    
                    <div className="space-y-6 max-h-[30vh] overflow-y-auto pr-4 custom-scrollbar">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center group">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-custom-secondary rounded-2xl overflow-hidden shrink-0 border border-custom group-hover:scale-105 transition-transform">
                                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                </div>
                                <div>
                                    <p className="font-black text-custom-primary text-sm tracking-tight truncate max-w-[150px]">{item.name}</p>
                                    <p className="text-[10px] font-bold text-custom-secondary uppercase tracking-widest">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <span className="font-black text-custom-primary">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    </div>

                    <div className="space-y-4 pt-6 mt-4 border-t-2 border-custom-secondary">
                        <div className="flex justify-between text-custom-secondary text-sm font-bold uppercase tracking-widest">
                            <span>Logistics</span>
                            <span className="text-green-500">Gratis</span>
                        </div>
                        <div className="flex justify-between text-custom-secondary text-sm font-bold uppercase tracking-widest">
                            <span>Surcharge</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between items-end pt-4">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-custom-secondary">Total Investment</span>
                            <span className={`text-4xl font-black text-custom-primary tracking-tighter ${theme === 'gold' ? 'text-[#d4af37]' : ''}`}>
                                ${totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        form="checkout-form"
                        type="submit"
                        disabled={loading || items.length === 0}
                        className={`w-full py-6 rounded-[32px] font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 ${
                            theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b] shadow-[#d4af37]/30' : 'bg-gray-900 text-white hover:bg-black shadow-black/20'
                        }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                <span>PROCESSING VAULT...</span>
                            </>
                        ) : (
                            <>
                                <span>AUTHORIZE PAYMENT</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 pt-2 text-custom-secondary">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
                    </div>
                </div>
                
                {/* Secondary Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-[32px] bg-custom-secondary/30 border border-custom text-center space-y-2">
                        <p className="text-[10px] font-black text-custom-secondary uppercase tracking-widest">Sustainability</p>
                        <p className="font-bold text-custom-primary text-xs tracking-tight">Carbon Neutral</p>
                    </div>
                    <div className="p-6 rounded-[32px] bg-custom-secondary/30 border border-custom text-center space-y-2">
                        <p className="text-[10px] font-black text-custom-secondary uppercase tracking-widest">Support</p>
                        <p className="font-bold text-custom-primary text-xs tracking-tight">24/7 Priority</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
