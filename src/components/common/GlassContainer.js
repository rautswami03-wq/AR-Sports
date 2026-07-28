import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const GlassContainer = ({ children, className = '', variant = 'standard', borderColor, }) => {
    const variantClass = {
        standard: 'glass-panel',
        dark: 'glass-panel-dark',
        accent: 'glass-panel-accent',
    }[variant];
    return (_jsxs("div", { className: `${variantClass} rounded-xl overflow-hidden relative ${className}`, style: borderColor ? { borderColor } : undefined, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" }), children] }));
};
