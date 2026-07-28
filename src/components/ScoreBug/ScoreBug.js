import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
export default function ScoreBug() {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "scorebug", children: [_jsxs("div", { className: "team", children: [_jsx("img", { src: "/logos/teamA.png", alt: "Team A" }), _jsx("span", { children: "IND" }), _jsx("strong", { children: "145/3" })] }), _jsx("div", { className: "overs", children: "16.4 Overs" }), _jsxs("div", { className: "team", children: [_jsx("img", { src: "/logos/teamB.png", alt: "Team B" }), _jsx("span", { children: "AUS" })] })] }));
}
