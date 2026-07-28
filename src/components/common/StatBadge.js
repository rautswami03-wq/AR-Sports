import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const StatBadge = ({ label, value, highlight = false, color, }) => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center px-3 py-1 bg-slate-950/60 rounded-md border border-white/10 min-w-[65px]", children: [_jsx("span", { className: "text-[10px] uppercase tracking-wider font-semibold text-slate-400", children: label }), _jsx("span", { className: `font-black text-sm tracking-tight ${highlight ? 'text-amber-400' : 'text-white'}`, style: color ? { color } : undefined, children: value })] }));
};
