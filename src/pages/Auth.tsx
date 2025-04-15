import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sprout, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { Separator } from '@/components/ui/separator';

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
  const { user, signInWithGoogle } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Add name field only for sign up
  const isSignUp = activeTab === 'register';

  // Combined handler for both Login and Sign Up
  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        // Sign Up logic
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              // Use provided name or derive from email
              name: name || email.split('@')[0],
            },
          },
        });
        if (error) throw error;
        toast({ title: "Welcome!", description: "Account created. Check email for verification.", className: "bg-ritual-green/20 border-ritual-green text-ritual-forest" });
        // Optionally switch to login tab or keep on register
        // setActiveTab('login'); 
      } else {
        // Sign In logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Successful login is handled by onAuthStateChange which navigates
        // navigate('/'); // No longer needed here
      }
    } catch (error) {
      console.error("Auth Action Error:", error);
      toast({ 
        title: isSignUp ? "Signup Failed" : "Login Failed", 
        description: error instanceof Error ? error.message : "An unexpected error occurred", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    await signInWithGoogle();
    // No need to setGoogleLoading(false) here as the page redirects
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
        
        {/* Form now uses handleAuthAction for both tabs */}
        <form onSubmit={handleAuthAction} className="space-y-5">
          {/* Name Field (Register Only) */}
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-[#2E3D27]">
                Name (Optional)
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-[#FDFBF7] border-[#2E3D27]/20 focus:border-ritual-green focus:ring-ritual-green/20 placeholder:text-[#2E3D27]/30"
              />
            </div>
          )}

          {/* Email Field */}
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
          
          {/* Password Field */}
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

          {/* Divider and Google Button (Appears for both Login & Register) */}
          <div className="relative flex items-center py-3">
            <div className="flex-grow border-t border-[#2E3D27]/20"></div>
            <span className="flex-shrink mx-4 text-xs text-[#2E3D27]/60">OR</span>
            <div className="flex-grow border-t border-[#2E3D27]/20"></div>
          </div>

          <GoogleSignInButton onClick={handleGoogleAuth} loading={googleLoading} />
          
          {/* Main Action Button (Label changes based on active tab) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <Button
              type="submit"
              className="w-full bg-[#9EC1A3] text-[#2E3D27] font-semibold py-6 rounded-full hover:bg-[#FFD6A5] transition-colors duration-300 shadow-md"
              disabled={loading || googleLoading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Login')}
            </Button>
          </motion.div>

          {/* Toggle between Login/Register */}
          <p className="text-center text-sm text-[#2E3D27]/70 pt-2">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setActiveTab(isSignUp ? 'login' : 'register')}
              className="font-medium text-ritual-green hover:underline focus:outline-none"
            >
              {isSignUp ? 'Login' : 'Create Account'}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;
