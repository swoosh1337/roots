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
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/40 to-white/10"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-ritual-green/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-ritual-green/5 rounded-full blur-3xl"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div className="mb-6 relative">
            <img
              src="https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-1.png"
              alt="Roots Logo"
              className="h-32 w-auto mx-auto animate-tree-float"
            />
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-ritual-green/10 rounded-full blur-md"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-medium text-ritual-forest mb-4 tracking-tight">
            <span className="text-ritual-green">Roots</span>
          </h1>
          <p className="text-xl md:text-2xl text-ritual-forest/80 mb-6 max-w-2xl mx-auto">
            Cultivate meaningful habits, watch them grow, and transform your daily life through consistent rituals.
          </p>
          <p className="text-lg text-ritual-forest/60 mb-10">
            Join thousands building better habits one day at a time.
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
      <section id="how-it-works" className="py-24 px-4 bg-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-50 rounded-tr-full opacity-50"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-ritual-green text-sm font-medium tracking-wider uppercase">Simple Process</span>
            <h2 className="text-3xl md:text-5xl font-serif text-ritual-forest mt-2 mb-4">
              How Roots Works
            </h2>
            <p className="text-ritual-forest/70 max-w-2xl mx-auto">
              Our science-backed approach helps you build lasting habits through visualization and consistency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Step 1 */}
            <motion.div 
              className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-green-50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-50 p-5 rounded-full mb-6 relative">
                <Calendar className="h-10 w-10 text-ritual-green" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-ritual-green text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              </div>
              <h3 className="text-xl font-medium text-ritual-forest mb-3">Create Your Rituals</h3>
              <p className="text-ritual-forest/70 mb-4">Define the habits you want to cultivate - meditation, exercise, reading, or anything that matters to you.</p>
              <img 
                src="https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-1.png" 
                alt="Create rituals"
                className="w-16 h-auto mt-2"
              />
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-green-50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-50 p-5 rounded-full mb-6 relative">
                <Leaf className="h-10 w-10 text-ritual-green" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-ritual-green text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              </div>
              <h3 className="text-xl font-medium text-ritual-forest mb-3">Build Your Streaks</h3>
              <p className="text-ritual-forest/70 mb-4">Complete your rituals daily to maintain your streak. Watch as consistency transforms into lasting habits.</p>
              <img 
                src="https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-4.png" 
                alt="Build streaks"
                className="w-16 h-auto mt-2"
              />
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-green-50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-50 p-5 rounded-full mb-6 relative">
                <Users className="h-10 w-10 text-ritual-green" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-ritual-green text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              </div>
              <h3 className="text-xl font-medium text-ritual-forest mb-3">Watch Your Garden Grow</h3>
              <p className="text-ritual-forest/70 mb-4">As your streaks grow, so does your virtual garden. Visual growth reinforces your progress and motivates consistency.</p>
              <img 
                src="https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-6.png" 
                alt="Garden growth"
                className="w-16 h-auto mt-2"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-24 px-4 bg-green-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-ritual-green text-sm font-medium tracking-wider uppercase">Powerful Features</span>
            <h2 className="text-3xl md:text-5xl font-serif text-ritual-forest mt-2 mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-ritual-forest/70 max-w-2xl mx-auto">
              Designed with simplicity and effectiveness in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-green-50 hover:border-ritual-green/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-ritual-green mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-ritual-forest mb-2">Daily Tracking</h3>
              <p className="text-ritual-forest/70">
                Track your daily habits with a simple, intuitive interface that makes consistency easy.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-green-50 hover:border-ritual-green/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-ritual-green mb-4">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-ritual-forest mb-2">Visual Growth</h3>
              <p className="text-ritual-forest/70">
                Watch your virtual garden grow as you maintain your streaks, providing visual motivation.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-green-50 hover:border-ritual-green/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-ritual-green mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-ritual-forest mb-2">Community Support</h3>
              <p className="text-ritual-forest/70">
                Connect with friends to stay accountable and motivated on your journey.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Visual Demo Section */}
      <section className="py-24 px-4 bg-green-50 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-ritual-green text-sm font-medium tracking-wider uppercase">Visual Motivation</span>
            <h2 className="text-3xl md:text-5xl font-serif text-ritual-forest mt-2 mb-4">
              Watch Your Habits Flourish
            </h2>
            <p className="text-ritual-forest/70 max-w-2xl mx-auto">
              See your progress transform from a tiny sprout to a magnificent tree
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <h3 className="text-2xl font-medium text-ritual-forest mb-4">Visualize Your Growth Journey</h3>
              <p className="text-ritual-forest/70 mb-6">
                As you maintain your daily rituals, watch your tree grow from a small sprout to a flourishing tree. 
                Every completed ritual adds to your streak, and every streak milestone transforms your garden.
              </p>
              <p className="text-ritual-forest/70 mb-6">
                The visual representation of your progress creates a powerful feedback loop that keeps you motivated day after day.
              </p>
              <div className="flex items-center text-ritual-green hover:text-ritual-green/80 transition-colors">
                <Link to="/auth" className="font-medium flex items-center">
                  Start growing today <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 flex justify-center"
            >
              <div className="relative">
                <div className="flex justify-center items-end gap-8">
                  <div className="flex flex-col items-center">
                    <img 
                      src="https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-1.png" 
                      alt="Sprout stage" 
                      className="h-24 w-auto"
                    />
                    <span className="text-sm text-ritual-forest/70 mt-2">Day 1</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img 
                      src="https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-4.png" 
                      alt="Growing stage" 
                      className="h-40 w-auto"
                    />
                    <span className="text-sm text-ritual-forest/70 mt-2">Day 7</span>
                  </div>
                  <div className="flex flex-col items-center animate-tree-float">
                    <img 
                      src="https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-6.png" 
                      alt="Mature tree" 
                      className="h-64 w-auto"
                    />
                    <span className="text-sm text-ritual-forest/70 mt-2">Day 30+</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-4 bg-ritual-green/10 rounded-full blur-md"></div>
              </div>
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

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-ritual-green/10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-ritual-green/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-ritual-green/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-10 md:p-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-ritual-forest mb-4">
                Ready to Start Your Growth Journey?
              </h2>
              <p className="text-ritual-forest/70 mb-8 max-w-2xl mx-auto">
                Join thousands of others who are transforming their daily habits and watching their virtual gardens flourish.
              </p>
              <Button 
                size="lg" 
                className="bg-ritual-green hover:bg-ritual-green/90 text-white rounded-full px-10 py-6 text-lg"
                onClick={() => window.location.href = '/auth'}
              >
                Get Started Now 🌱
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-ritual-forest/5 border-t border-ritual-forest/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 flex items-center">
              <Leaf className="h-6 w-6 text-ritual-green mx-auto md:mx-0 mr-2" />
              <span className="text-ritual-forest font-medium">Roots</span>
            </div>
            
            <div className="flex space-x-6 text-sm text-ritual-forest/60">
              <a href="mailto:support@rootsgarden.app" className="hover:text-ritual-forest transition-colors">Support</a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-ritual-forest/50">
            Made with 🌿 by <a href="https://github.com/swoosh1337" className="hover:text-ritual-green transition-colors">swoosh1337</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
