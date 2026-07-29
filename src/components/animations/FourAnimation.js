import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
export const FourAnimation = () => {
    const videoRef = useRef(null);
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((err) => console.log('Autoplay notice:', err));
        }
    }, []);
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, className: "fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-50 overflow-hidden", children: _jsx("video", { ref: videoRef, src: "/transitions/four.webm", autoPlay: true, playsInline: true, muted: true, className: "w-full h-full object-cover" }) }));
};
