import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export const FourAnimation: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.log('Autoplay notice:', err));
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-50 overflow-hidden"
    >
      {/* High Quality Transparent Video Transition by Rakib */}
      <video
        ref={videoRef}
        src="/transitions/four.webm"
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};
