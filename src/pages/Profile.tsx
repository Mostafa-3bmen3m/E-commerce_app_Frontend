import { useState, useEffect } from 'react';
import { User as UserIcon, Package, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../store/useTheme';
import api from '../api/axios';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (!user) return <div className="p-20 text-center text-custom-primary bg-custom-primary min-h-screen">Please login to view your profile.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-custom-primary min-h-screen transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-custom-primary p-8 rounded-3xl border border-custom-secondary shadow-sm text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              theme === 'gold' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <UserIcon size={40} />
            </div>
            <h2 className="text-xl font-bold text-custom-primary">{user.name}</h2>
            <p className="text-sm text-custom-secondary mb-6">{user.email}</p>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 py-3 border border-custom-secondary rounded-xl text-custom-secondary hover:text-red-500 hover:border-red-100 hover:bg-red-50/10 transition-all font-semibold"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
          
          <nav className="bg-custom-primary rounded-3xl border border-custom-secondary shadow-sm overflow-hidden">
            <button className={`w-full flex items-center justify-between p-4 font-bold border-b border-custom-secondary transition-colors ${
              theme === 'gold' ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-indigo-600 bg-indigo-50'
            }`}>
              <div className="flex items-center space-x-3">
                <Package size={20} />
                <span>My Orders</span>
              </div>
              <ChevronRight size={16} />
            </button>
            <button className="w-full flex items-center justify-between p-4 text-custom-secondary hover:bg-custom-secondary/50 transition-colors font-semibold">
              <div className="flex items-center space-x-3">
                <Settings size={20} />
                <span>Settings</span>
              </div>
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>


        <div className="lg:col-span-3 space-y-8">
          <h2 className="text-3xl font-bold text-custom-primary">Order History</h2>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-custom-secondary rounded-2xl"></div>)}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-custom-secondary/30 border border-dashed border-custom-secondary rounded-3xl p-12 text-center text-custom-secondary">
              No orders found yet.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => (
                <div key={order.id} className="bg-custom-primary border border-custom-secondary rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <div>
                      <p className="text-xs text-custom-secondary mb-1">Order ID: #{order.id.slice(0, 8)}</p>
                      <p className="font-bold text-custom-primary">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                        theme === 'gold' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {order.status}
                      </span>
                      <span className={`font-extrabold text-xl text-custom-primary ${theme === 'gold' ? 'text-gold' : ''}`}>
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-none">
                    {order.orderItems.map((item: any) => (
                      <div key={item.id} className="w-16 h-16 bg-custom-secondary rounded-lg overflow-hidden shrink-0 border border-custom-secondary">
                        <img src={item.product?.images?.[0]} className="w-full h-full object-cover" alt="" title={item.product?.name} />
                      </div>
                    ))}
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
