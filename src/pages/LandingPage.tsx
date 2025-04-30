import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, Leaf, Calendar, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-6">
            <Leaf className="h-16 w-16 text-ritual-green mx-auto animate-leaf-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-ritual-forest mb-4">
            Roots
          </h1>
          <p className="text-xl md:text-2xl text-ritual-forest/80 mb-10">
            Grow your daily rituals. Keep your streaks alive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-ritual-green hover:bg-ritual-green/90 text-white rounded-full px-8"
              onClick={() => window.location.href = '/auth'}
            >
              Start Growing 🌱
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-ritual-forest/20 text-ritual-forest rounded-full px-8"
              onClick={() => scrollToSection('how-it-works')}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10"
        >
          <ArrowDown 
            className="h-8 w-8 text-ritual-forest/50 animate-bounce cursor-pointer" 
            onClick={() => scrollToSection('how-it-works')}
          />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-ritual-forest mb-16">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {/* Step 1 */}
            <motion.div 
              className="flex flex-col items-center text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-50 p-5 rounded-full mb-6">
                <Calendar className="h-10 w-10 text-ritual-green" />
              </div>
              <h3 className="text-xl font-medium text-ritual-forest mb-2">Create Rituals</h3>
              <p className="text-ritual-forest/70">Define your daily or weekly habits.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="flex flex-col items-center text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-50 p-5 rounded-full mb-6">
                <Leaf className="h-10 w-10 text-ritual-green" />
              </div>
              <h3 className="text-xl font-medium text-ritual-forest mb-2">Keep Your Streaks</h3>
              <p className="text-ritual-forest/70">Complete rituals to grow your tree.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="flex flex-col items-center text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-50 p-5 rounded-full mb-6">
                <Users className="h-10 w-10 text-ritual-green" />
              </div>
              <h3 className="text-xl font-medium text-ritual-forest mb-2">Grow Together</h3>
              <p className="text-ritual-forest/70">Add friends and stay accountable.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visual Demo Section */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-ritual-forest mb-12">
            Watch Your Habits Grow
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <h3 className="text-2xl font-medium text-ritual-forest mb-4">Visualize Your Progress</h3>
              <p className="text-ritual-forest/70 mb-6">
                As you maintain your daily rituals, watch your tree grow from a small sprout to a flourishing tree. 
                Every streak brings new growth and visual rewards.
              </p>
              <div className="flex items-center text-ritual-green hover:text-ritual-green/80 transition-colors">
                <Link to="/auth" className="font-medium flex items-center">
                  Start your journey <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 flex justify-center animate-tree-float"
            >
              <img 
                src="https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-3.png" 
                alt="Growing tree visualization" 
                className="max-w-full h-auto max-h-80 object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-ritual-forest mb-12">
            What Our Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-green-50 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="italic text-ritual-forest/80 mb-4">
                "I finally journal every day! The visual growth keeps me motivated like nothing else."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-ritual-green/20 flex items-center justify-center text-ritual-green font-medium mr-3">
                  P
                </div>
                <span className="text-ritual-forest font-medium">Polina</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-green-50 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="italic text-ritual-forest/80 mb-4">
                "The streaks keep me motivated like nothing else. I've never stuck with meditation this long before!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-ritual-green/20 flex items-center justify-center text-ritual-green font-medium mr-3">
                  S
                </div>
                <span className="text-ritual-forest font-medium">Said</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-ritual-forest/5 border-t border-ritual-forest/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Leaf className="h-6 w-6 text-ritual-green mx-auto md:mx-0" />
            </div>
            
            <div className="flex space-x-6 text-sm text-ritual-forest/60">
              <a href="mailto:support@rootsgarden.app" className="hover:text-ritual-forest transition-colors">Support</a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-ritual-forest/50">
            Made with 🌿 by  <a href="https://github.com/swoosh1337">swoosh1337</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
