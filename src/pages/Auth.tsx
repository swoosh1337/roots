
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Sprout, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;
      
      toast({
        title: "Magic link sent! 🪄",
        description: "Check your email for a login link.",
        className: "bg-ritual-green/20 border-ritual-green text-ritual-forest",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Couldn't send magic link",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={handleMagicLinkSignIn} className="space-y-6">
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
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 mt-6 bg-[#A1C181] hover:bg-[#A1C181]/90 text-white rounded-full font-medium shadow-md"
            >
              <Mail className="mr-2 h-5 w-5" />
              {loading ? "Sending magic link..." : "Send Magic Link"}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;
