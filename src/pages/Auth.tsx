
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Sprout, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

const Auth = () => {
  // State for login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // State for registration form
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // State for magic link
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);

  // State for Google sign-in
  const [googleLoading, setGoogleLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, sendMagicLink } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    console.log("Auth page - user state changed:", user ? "logged in" : "not logged in");
    if (user) {
      console.log("User is logged in, redirecting to home page");
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoginLoading(true);
      await signInWithEmail(loginEmail, loginPassword);

      // Force navigation to home page after successful login
      console.log("Login successful, forcing navigation to home page");
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setRegisterLoading(true);
      await signUpWithEmail(registerEmail, registerPassword);
    } catch (error) {
      console.error(error);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMagicLinkLoading(true);
      await sendMagicLink(magicLinkEmail);
    } catch (error) {
      console.error(error);
    } finally {
      setMagicLinkLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();

      // Google sign-in is handled via redirect, so we don't need to navigate
      // But we'll add a fallback in case the redirect doesn't happen
      setTimeout(() => {
        if (user) {
          console.log("Google sign-in successful, forcing navigation to home page");
          navigate('/');
        }
      }, 2000);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setGoogleLoading(false);
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
        <div className="text-center mb-6">
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

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#FDFBF7]/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-ritual-green data-[state=active]:text-white">Login</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-ritual-green data-[state=active]:text-white">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="login-email" className="block text-sm font-medium text-[#2E3D27]">
                  Email
                </label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-[#FDFBF7] border-[#2E3D27]/20 focus:border-ritual-green focus:ring-ritual-green/20 placeholder:text-[#2E3D27]/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="block text-sm font-medium text-[#2E3D27]">
                  Password
                </label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#FDFBF7] border-[#2E3D27]/20 focus:border-ritual-green focus:ring-ritual-green/20 placeholder:text-[#2E3D27]/30"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-6 mt-4 bg-[#A1C181] hover:bg-[#A1C181]/90 text-white rounded-full font-medium shadow-md"
                >
                  <Lock className="mr-2 h-5 w-5" />
                  {loginLoading ? "Logging in..." : "Login"}
                </Button>
              </motion.div>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2E3D27]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#DBE4C6] text-[#2E3D27]/60">Or continue with</span>
              </div>
            </div>

            {/* Magic Link */}
            <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="magic-email" className="block text-sm font-medium text-[#2E3D27]">
                  Email for Magic Link
                </label>
                <Input
                  id="magic-email"
                  type="email"
                  value={magicLinkEmail}
                  onChange={(e) => setMagicLinkEmail(e.target.value)}
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
                  disabled={magicLinkLoading}
                  className="w-full py-6 bg-[#FDFBF7] hover:bg-[#FDFBF7]/90 text-[#2E3D27] border border-[#2E3D27]/20 rounded-full font-medium shadow-sm"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  {magicLinkLoading ? "Sending magic link..." : "Send Magic Link"}
                </Button>
              </motion.div>
            </form>

            {/* Google Sign-In */}
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              loading={googleLoading}
            />
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="register-email" className="block text-sm font-medium text-[#2E3D27]">
                  Email
                </label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-[#FDFBF7] border-[#2E3D27]/20 focus:border-ritual-green focus:ring-ritual-green/20 placeholder:text-[#2E3D27]/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="register-password" className="block text-sm font-medium text-[#2E3D27]">
                  Password
                </label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#FDFBF7] border-[#2E3D27]/20 focus:border-ritual-green focus:ring-ritual-green/20 placeholder:text-[#2E3D27]/30"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={registerLoading}
                  className="w-full py-6 mt-4 bg-[#A1C181] hover:bg-[#A1C181]/90 text-white rounded-full font-medium shadow-md"
                >
                  <User className="mr-2 h-5 w-5" />
                  {registerLoading ? "Creating account..." : "Create Account"}
                </Button>
              </motion.div>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2E3D27]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#DBE4C6] text-[#2E3D27]/60">Or register with</span>
              </div>
            </div>

            {/* Google Sign-In */}
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              loading={googleLoading}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Auth;
