import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
export const TossOverlay = () => {
    const { matchDetails } = useBroadcastStore();
    return (_jsx(LowerThirdBase, { title: "OFFICIAL MATCH TOSS RESULT", subtitle: matchDetails.venue, category: "TOSS UPDATE", primaryColor: "#f59e0b", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-400 text-xs font-semibold uppercase block", children: "TOSS WINNER" }), _jsx("span", { className: "text-amber-400 font-black text-2xl uppercase", children: matchDetails.tossWinner })] }), _jsxs("div", { className: "bg-amber-500/20 border border-amber-400/50 px-4 py-2 rounded-lg text-right", children: [_jsx("span", { className: "text-slate-300 text-xs font-bold uppercase block", children: "DECISION" }), _jsxs("span", { className: "text-white font-black text-lg uppercase", children: ["ELECTED TO ", matchDetails.tossDecision.toUpperCase(), " FIRST"] })] })] }) }));
};
