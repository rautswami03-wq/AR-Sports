import { jsx as _jsx } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
export const SponsorGraphicsOverlay = () => {
    const { matchDetails } = useBroadcastStore();
    return (_jsx(LowerThirdBase, { title: "OFFICIAL BROADCAST SPONSORS", subtitle: "POWERED BY", category: "SPONSORS", primaryColor: "#eab308", children: _jsx("div", { className: "flex items-center justify-around py-2", children: matchDetails.sponsors?.map((s, idx) => (_jsx("div", { className: "bg-slate-900/90 px-6 py-2 rounded-xl border border-white/10 text-white font-black tracking-widest text-sm uppercase shadow-md", children: s.name }, idx))) }) }));
};
