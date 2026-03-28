import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/Dashboard';
import Register from './pages/Register';
import Categories from './pages/Categories';
import { useEffect } from 'react';
import { useTheme } from './store/useTheme';

const About = () => (
  <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8 bg-custom-primary transition-colors duration-300 min-h-screen">
    <h1 className="text-5xl font-extrabold text-custom-primary">Our Story</h1>
    <p className="text-xl text-custom-secondary leading-relaxed">
      LUMINA was founded with a simple mission: to bring premium, high-quality essentials to your doorstep. 
      We believe in the perfect balance of design and functionality.
    </p>
    <div className="grid grid-cols-3 gap-8 pt-12">
      <div className="p-6 bg-custom-secondary rounded-3xl"><h3 className="text-3xl font-extrabold text-accent">10k+</h3><p className="text-custom-secondary font-bold">Customers</p></div>
      <div className="p-6 bg-custom-secondary rounded-3xl"><h3 className="text-3xl font-extrabold text-accent">500+</h3><p className="text-custom-secondary font-bold">Products</p></div>
      <div className="p-6 bg-custom-secondary rounded-3xl"><h3 className="text-3xl font-extrabold text-accent">24/7</h3><p className="text-custom-secondary font-bold">Support</p></div>
    </div>
  </div>
);

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="categories" element={<Categories />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
