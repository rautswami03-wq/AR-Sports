import React, { useState } from 'react';
import { Check, Copy, Tv } from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';

export interface ThemeLinkItem {
  id: string;
  name: string;
  server1Url: string;
  server2Url: string;
  mobileUrl: string;
  badge?: string;
}

export const THEME_LINKS_DATA: ThemeLinkItem[] = [
  { id: '1', name: 'Asia Cup', server1Url: '/#/overlay?theme=asia_cup&server=1', server2Url: '/#/overlay?theme=asia_cup&server=2', mobileUrl: '/#/overlay?theme=asia_cup&mobile=true' },
  { id: '2', name: 'CWC 19', server1Url: '/#/overlay?theme=cwc19&server=1', server2Url: '/#/overlay?theme=cwc19&server=2', mobileUrl: '/#/overlay?theme=cwc19&mobile=true' },
  { id: '3', name: 'Champions Trophy 2025', server1Url: '/#/overlay?theme=ct2025&server=1', server2Url: '/#/overlay?theme=ct2025&server=2', mobileUrl: '/#/overlay?theme=ct2025&mobile=true' },
  { id: '4', name: 'CWC Womens 25 India', server1Url: '/#/overlay?theme=cwc_women25&server=1', server2Url: '/#/overlay?theme=cwc_women25&server=2', mobileUrl: '/#/overlay?theme=cwc_women25&mobile=true', badge: 'NEW' },
  { id: '5', name: 'WCL (Fancode)', server1Url: '/#/overlay?theme=wcl_fancode&server=1', server2Url: '/#/overlay?theme=wcl_fancode&server=2', mobileUrl: '/#/overlay?theme=wcl_fancode&mobile=true' },
  { id: '6', name: 'CWC 23 India 2.0', server1Url: '/#/overlay?theme=cwc23&server=1', server2Url: '/#/overlay?theme=cwc23&server=2', mobileUrl: '/#/overlay?theme=cwc23&mobile=true' },
  { id: '7', name: 'BBL Black', server1Url: '/#/overlay?theme=bbl_black&server=1', server2Url: '/#/overlay?theme=bbl_black&server=2', mobileUrl: '/#/overlay?theme=bbl_black&mobile=true' },
  { id: '8', name: 'CricFusion Theme', server1Url: '/#/overlay?theme=cricfusion&server=1', server2Url: '/#/overlay?theme=cricfusion&server=2', mobileUrl: '/#/overlay?theme=cricfusion&mobile=true' },
  { id: '9', name: 'T20 EMERGING ASIA CUP 2024', server1Url: '/#/overlay?theme=t20_asia24&server=1', server2Url: '/#/overlay?theme=t20_asia24&server=2', mobileUrl: '/#/overlay?theme=t20_asia24&mobile=true' },
  { id: '10', name: 'SA20', server1Url: '/#/overlay?theme=sa20&server=1', server2Url: '/#/overlay?theme=sa20&server=2', mobileUrl: '/#/overlay?theme=sa20&mobile=true' },
  { id: '11', name: 'Jio Cinema', server1Url: '/#/overlay?theme=jiocinema&server=1', server2Url: '/#/overlay?theme=jiocinema&server=2', mobileUrl: '/#/overlay?theme=jiocinema&mobile=true' },
  { id: '12', name: 'IPL', server1Url: '/#/overlay?theme=ipl&server=1', server2Url: '/#/overlay?theme=ipl&server=2', mobileUrl: '/#/overlay?theme=ipl&mobile=true' },
  { id: '13', name: 'WT20 2024', server1Url: '/#/overlay?theme=wt20_2024&server=1', server2Url: '/#/overlay?theme=wt20_2024&server=2', mobileUrl: '/#/overlay?theme=wt20_2024&mobile=true' },
  { id: '14', name: 'BBL Star Sports', server1Url: '/#/overlay?theme=bbl_star&server=1', server2Url: '/#/overlay?theme=bbl_star&server=2', mobileUrl: '/#/overlay?theme=bbl_star&mobile=true' },
  { id: '15', name: 'IPL 25', server1Url: '/#/overlay?theme=ipl25&server=1', server2Url: '/#/overlay?theme=ipl25&server=2', mobileUrl: '/#/overlay?theme=ipl25&mobile=true' },
  { id: '16', name: 'CricPic Theme', server1Url: '/#/overlay?theme=cricpic&server=1', server2Url: '/#/overlay?theme=cricpic&server=2', mobileUrl: '/#/overlay?theme=cricpic&mobile=true', badge: 'TOP' },
  { id: '17', name: 'CWC 23 India (Diwali Edition)', server1Url: '/#/overlay?theme=cwc23_diwali&server=1', server2Url: '/#/overlay?theme=cwc23_diwali&server=2', mobileUrl: '/#/overlay?theme=cwc23_diwali&mobile=true', badge: 'SPECIAL' },
  { id: '18', name: 'BBL White', server1Url: '/#/overlay?theme=bbl_white&server=1', server2Url: '/#/overlay?theme=bbl_white&server=2', mobileUrl: '/#/overlay?theme=bbl_white&mobile=true' },
  { id: '19', name: 'ICC T20 World Cup 2020', server1Url: '/#/overlay?theme=cwc_t20_2020&server=1', server2Url: '/#/overlay?theme=cwc_t20_2020&server=2', mobileUrl: '/#/overlay?theme=cwc_t20_2020&mobile=true' },
];

export const ThemeLinksPage: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (path: string, key: string) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans">
      <CricNavbar />

      <main className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-wider text-white mb-2">
            ALL SCOREBOARD LINKS
          </h1>
          <p className="text-slate-400 text-sm font-semibold">
            Copy any link from <span className="text-amber-400 font-bold">Server 1</span> or <span className="text-cyan-400 font-bold">Server 2</span> and add to your streaming app (OBS Studio, vMix, Prism Live).
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-xs tracking-wider font-extrabold">
                  <th className="py-4 px-6 w-16 text-center">No.</th>
                  <th className="py-4 px-6">Theme Name</th>
                  <th className="py-4 px-6 text-center w-36">Server 1</th>
                  <th className="py-4 px-6 text-center w-36">Server 2</th>
                  <th className="py-4 px-6 text-center w-44">Mobile Stream Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm font-bold">
                {THEME_LINKS_DATA.map((item) => {
                  const s1Key = `${item.id}-s1`;
                  const s2Key = `${item.id}-s2`;
                  const mobKey = `${item.id}-mob`;

                  return (
                    <tr key={item.id} className="hover:bg-slate-850/50 transition-all">
                      <td className="py-3.5 px-6 text-center text-slate-500 font-mono">{item.id}</td>
                      <td className="py-3.5 px-6 text-white font-extrabold flex items-center gap-2">
                        {item.name}
                        {item.badge && (
                          <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded font-black border border-cyan-400/40">
                            {item.badge}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => handleCopy(item.server1Url, s1Key)}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 text-xs shadow"
                        >
                          {copiedKey === s1Key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                          {copiedKey === s1Key ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => handleCopy(item.server2Url, s2Key)}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 text-xs shadow"
                        >
                          {copiedKey === s2Key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                          {copiedKey === s2Key ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => handleCopy(item.mobileUrl, mobKey)}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 text-xs shadow"
                        >
                          {copiedKey === mobKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Tv className="w-3.5 h-3.5 text-purple-400" />}
                          {copiedKey === mobKey ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
