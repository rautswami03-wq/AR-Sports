import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export const WicketAnimation: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const baseUrl = import.meta.env.BASE_URL || './';
  const videoSrc = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}transitions/wicket.webm`;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.log('Autoplay notice:', err));
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-50 overflow-hidden"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-10"
      />

      {/* High impact Animated Graphic Banner */}
      <motion.div
        initial={{ y: 80, scale: 0.5 }}
        animate={{ y: 0, scale: 1.1 }}
        exit={{ y: -80, scale: 0.5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="relative z-20 px-16 py-6 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 text-white rounded-3xl border-4 border-white shadow-[0_0_80px_rgba(239,68,68,0.9)] skew-x-[-12deg]"
      >
        <span className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] block text-center">
          WICKET! ☝️
        </span>
        <span className="text-sm md:text-xl font-black tracking-widest text-amber-300 block text-center uppercase">
          BATTER OUT
        </span>
      </motion.div>
    </motion.div>
  );
};
