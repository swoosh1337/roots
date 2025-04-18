
import React from 'react';
import { motion } from 'framer-motion';

interface RippleProps {
  isAnimating: boolean;
}

const Ripple: React.FC<RippleProps> = ({ isAnimating }) => {
  if (!isAnimating) return null;

  return (
    <motion.div 
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border border-blue-400/30"
          initial={{ width: 20, height: 20, opacity: 0.8 }}
          animate={{
            width: 100,
            height: 100,
            opacity: 0,
            x: -50,
            y: -50
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
            delay: index * 0.3
          }}
        />
      ))}
    </motion.div>
  );
};

export default Ripple;
