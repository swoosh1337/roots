
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sprout } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Welcome to Roots!",
        description: "Your account has been created. Please check your email for verification.",
        className: "bg-ritual-green/20 border-ritual-green text-ritual-forest",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Couldn't create your account",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      navigate('/');
    } catch (error) {
      console.error(error);
      toast({
        title: "Couldn't sign you in",
        description: error instanceof Error ? error.message : "Please check your email and password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true);
      console.log("Attempting Google Sign-In...");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error("Error signing in with Google:", error);
        toast({
          title: "Google Sign-in Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Redirecting to Google for authentication...");
      }
    } catch (error) {
      console.error("Unexpected error during Google sign-in:", error);
      toast({
        title: "Google Sign-in Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FDFBF7]">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-10 left-1/4 w-6 h-6 bg-ritual-green rounded-full" />
        <div className="absolute top-1/4 right-1/3 w-4 h-4 bg-ritual-peach rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-[#2E3D27] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-ritual-moss rounded-full" />
      </div>
      
      {/* Card container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 mx-4 rounded-2xl shadow-lg bg-[#DBE4C6] backdrop-blur-sm"
      >
        {/* App branding */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-[#2E3D27] mb-2">Roots</h1>
          <p className="text-[#2E3D27]/80 text-sm">
            Grow your rituals. One streak at a time.
          </p>
        </div>
        
        {/* The sprout icon */}
        <div className="absolute -top-6 right-8">
          <motion.div
            animate={{ 
              y: [0, -5, 0], 
              scale: [1, 1.05, 1],
              rotate: [0, 2, 0, -2, 0]
            }}
            transition={{ 
              duration: 4, 
              ease: "easeInOut", 
              repeat: Infinity,
            }}
          >
            <Sprout className="h-12 w-12 text-ritual-green" />
          </motion.div>
        </div>
        
        {/* Tabs */}
        <div className="flex rounded-full bg-[#FDFBF7]/60 p-1 mb-6">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
              activeTab === 'login'
                ? 'bg-[#FFD6A5] text-[#2E3D27]'
                : 'text-[#2E3D27]/60 hover:text-[#2E3D27]'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
              activeTab === 'register'
                ? 'bg-[#FFD6A5] text-[#2E3D27]'
                : 'text-[#2E3D27]/60 hover:text-[#2E3D27]'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>
        
        {activeTab === 'login' ? (
          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#2E3D27]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full bg-[#FDFBF7] border-[#2E3D27]/20 focus:border-ritual-green focus:ring-ritual-green/20 placeholder:text-[#2E3D27]/30"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#2E3D27]">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#FDFBF7] border-[#2E3D27]/20 focus:border-ritual-green focus:ring-ritual-green/20 pr-10 placeholder:text-[#2E3D27]/30"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#2E3D27]/50 hover:text-[#2E3D27]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 mt-6 bg-[#A1C181] hover:bg-[#A1C181]/90 text-white rounded-full font-medium shadow-md"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </motion.div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2E3D27]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#DBE4C6] text-[#2E3D27]/60">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                onClick={signInWithGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center py-6 bg-[#FDFBF7] hover:bg-[#FDFBF7]/90 text-[#2E3D27] border border-[#2E3D27]/20 rounded-full font-medium shadow-sm"
              >
                {/* Google SVG icon - direct inline SVG instead of using the Icon component */}
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12 L16 12"></path>
                  <path d="M12 8 L12 16"></path>
                </svg>
                {googleLoading ? "Connecting..." : "Sign in with Google"}
              </Button>
            </motion.div>
            
            <p className="text-center text-sm text-[#2E3D27]/70 mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-ritual-green font-medium hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-[#2E3D27]">
                Name <span className="text-[#2E3D27]/50">(optional)</span>
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#FDFBF7] border-[#2E3D27]/20 focus:border-ritual-green focus:ring-ritual-green/20 placeholder:text-[#2E3D27]/30"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#2E3D27]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full bg-[#FDFBF7] border-[#2E3D27]/20 focus:border-ritual-green focus:ring-ritual-green/20 placeholder:text-[#2E3D27]/30"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#2E3D27]">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#FDFBF7] border-[#2E3D27]/20 focus:border-ritual-green focus:ring-ritual-green/20 pr-10 placeholder:text-[#2E3D27]/30"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#2E3D27]/50 hover:text-[#2E3D27]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-[#2E3D27]/60 mt-1">
                Password must be at least 6 characters
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 mt-6 bg-[#A1C181] hover:bg-[#A1C181]/90 text-white rounded-full font-medium shadow-md"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </motion.div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2E3D27]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#DBE4C6] text-[#2E3D27]/60">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                onClick={signInWithGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center py-6 bg-[#FDFBF7] hover:bg-[#FDFBF7]/90 text-[#2E3D27] border border-[#2E3D27]/20 rounded-full font-medium shadow-sm"
              >
                {/* Google SVG icon - direct inline SVG instead of using the Icon component */}
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12 L16 12"></path>
                  <path d="M12 8 L12 16"></path>
                </svg>
                {googleLoading ? "Connecting..." : "Sign up with Google"}
              </Button>
            </motion.div>
            
            <p className="text-center text-sm text-[#2E3D27]/70 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-ritual-green font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
