import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const TeamBadge = ({ shortName, primaryColor, secondaryColor = '#ffffff', size = 'md', logoUrl, }) => {
    const dimensions = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base',
        xl: 'w-24 h-24 text-xl',
    }[size];
    if (logoUrl) {
        return (_jsx("img", { src: logoUrl, alt: shortName, className: `${dimensions} object-contain filter drop-shadow-md` }));
    }
    return (_jsxs("div", { className: `${dimensions} rounded-full flex items-center justify-center font-extrabold shadow-lg border-2 border-white/20 tracking-wider relative overflow-hidden`, style: {
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            color: '#ffffff',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        }, children: [_jsx("div", { className: "absolute inset-0 bg-white/10 blur-sm pointer-events-none" }), _jsx("span", { className: "relative z-10 uppercase", children: shortName })] }));
};
