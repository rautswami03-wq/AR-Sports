import React, { useState } from 'react';
import { Check, Copy, Tv, Radio } from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { PRESET_TOURNAMENTS } from '../../theme/presetThemes';

export interface ThemeLinkItem {
  id: string;
  themeKey: string;
  name: string;
  server1Url: string;
  server2Url: string;
  mobileUrl: string;
  badge?: string;
}

export const THEME_LINKS_DATA: ThemeLinkItem[] = [
  { id: '1', themeKey: 'asia_cup', name: 'Asia Cup', server1Url: '/#/theme/1/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=asia_cup', mobileUrl: '/#/overlay?theme=asia_cup&mobile=true' },
  { id: '2', themeKey: 'cwc19', name: 'CWC 19', server1Url: '/#/theme/2/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=cwc19', mobileUrl: '/#/overlay?theme=cwc19&mobile=true' },
  { id: '3', themeKey: 'ct2025', name: 'Champions Trophy 2025', server1Url: '/#/theme/3/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=ct2025', mobileUrl: '/#/overlay?theme=ct2025&mobile=true' },
  { id: '4', themeKey: 'cwc_women25', name: 'CWC Womens 25 India', server1Url: '/#/theme/4/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=cwc_women25', mobileUrl: '/#/overlay?theme=cwc_women25&mobile=true', badge: 'NEW' },
  { id: '5', themeKey: 'wcl_fancode', name: 'WCL (Fancode)', server1Url: '/#/theme/5/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=wcl_fancode', mobileUrl: '/#/overlay?theme=wcl_fancode&mobile=true' },
  { id: '6', themeKey: 'cwc23', name: 'CWC 23 India 2.0', server1Url: '/#/theme/6/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=cwc23', mobileUrl: '/#/overlay?theme=cwc23&mobile=true' },
  { id: '7', themeKey: 'bbl_black', name: 'BBL Black', server1Url: '/#/theme/7/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=bbl_black', mobileUrl: '/#/overlay?theme=bbl_black&mobile=true' },
  { id: '8', themeKey: 'cricfusion', name: 'CricFusion Theme', server1Url: '/#/theme/8/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=cricfusion', mobileUrl: '/#/overlay?theme=cricfusion&mobile=true' },
  { id: '9', themeKey: 't20_asia24', name: 'T20 EMERGING ASIA CUP 2024', server1Url: '/#/theme/9/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=t20_asia24', mobileUrl: '/#/overlay?theme=t20_asia24&mobile=true' },
  { id: '10', themeKey: 'sa20', name: 'SA20', server1Url: '/#/theme/10/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=sa20', mobileUrl: '/#/overlay?theme=sa20&mobile=true' },
  { id: '11', themeKey: 'jiocinema', name: 'Jio Cinema', server1Url: '/#/theme/11/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=jiocinema', mobileUrl: '/#/overlay?theme=jiocinema&mobile=true' },
  { id: '12', themeKey: 'IPL', name: 'IPL', server1Url: '/#/theme/12/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=IPL', mobileUrl: '/#/overlay?theme=IPL&mobile=true' },
  { id: '13', themeKey: 'wt20_2024', name: 'WT20 2024', server1Url: '/#/theme/13/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=wt20_2024', mobileUrl: '/#/overlay?theme=wt20_2024&mobile=true' },
  { id: '14', themeKey: 'bbl_star', name: 'BBL Star Sports', server1Url: '/#/theme/14/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=bbl_star', mobileUrl: '/#/overlay?theme=bbl_star&mobile=true' },
  { id: '15', themeKey: 'ipl25', name: 'IPL 25', server1Url: '/#/theme/15/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=ipl25', mobileUrl: '/#/overlay?theme=ipl25&mobile=true' },
  { id: '16', themeKey: 'cricpic', name: 'CricPic Theme', server1Url: '/#/theme/16/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=cricpic', mobileUrl: '/#/overlay?theme=cricpic&mobile=true', badge: 'TOP' },
  { id: '17', themeKey: 'cwc23_diwali', name: 'CWC 23 India (Diwali Edition)', server1Url: '/#/theme/17/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=cwc23_diwali', mobileUrl: '/#/overlay?theme=cwc23_diwali&mobile=true', badge: 'SPECIAL' },
  { id: '18', themeKey: 'bbl_white', name: 'BBL White', server1Url: '/#/theme/18/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=bbl_white', mobileUrl: '/#/overlay?theme=bbl_white&mobile=true' },
  { id: '19', themeKey: 'cwc_t20_2020', name: 'ICC T20 World Cup 2020', server1Url: '/#/theme/19/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=cwc_t20_2020', mobileUrl: '/#/overlay?theme=cwc_t20_2020&mobile=true' },
  { id: '20', themeKey: 'icc_wc_vibrant', name: 'ICC World Cup (Vibrant Edition)', server1Url: '/#/theme/20/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=icc_wc_vibrant', mobileUrl: '/#/overlay?theme=icc_wc_vibrant&mobile=true', badge: 'NEW' },
  { id: '21', themeKey: 'super_fission', name: 'Super Fission (Neon Green)', server1Url: '/#/theme/21/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=super_fission', mobileUrl: '/#/overlay?theme=super_fission&mobile=true', badge: 'NEW' },
  { id: '22', themeKey: 'local_match_pro', name: 'Local Match Stream Pro', server1Url: '/#/theme/22/69d9cec52b632413dd8d7d48', server2Url: '/#/overlay?theme=local_match_pro', mobileUrl: '/#/overlay?theme=local_match_pro&mobile=true', badge: '1-to-1 MATCH' },
];

