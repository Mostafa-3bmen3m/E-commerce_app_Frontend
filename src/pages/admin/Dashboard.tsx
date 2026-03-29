import { useState, useEffect } from 'react';
import { Package, Users, ShoppingBag, BarChart3, Plus, Edit, Trash2, X, Tags } from 'lucide-react';
import api from '../../api/axios';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { useTheme } from '../../store/useTheme';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    images: ['']
  });


  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchData();
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const res = await api.get('/products');
        setProducts(res.data.products || []);
      } else if (activeTab === 'orders') {
        const res = await api.get('/orders');
        setOrders(res.data || []);
      } else if (activeTab === 'users') {
        const res = await api.get('/auth/users');
        setUsers(res.data || []);
      } else if (activeTab === 'categories') {
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
      }
    } catch (error) {
      showToast("Failed to fetch data", true);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, isError: boolean = false) => {
    Toastify({
      text: message,
      style: { background: isError ? "linear-gradient(to right, #ff5f6d, #ffc371)" : "linear-gradient(to right, #00b09b, #96c93d)" }
    }).showToast();
  };


  const handleOpenProductModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        categoryId: product.categoryId,
        images: product.images.length > 0 ? product.images : ['']
      });
    } else {
      setEditingProduct(null);
      setProductFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: categories[0]?.id || '',
        images: ['']
      });
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...productFormData,
        price: parseFloat(productFormData.price),
        stock: parseInt(productFormData.stock),
        images: productFormData.images.filter(img => img.trim() !== '')
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data);
        showToast("Product updated successfully!");
      } else {
        await api.post('/products', data);
        showToast("Product created successfully!");
      }
      setIsProductModalOpen(false);
      fetchData();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Operation failed", true);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Delete this product permanently?')) {
      try {
        await api.delete(`/products/${id}`);
        showToast("Product deleted!");
        fetchData();
      } catch (error) {
        showToast("Failed to delete product", true);
      }
    }
  };

  const handleProductImageChange = (index: number, value: string) => {
    const newImages = [...productFormData.images];
    newImages[index] = value;
    setProductFormData(prev => ({ ...prev, images: newImages }));
  };

  const addProductImageField = () => {
    setProductFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeProductImageField = (index: number) => {
    const newImages = productFormData.images.filter((_, i) => i !== index);
    setProductFormData(prev => ({ ...prev, images: newImages.length > 0 ? newImages : [''] }));
  };


  const handleOpenCategoryModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({ name: category.name });
    } else {
      setEditingCategory(null);
      setCategoryFormData({ name: '' });
    }
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, categoryFormData);
        showToast("Category updated!");
      } else {
        await api.post('/categories', categoryFormData);
        showToast("Category created!");
      }
      setIsCategoryModalOpen(false);
      fetchCategories();
      if (activeTab === 'categories') fetchData();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Operation failed", true);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Delete category? This might affect nested products.')) {
      try {
        await api.delete(`/categories/${id}`);
        showToast("Category deleted!");
        fetchCategories();
        if (activeTab === 'categories') fetchData();
      } catch (error) {
        showToast("Failed to delete category", true);
      }
    }
  };



  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      showToast("Order status updated!");
      fetchData();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update order", true);
    }
  };

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (window.confirm(`Change user role to ${newRole}?`)) {
      try {
        await api.put(`/auth/users/${userId}/role`, { role: newRole });
        showToast("User role updated!");
        fetchData();
      } catch (error: any) {
        showToast(error.response?.data?.message || "Failed to update role", true);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-custom-primary min-h-screen transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-12">

        <div className="w-full md:w-64 shrink-0 space-y-4">
          <div className={`${theme === 'gold' ? 'bg-black border border-[#d4af37]' : 'bg-gray-900'} text-white p-8 rounded-[40px] space-y-2 shadow-2xl`}>
            <h2 className={`text-xl font-black mb-6 flex items-center ${theme === 'gold' ? 'text-gold' : 'text-white'} tracking-tight`}>
              <BarChart3 className="mr-3" size={24} /> VAULT ADMIN
            </h2>
            <nav className="space-y-2">
              {[
                { id: 'products', label: 'Inventory', icon: Package },
                { id: 'categories', label: 'Collections', icon: Tags },
                { id: 'orders', label: 'Shipments', icon: ShoppingBag },
                { id: 'users', label: 'Clients', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all font-bold ${
                    activeTab === tab.id 
                      ? (theme === 'gold' ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30')
                      : (theme === 'gold' ? 'text-[#d4af37] hover:bg-[#d4af37]/10' : 'text-gray-400 hover:text-white hover:bg-gray-800')
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
            <div className="pt-8 mt-8 border-t border-white/10 opacity-60">
                <p className="text-[10px] font-black uppercase tracking-widest text-center">System Version 2.4.0</p>
            </div>
          </div>
        </div>


        <div className="grow space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
                <h1 className="text-4xl font-black text-custom-primary tracking-tighter capitalize">{activeTab} COMMAND CENTER</h1>
                <p className="text-custom-secondary font-medium">Manage and optimize your store's {activeTab} in real-time.</p>
            </div>
            {(activeTab === 'products' || activeTab === 'categories') && (
              <button 
                onClick={() => activeTab === 'products' ? handleOpenProductModal() : handleOpenCategoryModal()}
                className={`px-8 py-4 rounded-2xl font-black flex items-center transition-all shadow-xl hover:scale-105 active:scale-95 ${
                  theme === 'gold' ? 'bg-[#d4af37] text-black shadow-[#d4af37]/30' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30'
                }`}
              >
                <Plus size={20} className="mr-2" strokeWidth={3} /> ADD NEW
              </button>
            )}
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                  { label: `Total ${activeTab}`, value: activeTab === 'products' ? products.length : activeTab === 'orders' ? orders.length : activeTab === 'users' ? users.length : categories.length },
                  { label: 'Platform Status', value: 'Active', color: 'text-green-500' },
                  { label: 'Growth', value: '+12.5%', color: 'text-accent' },
                  { label: 'Uptime', value: '99.9%' }
              ].map((stat, i) => (
                  <div key={i} className="bg-custom-secondary/30 p-6 rounded-3xl border border-custom">
                      <p className="text-[10px] font-black uppercase tracking-widest text-custom-secondary mb-1">{stat.label}</p>
                      <p className={`text-2xl font-black tracking-tighter ${stat.color || 'text-custom-primary'}`}>{stat.value}</p>
                  </div>
              ))}
          </div>

          <div className="bg-custom-primary border-2 border-custom-secondary rounded-[40px] shadow-2xl overflow-hidden">
            {loading ? (
              <div className="p-24 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-custom-secondary font-black tracking-widest text-xs uppercase">Decrypting {activeTab} Data</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-custom-secondary/50 text-custom-secondary text-[10px] font-black uppercase tracking-[0.2em] border-b border-custom">
                        <th className="px-8 py-5">
                        {activeTab === 'products' ? 'Product Identity' : activeTab === 'categories' ? 'Collection Name' : activeTab === 'orders' ? 'Shipment / Client' : 'Account Identity'}
                        </th>
                        <th className="px-8 py-5">
                        {activeTab === 'products' ? 'Classification' : activeTab === 'categories' ? 'Density' : activeTab === 'orders' ? 'Status' : 'Authority'}
                        </th>
                        <th className="px-8 py-5">
                        {activeTab === 'products' ? 'Value / Inventory' : activeTab === 'categories' ? 'Hash ID' : activeTab === 'orders' ? 'Investment' : 'Registration'}
                        </th>
                        <th className="px-8 py-5 text-right">Operations</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-custom">

                    {activeTab === 'products' && products.map((product) => (
                        <tr key={product.id} className="hover:bg-custom-secondary/20 transition-colors group">
                        <td className="px-8 py-6">
                            <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 bg-custom-secondary rounded-2xl overflow-hidden shrink-0 border border-custom group-hover:scale-110 transition-transform shadow-sm">
                                <img src={product.images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                                <p className="font-black text-custom-primary text-base tracking-tight truncate max-w-[200px]">{product.name}</p>
                                <p className="text-custom-secondary font-mono text-[10px] mt-0.5">{product.id.slice(0, 12)}</p>
                            </div>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            theme === 'gold' ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20' : 'bg-indigo-50 text-indigo-600'
                            }`}>
                            {product.category?.name || 'Unclassified'}
                            </span>
                        </td>
                        <td className="px-8 py-6">
                            <p className="font-black text-custom-primary text-lg tracking-tighter">${product.price.toFixed(2)}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${product.stock < 10 ? 'text-red-500' : 'text-custom-secondary'}`}>
                                {product.stock} units available
                            </p>
                        </td>
                        <td className="px-8 py-6 text-right">
                            <div className="flex justify-end space-x-3">
                            <button onClick={() => handleOpenProductModal(product)} className="p-3 bg-custom-secondary/50 rounded-xl text-custom-secondary hover:text-accent hover:bg-accent/10 transition-all"><Edit size={18} /></button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-3 bg-custom-secondary/50 rounded-xl text-custom-secondary hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 size={18} /></button>
                            </div>
                        </td>
                        </tr>
                    ))}


                    {activeTab === 'categories' && categories.map((category) => (
                        <tr key={category.id} className="hover:bg-custom-secondary/20 transition-colors">
                        <td className="px-8 py-6 font-black text-custom-primary text-lg tracking-tight">
                            {category.name}
                        </td>
                        <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            theme === 'gold' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {category._count?.products || 0} Products
                            </span>
                        </td>
                        <td className="px-8 py-6 font-mono text-[10px] text-custom-secondary">
                            {category.id}
                        </td>
                        <td className="px-8 py-6 text-right">
                            <div className="flex justify-end space-x-3">
                            <button onClick={() => handleOpenCategoryModal(category)} className="p-3 bg-custom-secondary/50 rounded-xl text-custom-secondary hover:text-accent transition-all"><Edit size={18} /></button>
                            <button onClick={() => handleDeleteCategory(category.id)} className="p-3 bg-custom-secondary/50 rounded-xl text-custom-secondary hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                            </div>
                        </td>
                        </tr>
                    ))}


                    {activeTab === 'orders' && orders.map((order) => (
                        <tr key={order.id} className="hover:bg-custom-secondary/20 transition-colors">
                        <td className="px-8 py-6">
                            <div>
                            <p className="font-black text-custom-primary text-base tracking-tighter">ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                            <p className="text-custom-secondary text-xs font-bold">{order.user?.name || order.phone}</p>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <select 
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border-2 transition-all ${
                                    order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                    order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </td>
                        <td className="px-8 py-6 font-black text-lg tracking-tighter text-custom-primary">
                            ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-8 py-6 text-right">
                            <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View Manifest</button>
                        </td>
                        </tr>
                    ))}


                    {activeTab === 'users' && users.map((user) => (
                        <tr key={user.id} className="hover:bg-custom-secondary/20 transition-colors group">
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-custom-secondary flex items-center justify-center font-black text-accent text-lg border-2 border-custom transition-all group-hover:border-accent">
                                    {user.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-black text-custom-primary text-base tracking-tight">{user.name}</p>
                                    <p className="text-custom-secondary text-xs">{user.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <button 
                                onClick={() => handleToggleUserRole(user.id, user.role)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                    user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-600 border border-purple-600/20' : 'bg-custom-secondary/50 text-custom-secondary'
                                } hover:scale-105 active:scale-95`}
                            >
                                {user.role}
                            </button>
                        </td>
                        <td className="px-8 py-6 text-custom-secondary text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-6 text-right">
                             <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">Restrict</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>


      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-custom-primary border-4 border-custom-secondary rounded-[60px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-full animate-in zoom-in duration-300">
            <div className="p-12 border-b border-custom-secondary flex justify-between items-center sticky top-0 bg-custom-primary z-10">
              <h3 className="text-4xl font-black text-custom-primary tracking-tighter">
                {editingProduct ? 'EDIT ARTIFACT' : 'REGISTER PRODUCT'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="w-12 h-12 rounded-full bg-custom-secondary flex items-center justify-center text-custom-secondary hover:text-red-500 hover:bg-red-500/10 transition-all">
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary ml-2">Name Specification</label>
                  <input
                    type="text"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                    className="w-full px-6 py-5 bg-custom-secondary/50 border-2 border-transparent rounded-[28px] focus:bg-custom-primary focus:border-accent text-custom-primary outline-none transition-all font-bold"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary ml-2">Collection Select</label>
                  <select
                    value={productFormData.categoryId}
                    onChange={(e) => setProductFormData({...productFormData, categoryId: e.target.value})}
                    className="w-full px-6 py-5 bg-custom-secondary/50 border-2 border-transparent rounded-[28px] focus:bg-custom-primary focus:border-accent text-custom-primary font-bold outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary ml-2">Valuation ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({...productFormData, price: e.target.value})}
                    className="w-full px-6 py-5 bg-custom-secondary/50 border-2 border-transparent rounded-[28px] focus:bg-custom-primary focus:border-accent text-custom-primary font-bold outline-none"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary ml-2">Inventory Depth</label>
                  <input
                    type="number"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({...productFormData, stock: e.target.value})}
                    className="w-full px-6 py-5 bg-custom-secondary/50 border-2 border-transparent rounded-[28px] focus:bg-custom-primary focus:border-accent text-custom-primary font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary ml-2">Narrative Description</label>
                <textarea
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                  rows={4}
                  className="w-full px-8 py-6 bg-custom-secondary/50 border-2 border-transparent rounded-[40px] focus:bg-custom-primary focus:border-accent text-custom-primary font-medium outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary">Visual Assets (URLs)</label>
                  <button type="button" onClick={addProductImageField} className="text-[10px] text-accent font-black uppercase tracking-widest hover:underline">+ Add Link</button>
                </div>
                <div className="space-y-4">
                    {productFormData.images.map((img, index) => (
                    <div key={index} className="flex gap-4">
                        <input
                        type="text"
                        placeholder="https://..."
                        value={img}
                        onChange={(e) => handleProductImageChange(index, e.target.value)}
                        className="grow px-6 py-5 bg-custom-secondary/50 border-2 border-transparent rounded-[28px] focus:bg-custom-primary focus:border-accent text-custom-primary font-medium outline-none"
                        required={index === 0}
                        />
                        {productFormData.images.length > 1 && (
                        <button type="button" onClick={() => removeProductImageField(index)} className="p-5 bg-red-500/10 text-red-500 rounded-[24px] hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 size={24} />
                        </button>
                        )}
                    </div>
                    ))}
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-6">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="grow p-6 font-black uppercase tracking-widest text-custom-secondary hover:bg-custom-secondary/50 rounded-[32px] transition-all">Dismiss</button>
                <button type="submit" className={`grow p-6 font-black uppercase tracking-widest rounded-[32px] transition-all shadow-2xl hover:scale-105 active:scale-95 ${
                  theme === 'gold' ? 'bg-[#d4af37] text-black shadow-[#d4af37]/30' : 'bg-indigo-600 text-white shadow-indigo-600/30'
                }`}>
                  {editingProduct ? 'Save Manifest' : 'Authorize Core'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-custom-primary border-4 border-custom-secondary rounded-[60px] w-full max-w-md shadow-full animate-in zoom-in duration-300">
            <div className="p-10 border-b border-custom-secondary flex justify-between items-center">
              <h3 className="text-3xl font-black text-custom-primary tracking-tighter">
                {editingCategory ? 'EDIT COLLECTION' : 'INIT COLLECTION'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="w-10 h-10 rounded-full bg-custom-secondary flex items-center justify-center text-custom-secondary hover:text-red-500 transition-all">
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-custom-secondary ml-2">Collection Identity</label>
                <input 
                  type="text" 
                  value={categoryFormData.name} 
                  onChange={(e) => setCategoryFormData({ name: e.target.value })}
                  placeholder="Premium Essentials..."
                  className="w-full px-8 py-6 bg-custom-secondary/50 border-2 border-transparent rounded-[32px] focus:bg-custom-primary focus:border-accent text-custom-primary font-black outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-4">
                <button type="submit" className={`w-full p-6 font-black uppercase tracking-widest rounded-[32px] transition-all shadow-2xl ${
                  theme === 'gold' ? 'bg-[#d4af37] text-black shadow-[#d4af37]/30' : 'bg-indigo-600 text-white shadow-indigo-600/30'
                }`}>
                  {editingCategory ? 'Update' : 'Initialize'}
                </button>
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="w-full p-4 font-black uppercase tracking-widest text-custom-secondary hover:bg-custom-secondary/50 rounded-2xl transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
