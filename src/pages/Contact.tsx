import React from 'react';
import { Mail, Phone, Send, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useTheme } from '../store/useTheme';

const Contact = () => {
  const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contacts', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-custom-primary min-h-screen transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl font-extrabold text-custom-primary leading-tight">
            Get in <span className="text-accent underline decoration-accent/20">touch</span>
          </h1>
          <p className="text-xl text-custom-secondary leading-relaxed">
            Have a question about our products or need help with an order? Our dedicated team is here to assist you 24/7.
          </p>

          <div className="space-y-6 pt-8">
            <div className="flex items-center space-x-6 p-6 bg-custom-primary border border-custom-secondary rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-2xl ${theme === 'gold' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-indigo-50 text-indigo-600'}`}>
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-custom-secondary font-bold uppercase tracking-widest">Email Us</p>
                <p className="text-lg font-bold text-custom-primary">hello@lumina.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 p-6 bg-custom-primary border border-custom-secondary rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-2xl ${theme === 'gold' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-indigo-50 text-indigo-600'}`}>
                <Phone size={24} />
              </div>
              <div>
                <p className="text-sm text-custom-secondary font-bold uppercase tracking-widest">Call Us</p>
                <p className="text-lg font-bold text-custom-primary">+1 (555) 000-0000</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${theme === 'gold' ? 'bg-black border border-[#d4af37]' : 'bg-gray-900'} p-10 rounded-[40px] shadow-2xl relative overflow-hidden`}>
          <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full blur-3xl opacity-20 ${theme === 'gold' ? 'bg-[#d4af37]' : 'bg-indigo-600'}`}></div>
          
          <form onSubmit={handleSubmit} className="relative space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                className={`w-full px-6 py-4 border-none rounded-2xl text-white outline-none transition-all ${
                  theme === 'gold' ? 'bg-white/5 focus:ring-2 focus:ring-[#d4af37] placeholder:text-gray-600' : 'bg-gray-800 focus:ring-2 focus:ring-indigo-600 placeholder:text-gray-500'
                }`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                className={`w-full px-6 py-4 border-none rounded-2xl text-white outline-none transition-all ${
                  theme === 'gold' ? 'bg-white/5 focus:ring-2 focus:ring-[#d4af37] placeholder:text-gray-600' : 'bg-gray-800 focus:ring-2 focus:ring-indigo-600 placeholder:text-gray-500'
                }`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <textarea
                placeholder="Your Message..."
                required
                rows={5}
                className={`w-full px-6 py-4 border-none rounded-2xl text-white outline-none transition-all resize-none ${
                    theme === 'gold' ? 'bg-white/5 focus:ring-2 focus:ring-[#d4af37] placeholder:text-gray-600' : 'bg-gray-800 focus:ring-2 focus:ring-indigo-600 placeholder:text-gray-500'
                }`}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all disabled:opacity-50 ${
                theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b]' : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> <span>Send Message</span></>}
            </button>
            
            {success && (
              <p className={`${theme === 'gold' ? 'text-gold' : 'text-green-400'} text-center font-bold animate-bounce mt-4`}>Message sent successfully!</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