export const ThemeLinksPage: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { tournamentId, setTournamentId } = useBroadcastStore();

  const handleCopy = (path: string, key: string, themeKey: string) => {
    const baseUrl = window.location.href.split('#')[0].replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const fullUrl = `${baseUrl}/${cleanPath}`;

    navigator.clipboard.writeText(fullUrl);
    setCopiedKey(key);

    // Apply copied theme to store immediately so match preview changes to this theme
    if (themeKey) {
      setTournamentId(themeKey);
    }

    setTimeout(() => setCopiedKey(null), 2500);
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
            Copying any link automatically <span className="text-emerald-400 font-bold">activates the theme</span> in your match preview and OBS stream!
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
                  const isActiveTheme = tournamentId === item.themeKey;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-all ${
                        isActiveTheme ? 'bg-cyan-500/10 border-l-4 border-l-cyan-400' : 'hover:bg-slate-850/50'
                      }`}
                    >
                      <td className="py-3.5 px-6 text-center text-slate-500 font-mono">{item.id}</td>
                      <td className="py-3.5 px-6 text-white font-extrabold flex items-center gap-2">
                        {item.name}
                        {isActiveTheme && (
                          <span className="bg-emerald-500 text-slate-950 text-[10px] px-2 py-0.5 rounded font-black tracking-wider uppercase animate-pulse">
                            ACTIVE
                          </span>
                        )}
                        {item.badge && !isActiveTheme && (
                          <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded font-black border border-cyan-400/40">
                            {item.badge}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => handleCopy(item.server1Url, s1Key, item.themeKey)}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 text-xs shadow"
                        >
                          {copiedKey === s1Key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                          {copiedKey === s1Key ? 'Copied & Active' : 'Copy'}
                        </button>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => handleCopy(item.server2Url, s2Key, item.themeKey)}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 text-xs shadow"
                        >
                          {copiedKey === s2Key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                          {copiedKey === s2Key ? 'Copied & Active' : 'Copy'}
                        </button>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => handleCopy(item.mobileUrl, mobKey, item.themeKey)}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 text-xs shadow"
                        >
                          {copiedKey === mobKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Tv className="w-3.5 h-3.5 text-purple-400" />}
                          {copiedKey === mobKey ? 'Copied & Active' : 'Copy'}
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

