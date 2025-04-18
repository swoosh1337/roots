
import React from 'react';
import { motion } from 'framer-motion';
import { Droplet } from 'lucide-react';

interface WaterDropProps {
  isAnimating: boolean;
}

const WaterDrop: React.FC<WaterDropProps> = ({ isAnimating }) => {
  if (!isAnimating) return null;

  return (
    <motion.div
      className="absolute left-1/2 top-0 -translate-x-1/2"
      initial={{ y: -20, opacity: 0 }}
      animate={{ 
        y: 100,
        opacity: [0, 1, 1, 0]
      }}
      transition={{ 
        duration: 1.5,
        ease: "easeInOut",
      }}
    >
      <Droplet 
        size={24}
        className="text-blue-400/80"
        fill="currentColor"
      />
    </motion.div>
  );
};

export default WaterDrop;
