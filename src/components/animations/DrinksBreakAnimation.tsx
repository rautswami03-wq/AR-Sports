import React from 'react';
import { motion } from 'framer-motion';

export const DrinksBreakAnimation: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute bottom-28 inset-x-0 flex justify-center pointer-events-none z-50"
    >
      <div className="bg-sky-600 text-white px-12 py-3 rounded-xl border border-white font-black text-2xl uppercase tracking-widest shadow-2xl">
        DRINKS BREAK
      </div>
    </motion.div>
  );
};
