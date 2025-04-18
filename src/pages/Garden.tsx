
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import IsometricGarden from '@/components/garden/IsometricGarden';
import { useRituals } from '@/hooks/useRituals';
import { Button } from '@/components/ui/button';

const Garden = () => {
  const navigate = useNavigate();
  const { rituals, loading } = useRituals();

  return (
    <div className="min-h-screen bg-ritual-paper flex flex-col items-center justify-center p-6">
      <motion.h1 
        className="text-5xl font-serif text-ritual-green mb-8 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        My Garden
      </motion.h1>
      
      {loading ? (
        <div className="animate-pulse text-ritual-forest">Loading your garden...</div>
      ) : (
        <motion.div
          className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <IsometricGarden rituals={rituals} />
        </motion.div>
      )}
      
      <motion.div 
        className="mt-10 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all"
        >
          <ArrowLeft size={18} />
          <span>Back to Focus</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default Garden;
