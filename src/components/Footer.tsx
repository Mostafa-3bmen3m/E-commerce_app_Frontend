import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../store/useTheme';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 border-t border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className={`text-2xl font-bold ${theme === 'gold' ? 'text-gold' : 'text-white'}`}>LUMINA</h3>
          <p className="text-sm leading-relaxed">
            Premium products for the modern lifestyle. Design meets functionality to bring you the best in e-commerce.
          </p>
          <div className="flex space-x-4">
            <a href="#" className={`hover:text-accent transition-colors ${theme === 'gold' ? 'text-gold' : 'text-indigo-400'}`}><Globe size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className={`font-semibold mb-6 ${theme === 'gold' ? 'text-gold' : 'text-white'}`}>Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/products" className="hover:text-accent transition-colors">Shop All</Link></li>
            <li><Link to="/categories" className="hover:text-accent transition-colors">Categories</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={`font-semibold mb-6 ${theme === 'gold' ? 'text-gold' : 'text-white'}`}>Support</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-accent transition-colors">Shipping Info</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className={`font-semibold mb-6 ${theme === 'gold' ? 'text-gold' : 'text-white'}`}>Contact Info</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-accent shrink-0" />
              <span>123 Design Street, Creative City, 10101</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-accent shrink-0" />
              <span>+1 (555) 000-0000</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-accent shrink-0" />
              <span>hello@lumina.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 text-center text-xs">
        © {new Date().getFullYear()} LUMINA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
