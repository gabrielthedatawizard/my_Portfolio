import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in
  if (user) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      toast.error('Invalid credentials. Please try again.');
    } else {
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Gabriel <span className="text-electric">Myeye</span>
          </h1>
          <p className="text-white/60">Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-charcoal-light border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-electric/10 rounded-lg">
              <Lock className="h-6 w-6 text-electric" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Sign In</h2>
              <p className="text-sm text-white/60">Access your admin panel</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@example.com"
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-electric"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-electric"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-electric hover:bg-electric-dark text-white py-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-white/40 hover:text-electric transition-colors">
              ← Back to website
            </a>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 bg-electric/10 border border-electric/20 rounded-xl p-4">
          <p className="text-sm text-electric font-medium mb-2">🚀 Demo Mode</p>
          <p className="text-sm text-white/60">
            Use these credentials to access the dashboard without Supabase:
          </p>
          <div className="mt-2 p-2 bg-charcoal rounded font-mono text-sm text-white/80">
            Email: <strong>demo</strong><br/>
            Password: <strong>demo</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
