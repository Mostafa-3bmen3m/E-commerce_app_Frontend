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



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-custom-primary min-h-screen transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-12">

        <div className="w-full md:w-64 shrink-0 space-y-4">
          <div className={`${theme === 'gold' ? 'bg-black border border-[#d4af37]' : 'bg-gray-900'} text-white p-8 rounded-3xl space-y-2 shadow-xl`}>
            <h2 className={`text-xl font-bold mb-4 flex items-center ${theme === 'gold' ? 'text-gold' : 'text-white'}`}>
              <BarChart3 className="mr-2" size={20} /> Dashboard
            </h2>
            <nav className="space-y-1">
              {[
                { id: 'products', label: 'Products', icon: Package },
                { id: 'categories', label: 'Categories', icon: Tags },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'users', label: 'Users', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all ${
                    activeTab === tab.id 
                      ? (theme === 'gold' ? 'bg-[#d4af37] text-black' : 'bg-indigo-600 text-white')
                      : (theme === 'gold' ? 'text-[#d4af37] hover:bg-[#d4af37]/10' : 'text-gray-400 hover:text-white hover:bg-gray-800')
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-bold">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>


        <div className="grow space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-custom-primary capitalize">{activeTab} Management</h1>
            {(activeTab === 'products' || activeTab === 'categories') && (
              <button 
                onClick={() => activeTab === 'products' ? handleOpenProductModal() : handleOpenCategoryModal()}
                className={`px-6 py-3 rounded-xl font-bold flex items-center transition-all shadow-lg ${
                  theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b]' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200/50'
                }`}
              >
                <Plus size={20} className="mr-2" /> Add {activeTab === 'products' ? 'Product' : 'Category'}
              </button>
            )}
          </div>

          <div className="bg-custom-primary border border-custom-secondary rounded-3xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-custom-secondary font-medium italic">Loading {activeTab}...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-custom-secondary text-custom-secondary text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">
                      {activeTab === 'products' ? 'Name / ID' : activeTab === 'categories' ? 'Category Name' : activeTab === 'orders' ? 'Order ID / User' : 'Name / Email'}
                    </th>
                    <th className="px-6 py-4">
                      {activeTab === 'products' ? 'Category' : activeTab === 'categories' ? 'Product Count' : activeTab === 'orders' ? 'Status' : 'Role'}
                    </th>
                    <th className="px-6 py-4">
                      {activeTab === 'products' ? 'Price / Stock' : activeTab === 'categories' ? 'ID' : activeTab === 'orders' ? 'Total Amount' : 'Joined Date'}
                    </th>
                    {(activeTab === 'products' || activeTab === 'categories') && <th className="px-6 py-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-custom-secondary">

                  {activeTab === 'products' && products.map((product) => (
                    <tr key={product.id} className="hover:bg-custom-secondary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-custom-secondary rounded-lg overflow-hidden shrink-0 border border-custom-secondary">
                            <img src={product.images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <p className="font-bold text-custom-primary text-sm truncate max-w-[200px]">{product.name}</p>
                            <p className="text-custom-secondary text-xs truncate max-w-[200px]">{product.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          theme === 'gold' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-custom-primary text-sm">${product.price.toFixed(2)}</p>
                        <p className="text-custom-secondary text-xs">{product.stock} in stock</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => handleOpenProductModal(product)} className="p-2 text-custom-secondary hover:text-accent transition-colors"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-custom-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}


                  {activeTab === 'categories' && categories.map((category) => (
                    <tr key={category.id} className="hover:bg-custom-secondary/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-custom-primary text-sm">
                        {category.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          theme === 'gold' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {category._count?.products || 0} Products
                        </span>
                      </td>
                      <td className="px-6 py-4 text-custom-secondary text-xs whitespace-nowrap">
                        {category.id.slice(0, 12)}...
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => handleOpenCategoryModal(category)} className="p-2 text-custom-secondary hover:text-accent transition-colors"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteCategory(category.id)} className="p-2 text-custom-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}


                  {activeTab === 'orders' && orders.map((order) => (
                    <tr key={order.id} className="hover:bg-custom-secondary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-custom-primary text-sm">#{order.id.slice(0, 8)}...</p>
                          <p className="text-custom-secondary text-xs">{order.user?.name || 'Guest'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'DELIVERED' ? 'bg-green-50/10 text-green-500' :
                          order.status === 'CANCELLED' ? 'bg-red-50/10 text-red-500' :
                          'bg-yellow-50/10 text-yellow-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 font-bold text-sm ${theme === 'gold' ? 'text-gold' : 'text-custom-primary'}`}>
                        ${order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}


                  {activeTab === 'users' && users.map((user) => (
                    <tr key={user.id} className="hover:bg-custom-secondary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-custom-primary text-sm">{user.name}</p>
                          <p className="text-custom-secondary text-xs">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          user.role === 'ADMIN' ? 'bg-purple-50/10 text-purple-500' : 'bg-custom-secondary/50 text-custom-secondary'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-custom-secondary text-xs italic">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>


      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-custom-primary border border-custom-secondary rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-custom-secondary flex justify-between items-center sticky top-0 bg-custom-primary z-10">
              <h3 className="text-2xl font-bold text-custom-primary">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-custom-secondary hover:text-custom-primary transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-custom-secondary">Product Name</label>
                  <input
                    type="text"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                    className="w-full p-4 bg-custom-secondary border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-custom-primary placeholder:text-custom-secondary/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-custom-secondary">Category</label>
                  <select
                    value={productFormData.categoryId}
                    onChange={(e) => setProductFormData({...productFormData, categoryId: e.target.value})}
                    className="w-full p-4 bg-custom-secondary border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-custom-primary"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-custom-secondary">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({...productFormData, price: e.target.value})}
                    className="w-full p-4 bg-custom-secondary border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-custom-primary placeholder:text-custom-secondary/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-custom-secondary">Stock Quantity</label>
                  <input
                    type="number"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({...productFormData, stock: e.target.value})}
                    className="w-full p-4 bg-custom-secondary border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-custom-primary placeholder:text-custom-secondary/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-custom-secondary">Description</label>
                <textarea
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                  rows={4}
                  className="w-full p-4 bg-custom-secondary border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-custom-primary placeholder:text-custom-secondary/50"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-custom-secondary">Product Images (URLs)</label>
                  <button type="button" onClick={addProductImageField} className="text-xs text-accent font-bold hover:underline">+ Add More</button>
                </div>
                {productFormData.images.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={img}
                      onChange={(e) => handleProductImageChange(index, e.target.value)}
                      className="grow p-4 bg-custom-secondary border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-custom-primary placeholder:text-custom-secondary/50"
                      required={index === 0}
                    />
                    {productFormData.images.length > 1 && (
                      <button type="button" onClick={() => removeProductImageField(index)} className="p-4 text-red-500 hover:bg-red-50/10 rounded-xl transition-colors">
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="grow p-4 font-bold text-custom-secondary hover:bg-custom-secondary/50 rounded-xl transition-all">Cancel</button>
                <button type="submit" className={`grow p-4 font-bold rounded-xl transition-all shadow-lg ${
                  theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b]' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200/50'
                }`}>
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-custom-primary border border-custom-secondary rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-custom-secondary flex justify-between items-center">
              <h3 className="text-2xl font-bold text-custom-primary">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-custom-secondary hover:text-custom-primary transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-custom-secondary">Category Name</label>
                <input 
                  type="text" 
                  value={categoryFormData.name} 
                  onChange={(e) => setCategoryFormData({ name: e.target.value })}
                  placeholder="Enter name..."
                  className="w-full p-4 bg-custom-secondary border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-custom-primary"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="grow p-4 font-bold text-custom-secondary hover:bg-custom-secondary/50 rounded-xl transition-all">Cancel</button>
                <button type="submit" className={`grow p-4 font-bold rounded-xl transition-all shadow-lg ${
                  theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b]' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200/50'
                }`}>
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
