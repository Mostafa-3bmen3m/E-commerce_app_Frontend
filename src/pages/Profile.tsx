import { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Package, Settings, LogOut, ChevronRight, ShieldCheck, Star, Clock, CreditCard } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../store/useTheme';
import api from '../api/axios';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const { data } = await api.get('/orders/myorders');
          setOrders(data.orders);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    if (!loading && user) {
        gsap.fromTo('.profile-anim',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
    }
  }, [loading, user]);

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-custom-primary text-center">
        <div className="p-6 rounded-full bg-custom-secondary mb-6">
            <UserIcon size={48} className="text-custom-secondary" />
        </div>
        <h2 className="text-3xl font-black text-custom-primary tracking-tighter mb-4">ACCESS RESTRICTED</h2>
        <p className="text-custom-secondary mb-8 max-w-xs font-medium">Please authenticate to access your private vault and order history.</p>
        <Link to="/login" className="px-8 py-3 bg-accent text-white rounded-xl font-bold hover:scale-105 transition-transform">Sign In</Link>
    </div>
  );

  const luxuryGradient = "bg-linear-to-r from-[#d4af37] via-[#f9e5af] to-[#d4af37]";
  const standardGradient = "bg-linear-to-r from-indigo-600 to-purple-600";
  const mainGradient = theme === 'gold' ? luxuryGradient : standardGradient;

  return (
    <div ref={profileRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-custom-primary min-h-screen transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

        <div className="lg:col-span-4 space-y-8 profile-anim">
          <div className="bg-custom-primary p-10 rounded-[48px] border-4 border-custom-secondary shadow-2xl text-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${mainGradient}`}></div>
            
            <div className="relative inline-block mb-6">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto border-4 border-custom-secondary p-1 shadow-inner`}>
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${
                    theme === 'gold' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                    <UserIcon size={56} strokeWidth={1.5} />
                    </div>
                </div>
                {user.role === 'ADMIN' && (
                    <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                        <ShieldCheck size={20} />
                    </div>
                )}
            </div>
            
            <div className="space-y-1 mb-8">
                <h2 className="text-3xl font-black text-custom-primary tracking-tighter">{user.name}</h2>
                <p className="text-sm font-bold text-custom-secondary uppercase tracking-widest">{user.email}</p>
            </div>

            <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full mb-10 border ${
                theme === 'gold' ? 'bg-[#d4af37]/10 border-[#d4af37]/20 text-[#d4af37]' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
            }`}>
                <Star size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest">Vault Member</span>
            </div>

            <button 
              onClick={logout}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-custom-secondary/50 rounded-2xl text-custom-secondary hover:text-red-500 hover:bg-red-500/10 transition-all font-black uppercase tracking-widest text-xs"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
          
          <nav className="bg-custom-secondary/30 rounded-[40px] border border-custom p-4 space-y-2">
            <button className={`w-full flex items-center justify-between p-5 rounded-3xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${
              theme === 'gold' ? 'bg-[#d4af37] text-black' : 'bg-indigo-600 text-white'
            }`}>
              <div className="flex items-center space-x-4">
                <Package size={20} />
                <span>Order History</span>
              </div>
              <ChevronRight size={18} />
            </button>
            <button className="w-full flex items-center justify-between p-5 rounded-3xl text-custom-secondary hover:bg-custom-secondary transition-all font-black uppercase tracking-widest text-xs">
              <div className="flex items-center space-x-4">
                <Settings size={20} />
                <span>Account Settings</span>
              </div>
              <ChevronRight size={18} />
            </button>
          </nav>
        </div>


        <div className="lg:col-span-8 space-y-12">
          <div className="profile-anim">
            <h2 className="text-4xl md:text-5xl font-black text-custom-primary tracking-tighter mb-2">MY SHIPMENTS</h2>
            <p className="text-custom-secondary font-medium">Tracking and history of your premium acquisitions.</p>
          </div>
          
          {loading ? (
            <div className="space-y-8">
                {[1, 2].map(i => (
                    <div key={i} className="h-64 bg-custom-secondary/30 border border-custom rounded-[48px] animate-pulse"></div>
                ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="profile-anim bg-custom-secondary/20 border-2 border-dashed border-custom-secondary rounded-[48px] p-24 text-center">
              <Package size={64} className="mx-auto text-custom-secondary/30 mb-6" />
              <p className="text-xl font-black text-custom-secondary tracking-tight">NO ACQUISITIONS RECORDED</p>
              <p className="text-xs font-bold text-custom-secondary/60 mt-2 uppercase tracking-widest">Your journey of excellence starts here.</p>
              <Link to="/products" className="inline-block mt-8 text-accent font-black text-xs uppercase tracking-[0.2em] border-b-2 border-accent pb-1">Begin Browsing</Link>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order: any) => (
                <div key={order.id} className="profile-anim group bg-custom-primary border-4 border-custom-secondary rounded-[48px] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Package size={80} />
                   </div>

                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 border-b-2 border-custom-secondary pb-8">
                        <div className="space-y-2">
                             <div className="flex items-center gap-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-custom-secondary">Order Reference</p>
                                <span className={`w-2 h-2 rounded-full animate-pulse ${
                                    order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-yellow-500'
                                }`}></span>
                             </div>
                             <p className="text-2xl font-black text-custom-primary tracking-tighter">ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                             <div className="flex items-center gap-2 text-custom-secondary">
                                <Clock size={14} />
                                <p className="text-xs font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                             </div>
                        </div>

                        <div className="flex items-center gap-6">
                             <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-custom-secondary mb-1">Status</p>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                                    order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                    {order.status}
                                </span>
                             </div>
                             <div className="w-px h-10 bg-custom-secondary hidden sm:block"></div>
                             <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-custom-secondary mb-1">Investment</p>
                                <p className={`text-4xl font-black tracking-tighter ${theme === 'gold' ? 'text-[#d4af37]' : 'text-custom-primary'}`}>
                                    ${order.totalAmount.toFixed(2)}
                                </p>
                             </div>
                        </div>
                   </div>
                  
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="flex -space-x-4 overflow-hidden p-2">
                            {order.orderItems.map((item: any, idx: number) => (
                            <div key={item.id} className="w-16 h-16 bg-custom-secondary rounded-2xl overflow-hidden shrink-0 border-4 border-custom-primary shadow-lg group-hover:scale-105 transition-transform origin-bottom" style={{ transitionDelay: `${idx * 50}ms`, zIndex: 10 - idx }}>
                                <img src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" title={item.product?.name} />
                            </div>
                            ))}
                            {order.orderItems.length > 5 && (
                                <div className="w-16 h-16 bg-custom-secondary rounded-2xl flex items-center justify-center border-4 border-custom-primary shadow-lg z-0">
                                    <span className="text-xs font-black text-custom-secondary">+{order.orderItems.length - 5}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex md:justify-end gap-3">
                             <button className="px-6 py-3 rounded-xl bg-custom-secondary/50 text-[10px] font-black uppercase tracking-widest text-custom-secondary hover:text-custom-primary transition-all flex items-center gap-2">
                                <CreditCard size={14} />
                                Receipt
                             </button>
                             <button className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg hover:scale-105 active:scale-95 ${
                                theme === 'gold' ? 'bg-[#d4af37] text-black shadow-[#d4af37]/20' : 'bg-gray-900 text-white shadow-black/20'
                             }`}>
                                Track Details
                             </button>
                        </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
