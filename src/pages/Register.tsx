import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../store/useTheme';
import type { RegisterFormData } from '../schemas/authSchema';
import { registerSchema } from '../schemas/authSchema';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setServerError('');
    try {
      const response = await api.post('/auth/register', data);
      setAuth(response.data.user, response.data.accessToken);
      if (response.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-custom-primary transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-custom-primary p-10 rounded-3xl border border-custom-secondary shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-custom-primary">Create Account</h2>
          <p className="mt-2 text-custom-secondary">Join LUMINA today and start shopping</p>
        </div>
        
        {serverError && (
          <div className="bg-red-50/10 text-red-500 p-4 rounded-xl text-sm font-medium flex items-center gap-2 border border-red-500/20">
            <AlertCircle size={16} />
            {serverError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-secondary" size={18} />
              <input
                type="text"
                {...register('name')}
                className={`w-full pl-12 pr-4 py-3 bg-custom-secondary border ${errors.name ? 'border-red-500' : 'border-transparent'} rounded-xl focus:bg-custom-primary focus:border-accent outline-none transition-all text-custom-primary placeholder:text-custom-secondary/50`}
                placeholder="Full Name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500 ml-2">{errors.name.message}</p>}
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-secondary" size={18} />
              <input
                type="email"
                {...register('email')}
                className={`w-full pl-12 pr-4 py-3 bg-custom-secondary border ${errors.email ? 'border-red-500' : 'border-transparent'} rounded-xl focus:bg-custom-primary focus:border-accent outline-none transition-all text-custom-primary placeholder:text-custom-secondary/50`}
                placeholder="Email address"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500 ml-2">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-secondary" size={18} />
              <input
                type="password"
                {...register('password')}
                className={`w-full pl-12 pr-4 py-3 bg-custom-secondary border ${errors.password ? 'border-red-500' : 'border-transparent'} rounded-xl focus:bg-custom-primary focus:border-accent outline-none transition-all text-custom-primary placeholder:text-custom-secondary/50`}
                placeholder="Password"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500 ml-2">{errors.password.message}</p>}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-secondary" size={18} />
              <input
                type="password"
                {...register('confirmPassword')}
                className={`w-full pl-12 pr-4 py-3 bg-custom-secondary border ${errors.confirmPassword ? 'border-red-500' : 'border-transparent'} rounded-xl focus:bg-custom-primary focus:border-accent outline-none transition-all text-custom-primary placeholder:text-custom-secondary/50`}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 ml-2">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent font-bold rounded-xl transition-all shadow-lg ${
              theme === 'gold' ? 'bg-[#d4af37] text-black hover:bg-[#b8860b]' : 'bg-accent text-white hover:bg-accent-hover shadow-indigo-200/50'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
          </button>

          <div className="text-center">
            <p className="text-custom-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-bold hover:underline inline-flex items-center">
                Login <ArrowRight size={14} className="ml-1" />
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
